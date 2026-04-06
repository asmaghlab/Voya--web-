import React, { useState, useEffect, createContext, useContext, ReactNode, ChangeEvent } from 'react';
import { 
  Settings, Palette, Moon, Sun, Layout, ShoppingCart, BookOpen,
  ChevronRight, Pencil, X, Mail, MapPin, Phone, Globe, Briefcase, User,
  LucideIcon
} from 'lucide-react';

// Type Definitions
interface ColorScheme {
  primary: string;
  light: string;
  bg: string;
  text: string;
  hover: string;
  border: string;
  ring: string;
  bgLight: string;
  bgIcon: string;
}

interface ColorSchemes {
  [key: string]: ColorScheme;
}

interface ThemeContextType {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  sidenavType: string;
  setSidenavType: (type: string) => void;
  navbarFixed: boolean;
  setNavbarFixed: (fixed: boolean) => void;
  sidenavMini: boolean;
  setSidenavMini: (mini: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  theme: ColorScheme;
  colorSchemes: ColorSchemes;
}

interface Field {
  label: string;
  name: string;
  icon: LucideIcon;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: string;
  address: string;
  city: string;
  postalCode: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  role: string;
  address: string;
  city: string;
  postalCode: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  role: string;
  address: string;
  city: string;
  postalCode: string;
  username: string;
  firstName: string;
  lastName: string;
}

// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [selectedColor, setSelectedColor] = useState<string>('cyan');
  const [sidenavType, setSidenavType] = useState<string>('dark');
  const [navbarFixed, setNavbarFixed] = useState<boolean>(true);
  const [sidenavMini, setSidenavMini] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const colorSchemes: ColorSchemes = {
    cyan: {
      primary: 'from-cyan-500 to-sky-600',
      light: 'cyan',
      bg: 'bg-cyan-500',
      text: 'text-cyan-600',
      hover: 'hover:text-cyan-600',
      border: 'border-cyan-500',
      ring: 'ring-cyan-200',
      bgLight: 'bg-cyan-50',
      bgIcon: 'bg-cyan-100',
    },
    blue: {
      primary: 'from-blue-600 to-indigo-600',
      light: 'blue',
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      hover: 'hover:text-blue-600',
      border: 'border-blue-500',
      ring: 'ring-blue-200',
      bgLight: 'bg-blue-50',
      bgIcon: 'bg-blue-100',
    },
    purple: {
      primary: 'from-purple-600 to-pink-600',
      light: 'purple',
      bg: 'bg-purple-600',
      text: 'text-purple-600',
      hover: 'hover:text-purple-600',
      border: 'border-purple-500',
      ring: 'ring-purple-200',
      bgLight: 'bg-purple-50',
      bgIcon: 'bg-purple-100',
    },
    green: {
      primary: 'from-green-600 to-emerald-600',
      light: 'green',
      bg: 'bg-green-600',
      text: 'text-green-600',
      hover: 'hover:text-green-600',
      border: 'border-green-500',
      ring: 'ring-green-200',
      bgLight: 'bg-green-50',
      bgIcon: 'bg-green-100',
    },
    red: {
      primary: 'from-red-600 to-rose-600',
      light: 'red',
      bg: 'bg-red-600',
      text: 'text-red-600',
      hover: 'hover:text-red-600',
      border: 'border-red-500',
      ring: 'ring-red-200',
      bgLight: 'bg-red-50',
      bgIcon: 'bg-red-100',
    },
    orange: {
      primary: 'from-orange-600 to-amber-600',
      light: 'orange',
      bg: 'bg-orange-600',
      text: 'text-orange-600',
      hover: 'hover:text-orange-600',
      border: 'border-orange-500',
      ring: 'ring-orange-200',
      bgLight: 'bg-orange-50',
      bgIcon: 'bg-orange-100',
    },
    pink: {
      primary: 'from-pink-600 to-rose-600',
      light: 'pink',
      bg: 'bg-pink-600',
      text: 'text-pink-600',
      hover: 'hover:text-pink-600',
      border: 'border-pink-500',
      ring: 'ring-pink-200',
      bgLight: 'bg-pink-50',
      bgIcon: 'bg-pink-100',
    },
  };

  const theme = colorSchemes[selectedColor];

  return (
    <ThemeContext.Provider value={{
      selectedColor,
      setSelectedColor,
      sidenavType,
      setSidenavType,
      navbarFixed,
      setNavbarFixed,
      sidenavMini,
      setSidenavMini,
      darkMode,
      setDarkMode,
      theme,
      colorSchemes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Configurator Component
interface ConfiguratorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Configurator = ({ open, setOpen }: ConfiguratorProps) => {
  const { 
    selectedColor, 
    setSelectedColor, 
    sidenavType, 
    setSidenavType,
    navbarFixed,
    setNavbarFixed,
    sidenavMini,
    setSidenavMini,
    darkMode,
    setDarkMode,
    theme,
    colorSchemes
  } = useTheme();

  return (
    <>
      {/* Configurator Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          open 
            ? `rotate-90 bg-gradient-to-r ${theme.primary}` 
            : `bg-gradient-to-r ${theme.primary}`
        }`}
      >
        <Settings size={24} className="text-white" />
      </button>

      {/* Configurator Sidebar */}
      <div className={`fixed top-0 right-0 h-full z-50 transform transition-all duration-500 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className={`h-full w-80 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-2xl flex flex-col`}>
          
          {/* Header */}
          <div className={`p-6 bg-gradient-to-r ${theme.primary}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Theme Settings</h2>
                <p className="text-white text-opacity-80 text-sm mt-1">Customize your colors</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 flex items-center">
                <Palette size={16} className="mr-2" />
                Theme Colors
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.keys(colorSchemes).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-12 rounded-xl transform transition-all duration-200 ${
                      selectedColor === color ? 'ring-4 ring-offset-2 ring-gray-300 scale-105' : 'hover:scale-105'
                    } ${colorSchemes[color].bg} shadow-md`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Sidenav Type */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                <Layout size={16} className="inline mr-2" />
                Sidenav Type
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {['dark', 'transparent', 'white'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSidenavType(type)}
                    className={`py-3 rounded-lg text-sm font-medium transition-all ${
                      sidenavType === type
                        ? `bg-gradient-to-r ${theme.primary} text-white shadow-lg`
                        : darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Navbar Fixed</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={navbarFixed} 
                    onChange={() => setNavbarFixed(!navbarFixed)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${theme.bg}`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sidenav Mini</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={sidenavMini} 
                    onChange={() => setSidenavMini(!sidenavMini)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${theme.bg}`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={() => setDarkMode(!darkMode)}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${darkMode ? 'peer-checked:bg-gray-700' : 'peer-checked:bg-gray-600'}`}></div>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className={`mt-8 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                💡 Changes apply instantly to all pages
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

// Admin Profile Page Component
const AdminProfilePage = () => {
  const { theme, darkMode } = useTheme();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editAdminId, setEditAdminId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    role: '',
    address: '',
    city: '',
    postalCode: '',
    username: '',
    firstName: '',
    lastName: '',
  });

  const API = 'https://692b1d9e7615a15ff24ec4d9.mockapi.io/users';

  useEffect(() => {
    fetch(API)
      .then((res: Response) => res.json())
      .then((data: ApiUser[]) => {
        const adminList: Admin[] = data
          .filter((a: ApiUser) => a.role === 'admin')
          .map((admin: ApiUser) => ({
            ...admin,
            username: admin.username || `admin.${admin.name.toLowerCase().replace(/\s+/g, '.')}`,
            firstName: admin.firstName || admin.name.split(' ')[0] || '',
            lastName: admin.lastName || admin.name.split(' ').slice(1).join(' ') || '',
            address: admin.address || '123 Main Street',
            city: admin.city || 'New York',
            country: admin.country || 'United States',
            postalCode: admin.postalCode || '10001',
            phone: admin.phone || '',
          }));
        setAdmins(adminList);
      })
      .catch((error: Error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (admin: Admin) => {
    setEditAdminId(admin.id);
    setForm({
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      country: admin.country || '',
      role: admin.role || '',
      address: admin.address || '',
      city: admin.city || '',
      postalCode: admin.postalCode || '',
      username: admin.username || '',
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
    });
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editAdminId) return;
    await fetch(`${API}/${editAdminId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setAdmins((prev: Admin[]) =>
      prev.map((admin: Admin) => (admin.id === editAdminId ? { ...admin, ...form } : admin))
    );
    setEditAdminId(null);
  };

  const fields: Field[] = [
    { label: 'Full Name', name: 'name', icon: User },
    { label: 'Username', name: 'username', icon: User },
    { label: 'First Name', name: 'firstName', icon: User },
    { label: 'Last Name', name: 'lastName', icon: User },
    { label: 'Email', name: 'email', icon: Mail },
    { label: 'Phone', name: 'phone', icon: Phone },
    { label: 'Address', name: 'address', icon: MapPin },
    { label: 'City', name: 'city', icon: MapPin },
    { label: 'Country', name: 'country', icon: Globe },
    { label: 'Postal Code', name: 'postalCode', icon: MapPin },
    { label: 'Role', name: 'role', icon: Briefcase },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50'} flex justify-center items-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 ${theme.border} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg font-medium`}>Loading admin profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : ''} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Admin Profiles</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage your administrative team members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {admins.map((admin: Admin) => (
            <div
              key={admin.id}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${theme.primary} rounded-full -mr-20 -mt-20 opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${theme.primary} rounded-full -ml-16 -mb-16 opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              
              <button
                onClick={() => handleEdit(admin)}
                className={`absolute top-6 right-6 text-gray-400 ${theme.hover} ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded-xl transition-all duration-200 z-10 hover:scale-110`}
              >
                <Pencil size={20} />
              </button>

              <div className="flex items-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${theme.primary} flex items-center justify-center text-white text-3xl font-bold shadow-xl`}>
                  {admin.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} break-all`}>{admin.name}</h2>
                  <p className={`${theme.text} text-sm font-semibold mt-1 break-all`}>{admin.role || 'Administrator'}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className={`flex items-center bg-gradient-to-r ${darkMode ? 'from-gray-700 to-gray-700' : 'from-gray-50 to-cyan-50'} p-3 rounded-xl`}>
                  <div className={`w-10 h-10 ${theme.bgIcon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <User className={theme.text} size={18} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Username</p>
                    <span className={`break-all font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{admin.username}</span>
                  </div>
                </div>
                <div className={`flex items-center bg-gradient-to-r ${darkMode ? 'from-gray-700 to-gray-700' : 'from-gray-50 to-sky-50'} p-3 rounded-xl`}>
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-sky-600" size={18} />
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Email</p>
                    <span className={`break-all font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{admin.email}</span>
                  </div>
                </div>
                <div className={`flex items-center bg-gradient-to-r ${darkMode ? 'from-gray-700 to-gray-700' : 'from-gray-50 to-red-50'} p-3 rounded-xl`}>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-red-600" size={18} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Location</p>
                    <span className={`break-all font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{admin.city}, {admin.country}</span>
                  </div>
                </div>
                {admin.phone && (
                  <div className={`flex items-center bg-gradient-to-r ${darkMode ? 'from-gray-700 to-gray-700' : 'from-gray-50 to-green-50'} p-3 rounded-xl`}>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="text-green-600" size={18} />
                    </div>
                    <div className="ml-3">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Phone</p>
                      <span className={`break-all font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{admin.phone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editAdminId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
            <div className={`bg-gradient-to-r ${theme.primary} p-6 flex justify-between items-center text-white`}>
              <div>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <p className="text-white text-opacity-80 text-sm mt-1">Update administrator information</p>
              </div>
              <button 
                onClick={() => setEditAdminId(null)} 
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field: Field) => {
                  const IconComponent = field.icon;
                  return (
                    <div key={field.name} className={field.name === 'address' ? 'md:col-span-2' : ''}>
                      <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                        <IconComponent size={16} className="mr-2 text-gray-400" />
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className={`w-full px-4 py-3 border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all`}
                        value={form[field.name as keyof FormData]}
                        onChange={handleChange}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} p-6 flex justify-end gap-3`}>
              <button
                onClick={() => setEditAdminId(null)}
                className={`px-6 py-3 border-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} rounded-xl font-medium transition-all`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className={`px-6 py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl hover:shadow-xl font-medium transition-all`}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
export default function App() {
  const [configuratorOpen, setConfiguratorOpen] = useState<boolean>(false);

  return (
    <ThemeProvider>
      <AdminProfilePage />
      <Configurator open={configuratorOpen} setOpen={setConfiguratorOpen} />
    </ThemeProvider>
  );
}