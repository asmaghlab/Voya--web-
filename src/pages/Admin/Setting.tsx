// import React, { useState } from 'react';
// import { 
//   Settings, Palette, Moon, Sun, Layout, ShoppingCart, BookOpen,
//   ChevronRight
// } from 'lucide-react';

// const AdminSettings: React.FC = () => {
//   const [configuratorOpen, setConfiguratorOpen] = useState(false);
//   const [selectedColor, setSelectedColor] = useState('bg-blue-600');
//   const [sidenavType, setSidenavType] = useState('dark');
//   const [navbarFixed, setNavbarFixed] = useState(true);
//   const [sidenavMini, setSidenavMini] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);

//   const sidebarColors = [
//     'bg-blue-600', 'bg-purple-600', 'bg-green-600', 
//     'bg-red-600', 'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600'
//   ];

//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      
//       {/* Configurator Floating Button */}
//       <button
//         onClick={() => setConfiguratorOpen(!configuratorOpen)}
//         className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
//           configuratorOpen 
//             ? 'rotate-90 bg-gradient-to-r from-blue-600 to-purple-600' 
//             : 'bg-gradient-to-r from-blue-500 to-indigo-600'
//         }`}
//       >
//         <Settings size={24} className="text-white" />
//       </button>

//       {/* Configurator Sidebar */}
//       <div className={`fixed top-0 right-0 h-full z-50 transform transition-all duration-500 ease-in-out ${
//         configuratorOpen ? 'translate-x-0' : 'translate-x-full'
//       }`}>
//         <div className={`h-full w-80 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-2xl flex flex-col`}>
          
//           {/* Header */}
//           <div className={`p-6 ${selectedColor}`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-white">Configurator</h2>
//                 <p className="text-blue-100 text-sm mt-1">Customize your admin panel.</p>
//               </div>
//               <button
//                 onClick={() => setConfiguratorOpen(false)}
//                 className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
//               >
//                 <ChevronRight size={20} className="text-white" />
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-6">
            
//             {/* Sidenav Colors */}
//             <div className="mb-8">
//               <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
//                 Sidenav Colors
//               </h3>
//               <div className="flex gap-3">
//                 {sidebarColors.map((color, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedColor(color)}
//                     className={`w-8 h-8 rounded-full transform transition-all duration-200 ${
//                       selectedColor === color ? 'ring-4 ring-offset-2 ring-gray-300 scale-110' : 'hover:scale-105'
//                     } ${color}`}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Sidenav Type */}
//             <div className="mb-8">
//               <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
//                 <Layout size={16} className="inline mr-2" />
//                 Sidenav Type
//               </h3>
//               <div className="grid grid-cols-3 gap-2">
//                 {['dark', 'transparent', 'white'].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setSidenavType(type)}
//                     className={`py-3 rounded-lg text-sm font-medium transition-all ${
//                       sidenavType === type
//                         ? `${selectedColor} text-white shadow-lg`
//                         : darkMode 
//                           ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {type.toUpperCase()}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Toggle Options */}
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Navbar Fixed</span>
//                 <input type="checkbox" checked={navbarFixed} onChange={() => setNavbarFixed(!navbarFixed)} />
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sidenav Mini</span>
//                 <input type="checkbox" checked={sidenavMini} onChange={() => setSidenavMini(!sidenavMini)} />
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Light / Dark</span>
//                 <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-10 space-y-4">
//               <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
//                 <ShoppingCart size={18} />
//                 BUY NOW
//               </button>
//               <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
//                 <ShoppingCart size={18} />
//                 BUY JAVASCRIPT VERSION
//               </button>
//               <button className="w-full py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg flex items-center justify-center gap-2">
//                 <BookOpen size={18} />
//                 VIEW DOCUMENTATION
//               </button>
//             </div>

//           </div>

//         </div>
//       </div>

//       {/* Backdrop */}
//       {configuratorOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//           onClick={() => setConfiguratorOpen(false)}
//         />
//       )}

//       {/* Example Header */}
//       <div className={`h-72 relative overflow-hidden ${
//         darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800'
//       }`}>
//         <h1 className="text-white text-3xl font-bold p-6">Admin Account Settings</h1>
//       </div>

//     </div>
//   );
// };

// export default AdminSettings;
