import { Helmet } from "react-helmet-async";
import Hero from "./Hero";
import CompanyStory from "./CompanyStory";
import Stats from "./Stats";
import CTA from "./CTA";

const AboutUsPage = () => {
  return (
    <>
      <Helmet>

        <title>Voya | About Us </title>
        <meta
          name="description"
          content="Discover our journey and explore with us. Learn about our team, our story, and our passion for creating unforgettable travel experiences."
        />
      </Helmet>

      <main className="min-h-screen overflow-x-hidden">
        <Hero />
        <CompanyStory />
        <Stats />
        <CTA />
      </main>
    </>
  );
};

export default AboutUsPage;
