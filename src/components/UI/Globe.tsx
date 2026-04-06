import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { feature } from 'topojson-client';

interface Topology {
  type: "Topology";
  objects: {
    countries: {
      type: "GeometryCollection";
      geometries: Array<{
        type: string;
        arcs: number[][][];
        properties?: Record<string, unknown>;
      }>;
    };
  };
  arcs: number[][][];
  transform?: {
    scale: [number, number];
    translate: [number, number];
  };
}

interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: Record<string, unknown>;
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface SceneRef {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  globe: THREE.Group;
}

interface MousePosition {
  x: number;
  y: number;
}

const Globe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationRef = useRef<number>();
  const sceneRef = useRef<SceneRef | null>(null);

  //Brand Colors for Globe Points  
  const brandColors = [
    "#3b82f6", // primary blue
    "#0ea5e9", // cyan
    "#10b981", // green
    "#8b5cf6", // purple
    "#ec4899", // pink
  ];

  let colorIndex = 0;
// Function to process coordinates and assign colors
    const processCoordinate = (lat: number, lon: number, radius: number, pts: number[], colors: number[]): void => {
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;

    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lonRad);

    pts.push(x, y, z);

    //COLOR LOGIC 
    const color = new THREE.Color(brandColors[colorIndex]);
    colorIndex = (colorIndex + 1) % brandColors.length;
    colors.push(color.r, color.g, color.b);
  };

  const processPolygonCoordinates = (
    coordinates: number[][][],
    radius: number,
    pts: number[],
    colors: number[]
  ): void => {
    coordinates.forEach((ring: number[][]) => {
      ring.forEach(([lon, lat]) => {
        processCoordinate(lat, lon, radius, pts, colors);
      });
    });
  };

  const processMultiPolygonCoordinates = (
    coordinates: number[][][][],
    radius: number,
    pts: number[],
    colors: number[]
  ): void => {
    coordinates.forEach((polygon: number[][][]) => {
      processPolygonCoordinates(polygon, radius, pts, colors);
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    const radius = 1;

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((res: Response) => res.json())
      .then((worldData: Topology) => {
        const worldGeo = feature(worldData, worldData.objects.countries) as GeoJSONFeatureCollection;
        const pts: number[] = [];
        const colors: number[] = [];

        worldGeo.features.forEach((countryFeature: GeoJSONFeature) => {
          const geometry = countryFeature.geometry;

          if (geometry.type === 'Polygon') {
            processPolygonCoordinates(geometry.coordinates as number[][][], radius, pts, colors);
          } else if (geometry.type === 'MultiPolygon') {
            processMultiPolygonCoordinates(geometry.coordinates as number[][][][], radius, pts, colors);
          }
        });

        const continentGeo = new THREE.BufferGeometry();
        continentGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        continentGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const continentMat = new THREE.PointsMaterial({
          vertexColors: true,
          size: 0.017,
          opacity: 1,
          transparent: false
        });

        const continentPoints = new THREE.Points(continentGeo, continentMat);
        globeGroup.add(continentPoints);
      })
      .catch((error: Error) => {
        console.error('Error loading map data:', error);
      });

    globeGroup.rotation.x = 0.25;
    scene.add(globeGroup);

    sceneRef.current = { scene, camera, renderer, globe: globeGroup };

    const handleResize = (): void => {
      if (!sceneRef.current || !containerRef.current) return;
      const { camera, renderer } = sceneRef.current;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const handleOrientationChange = (): void => {
      setTimeout(handleResize, 100);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const animate = (): void => {
      if (!sceneRef.current) return;

      const { scene, camera, renderer, globe } = sceneRef.current;

      if (!isHovered) globe.rotation.y += 0.003;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered]);

  useEffect(() => {
    if (!containerRef.current) return;

    let dragging = false;
    let prev: MousePosition = { x: 0, y: 0 };
    const container = containerRef.current;

    const handleMouseDown = (e: MouseEvent): void => {
      dragging = true;
      prev = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!dragging || !sceneRef.current) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;

      sceneRef.current.globe.rotation.y += dx * 0.005;
      sceneRef.current.globe.rotation.x += dy * 0.005;

      prev = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (): void => {
      dragging = false;
      container.style.cursor = 'grab';
    };

    const handleTouchStart = (e: TouchEvent): void => {
      if (e.touches.length !== 1) return;
      dragging = true;
      prev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (!dragging || !sceneRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prev.x;
      const dy = e.touches[0].clientY - prev.y;

      sceneRef.current.globe.rotation.y += dx * 0.01;
      sceneRef.current.globe.rotation.x += dy * 0.01;

      prev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      e.preventDefault();
    };

    const handleTouchEnd = (): void => {
      dragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    container.style.cursor = 'grab';

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] md:min-h-[500px]"
      style={{
        overflow: "hidden",
        touchAction: "none"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

export default Globe;
