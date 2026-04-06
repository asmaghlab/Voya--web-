import React, { useState, useEffect, useCallback } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import { 
  Users, Plus, Pencil, Trash, Search, 
  Mail, User, X, Check, Shield, Eye, 
  Download, RefreshCw, Activity, 
  TrendingUp, Clock, Zap, 
  CheckCircle, XCircle, Phone, MapPin,
  MoreHorizontal, AlertCircle, Sun, Moon
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  location: string;
  phone: string;
}

interface FormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user' | 'moderator';
  location: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
}

interface ApiUser {
  id: string;
  name: string;
  username: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  location: string;
  phone: string;
}

interface SweetAlertOptions {
  icon: 'success' | 'error' | 'warning' | 'info';
  title: string;
  text: string;
  background: string;
  color: string;
  timer?: number;
  showConfirmButton?: boolean;
}

interface DeleteAlertOptions extends SweetAlertOptions {
  showCancelButton: boolean;
  confirmButtonColor: string;
  cancelButtonColor: string;
  confirmButtonText: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>({ 
    name: '', 
    username: '', 
    email: '', 
    phone: '',
    status: 'active',
    role: 'user',
    location: 'Egypt',
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const API = 'https://692b1d9e7615a15ff24ec4d9.mockapi.io/users';

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const response: Response = await fetch(API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiUser[] = await response.json();
      
      const usersWithDefaults: User[] = data.map((user: ApiUser) => ({
        id: user.id || '',
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        status: (user.status === 'active' || user.status === 'inactive') ? user.status : 'active',
        role: (user.role === 'admin' || user.role === 'user' || user.role === 'moderator') ? user.role : 'user',
        createdAt: user.createdAt || new Date().toISOString(),
        location: user.location || 'Egypt',
        phone: user.phone || '+20 123 456 7890',
      }));
      
      setUsers(usersWithDefaults);
    } catch (err: unknown) {
      const errorMessage: string = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching users:', errorMessage);
      const alertOptions: SweetAlertOptions = {
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch users',
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#cbd5e1' : '#334155',
      };
      Swal.fire(alertOptions);
    } finally {
      setLoading(false);
    }
  }, [darkMode]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showSweetAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info'): void => {
    const alertOptions: SweetAlertOptions = {
      title,
      text,
      icon,
      background: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#cbd5e1' : '#334155',
      timer: 3000,
      showConfirmButton: false,
    };
    Swal.fire(alertOptions);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!form.name.trim()) {
      errors.name = 'Name is required';
    } else if (form.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (form.name.length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }
    
    if (!form.username.trim()) {
      errors.username = 'Username is required';
    } else if (form.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (form.phone && !/^[0-9+\-\s()]+$/.test(form.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!editUser && users.some(user => user.email.toLowerCase() === form.email.toLowerCase())) {
      errors.email = 'This email is already registered';
    }
    
    if (!editUser && users.some(user => user.username.toLowerCase() === form.username.toLowerCase())) {
      errors.username = 'This username is already taken';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    const currentFormErrors: FormErrors = { ...formErrors };
    if (name in currentFormErrors) {
      delete currentFormErrors[name as keyof FormErrors];
      setFormErrors(currentFormErrors);
    }
    
    if (name === 'status') {
      setForm(prev => ({ 
        ...prev, 
        [name]: value as 'active' | 'inactive'
      }));
    } else if (name === 'role') {
      setForm(prev => ({ 
        ...prev, 
        [name]: value as 'admin' | 'user' | 'moderator'
      }));
    } else {
      setForm(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
  };

  const handleCreate = async (): Promise<void> => {
    if (!validateForm()) {
      showSweetAlert('Validation Error', 'Please fix the errors in the form', 'error');
      return;
    }

    try {
      const response: Response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          createdAt: new Date().toISOString(),
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      closeModal();
      fetchUsers();
      showSweetAlert('Success', 'User created successfully!', 'success');
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error creating user:', errorMessage);
      showSweetAlert('Error', 'Failed to create user', 'error');
    }
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editUser) return;
    
    if (!validateForm()) {
      showSweetAlert('Validation Error', 'Please fix the errors in the form', 'error');
      return;
    }

    try {
      const response: Response = await fetch(`${API}/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      closeModal();
      fetchUsers();
      showSweetAlert('Success', 'User updated successfully!', 'success');
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error updating user:', errorMessage);
      showSweetAlert('Error', 'Failed to update user', 'error');
    }
  };

  const handleDelete = async (id: string, name: string): Promise<void> => {
    const alertOptions: DeleteAlertOptions = {
      title: 'Are you sure?',
      text: `You are about to delete ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#cbd5e1' : '#334155',
    };

    const result = await Swal.fire(alertOptions);

    if (!result.isConfirmed) return;

    try {
      const response: Response = await fetch(`${API}/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      fetchUsers();
      showSweetAlert('Deleted!', 'User has been deleted.', 'success');
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error deleting user:', errorMessage);
      showSweetAlert('Error', 'Failed to delete user', 'error');
    }
  };

  const toggleUserStatus = async (user: User): Promise<void> => {
    const newStatus: 'active' | 'inactive' = user.status === 'active' ? 'inactive' : 'active';
    const action: string = newStatus === 'active' ? 'activate' : 'deactivate';
    
    const alertOptions: DeleteAlertOptions = {
      title: 'Are you sure?',
      text: `You are about to ${action} ${user.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`,
      background: darkMode ? '#1e293b' : '#ffffff',
      color: darkMode ? '#cbd5e1' : '#334155',
    };

    const result = await Swal.fire(alertOptions);

    if (!result.isConfirmed) return;
    
    try {
      const response: Response = await fetch(`${API}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      fetchUsers();
      showSweetAlert('Success!', `User marked as ${newStatus}!`, 'success');
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error toggling user status:', errorMessage);
      showSweetAlert('Error', 'Failed to update status', 'error');
    }
  };

  const openEdit = (user: User): void => {
    setEditUser(user);
    setForm({ 
      name: user.name, 
      username: user.username, 
      email: user.email, 
      phone: user.phone || '',
      status: user.status,
      role: user.role,
      location: user.location || 'Egypt',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setEditUser(null);
    setForm({ 
      name: '', 
      username: '', 
      email: '', 
      phone: '',
      status: 'active', 
      role: 'user',
      location: 'Egypt',
    });
    setFormErrors({});
    setModalOpen(false);
  };

  const getInitials = (name: string): string => {
    if (!name.trim()) return '??';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name: string): string => {
    const colors: string[] = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
    ];
    const index: number = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const handleExport = (): void => {
    try {
      const csvContent: string = [
        ['ID', 'Name', 'Username', 'Email', 'Status', 'Role', 'Location', 'Phone', 'Created At'],
        ...users.map(user => [
          user.id,
          `"${user.name}"`,
          `"${user.username}"`,
          `"${user.email}"`,
          user.status,
          user.role,
          `"${user.location || ''}"`,
          `"${user.phone || ''}"`,
          user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
        ])
      ].map(row => row.join(',')).join('\n');

      const blob: Blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url: string = window.URL.createObjectURL(blob);
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = url;
      a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showSweetAlert('Success', 'Users exported successfully!', 'success');
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error exporting users:', errorMessage);
      showSweetAlert('Error', 'Failed to export users', 'error');
    }
  };

  const handleRefresh = (): void => {
    fetchUsers();
    showSweetAlert('Success', 'Data refreshed!', 'success');
  };

  const toggleDarkMode = (): void => {
    setDarkMode(!darkMode);
    showSweetAlert('Info', `Switched to ${!darkMode ? 'dark' : 'light'} mode`, 'info');
  };

  const columns: TableColumn<User>[] = isMobile ? [
    {
      name: 'USER',
      selector: (row: User) => row.name,
      sortable: true,
      cell: (row: User) => (
        <div className="py-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRandomColor(row.name)} text-white flex items-center justify-center font-bold shadow-md`}>
                {getInitials(row.name)}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                row.status === 'active' ? 'bg-green-500 border-white' : 'bg-red-500 border-white'
              }`}></div>
            </div>
            <div className="flex-1">
              <div className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'} text-sm`}>
                {row.name}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <User size={12} />
                @{row.username}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Mail size={12} />
                {row.email}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={12} />
                {row.location || 'Unknown'}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  row.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  row.role === 'admin' ? 'bg-red-50 text-red-800' : 
                  row.role === 'moderator' ? 'bg-blue-50 text-blue-800' : 
                  'bg-green-50 text-green-800'
                }`}>
                  {row.role}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(row)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(row.id, row.name)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
                <button
                  onClick={() => toggleUserStatus(row)}
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  title={row.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    }
  ] : [
    {
      name: 'ID',
      selector: (row: User) => row.id,
      sortable: true,
      width: '80px'
    },
    {
      name: 'USER',
      selector: (row: User) => row.name,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-3 py-2">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRandomColor(row.name)} text-white flex items-center justify-center font-bold shadow-md`}>
              {getInitials(row.name)}
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
              row.status === 'active' ? 'bg-green-500 border-white' : 'bg-red-500 border-white'
            }`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'} text-sm truncate`}>
              {row.name}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
              <User size={12} />
              @{row.username}
            </div>
          </div>
        </div>
      ),
      width: '200px',
      grow: 1
    },
    {
      name: 'CONTACT',
      selector: (row: User) => row.email,
      sortable: true,
      cell: (row: User) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-slate-400" />
            <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'} truncate`}>
              {row.email}
            </span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Phone size={12} />
            <span>{row.phone || 'N/A'}</span>
          </div>
        </div>
      ),
      width: '220px',
      hide: 'sm' as const
    },
    {
      name: 'LOCATION',
      selector: (row: User) => row.location || '',
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-400" />
          <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            {row.location || 'Unknown'}
          </span>
        </div>
      ),
      width: '140px',
      hide: 'md' as const
    },
    {
      name: 'STATUS',
      selector: (row: User) => row.status,
      sortable: true,
      cell: (row: User) => (
        <button
          onClick={() => toggleUserStatus(row)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            row.status === 'active' 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {row.status === 'active' ? 
            <div className="flex items-center gap-1">
              <CheckCircle size={12} />
              Active
            </div> : 
            <div className="flex items-center gap-1">
              <XCircle size={12} />
              Inactive
            </div>
          }
        </button>
      ),
      width: '120px'
    },
    {
      name: 'ROLE',
      selector: (row: User) => row.role,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <Shield size={14} className={
            row.role === 'admin' ? 'text-red-500' : 
            row.role === 'moderator' ? 'text-blue-500' : 
            'text-green-500'
          } />
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            row.role === 'admin' ? 'bg-red-50 text-red-800' : 
            row.role === 'moderator' ? 'bg-blue-50 text-blue-800' : 
            'bg-green-50 text-green-800'
          }`}>
            {row.role}
          </span>
        </div>
      ),
      width: '140px',
      hide: 'sm' as const
    },
    {
      name: 'ACTIONS',
      cell: (row: User) => (
        <div className="flex gap-1">
          <button
            onClick={() => openEdit(row)}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash size={16} />
          </button>
          <div className="relative md:hidden">
            <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      ),
      width: '140px'
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: 'transparent',
      },
    },
    headRow: {
      style: {
        backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
        borderBottomWidth: '1px',
        borderBottomColor: darkMode ? '#334155' : '#e2e8f0',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: darkMode ? '#cbd5e1' : '#475569',
      },
    },
    rows: {
      style: {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        borderBottomColor: darkMode ? '#334155' : '#e2e8f0',
        '&:hover': {
          backgroundColor: darkMode ? '#334155' : '#f8fafc',
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        borderTopColor: darkMode ? '#334155' : '#e2e8f0',
        fontSize: '0.875rem',
        color: darkMode ? '#cbd5e1' : '#64748b',
      },
    },
  };

  const filteredUsers: User[] = users.filter(user => {
    const matchesSearch: boolean = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus: boolean = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesRole: boolean = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const activeUsers: number = users.filter(user => user.status === 'active').length;
  const adminUsers: number = users.filter(user => user.role === 'admin').length;
  const newUsersThisMonth: number = users.filter(user => {
    if (!user.createdAt) return false;
    try {
      const userDate: Date = new Date(user.createdAt);
      const now: Date = new Date();
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
    } catch {
      return false;
    }
  }).length;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="overflow-x-auto">
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b shadow-sm`}>
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg`}>
                  <Users className="text-blue-600" size={isMobile ? 20 : 24} />
                </div>
                <div>
                  <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    Users Management
                  </h1>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>
                    {filteredUsers.length} users found
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleRefresh}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                  title="Refresh"
                >
                  <RefreshCw size={20} />
                </button>
                
                <button 
                  onClick={handleExport}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                  title="Export"
                >
                  <Download size={20} />
                </button>

                <button 
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? (
                    <Sun size={20} className="text-yellow-500" />
                  ) : (
                    <Moon size={20} className="text-slate-700" />
                  )}
                </button>

                <button 
                  onClick={() => setModalOpen(true)} 
                  className="flex items-center gap-2 bg-[#0390b7] hover:bg-[#027ba0] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus size={20} /> {!isMobile && 'Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b shadow-sm`}>
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                  selectedStatus === 'all' 
                    ? 'bg-[#0390b7] text-white' 
                    : `${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setSelectedStatus('active')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                  selectedStatus === 'active' 
                    ? 'bg-green-500 text-white' 
                    : `${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setSelectedStatus('inactive')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                  selectedStatus === 'inactive' 
                    ? 'bg-red-500 text-white' 
                    : `${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                Inactive
              </button>
              <select
                value={selectedRole}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRole(e.target.value)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${
                  darkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-gray-100 text-gray-700 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-[#0390b7]`}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg p-4 shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Total Users</p>
                  <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'} mt-1`}>
                    {users.length}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-xs text-green-500">+12% from last month</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg`}>
                  <Users className="text-blue-600" size={isMobile ? 20 : 24} />
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg p-4 shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Active Users</p>
                  <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'} mt-1`}>
                    {activeUsers}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Activity size={12} className="text-green-500" />
                    <span className="text-xs text-green-500">+8% from last month</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} rounded-lg`}>
                  <Check className="text-green-600" size={isMobile ? 20 : 24} />
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg p-4 shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Admins</p>
                  <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'} mt-1`}>
                    {adminUsers}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock size={12} className="text-red-500" />
                    <span className="text-xs text-red-500">No change</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-lg`}>
                  <Shield className="text-purple-600" size={isMobile ? 20 : 24} />
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg p-4 shadow-sm border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>New This Month</p>
                  <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'} mt-1`}>
                    {newUsersThisMonth}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Zap size={12} className="text-orange-500" />
                    <span className="text-xs text-orange-500">+15% from last month</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'} rounded-lg`}>
                  <Plus className="text-orange-600" size={isMobile ? 20 : 24} />
                </div>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg p-4 shadow-sm border mb-6`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
              <input
                type="text"
                placeholder="Search users by name, email, or location..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border ${darkMode ? 'border-slate-700 bg-slate-700/50 text-slate-200' : 'border-slate-200 bg-white text-slate-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0390b7]`}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0390b7] mb-4"></div>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Loading users...</p>
            </div>
          ) : (
            <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-sm border overflow-hidden`}>
              <DataTable
                columns={columns}
                data={filteredUsers}
                customStyles={customStyles}
                pagination
                paginationPerPage={isMobile ? 5 : 10}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                noDataComponent={
                  <div className="py-12 text-center">
                    <Users size={48} className={`mx-auto ${darkMode ? 'text-slate-600' : 'text-slate-300'} mb-4`} />
                    <div className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} mb-4`}>No users found</div>
                    <button 
                      onClick={() => setModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-[#0390b7] hover:bg-[#027ba0] text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus size={16} /> Add First User
                    </button>
                  </div>
                }
                highlightOnHover
                pointerOnHover
                responsive
              />
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl w-full max-w-md my-auto shadow-xl`}>
            <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {editUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button 
                  onClick={closeModal}
                  className={`p-1 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded transition-colors`}
                >
                  <X size={20} className={darkMode ? 'text-slate-300' : 'text-slate-700'} />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                  Full Name *
                </label>
                <input 
                  name="name" 
                  placeholder="John Doe" 
                  className={`w-full px-3 py-2.5 border ${
                    formErrors.name 
                      ? 'border-red-500' 
                      : darkMode ? 'border-slate-700' : 'border-slate-200'
                  } ${darkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-white text-slate-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0390b7]`} 
                  value={form.name} 
                  onChange={handleChange} 
                  required
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                  Username *
                </label>
                <input 
                  name="username" 
                  placeholder="johndoe" 
                  className={`w-full px-3 py-2.5 border ${
                    formErrors.username 
                      ? 'border-red-500' 
                      : darkMode ? 'border-slate-700' : 'border-slate-200'
                  } ${darkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-white text-slate-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0390b7]`} 
                  value={form.username} 
                  onChange={handleChange} 
                  required
                />
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.username}
                  </p>
                )}
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                  Email *
                </label>
                <input 
                  name="email" 
                  type="email"
                  placeholder="john@example.com" 
                  className={`w-full px-3 py-2.5 border ${
                    formErrors.email 
                      ? 'border-red-500' 
                      : darkMode ? 'border-slate-700' : 'border-slate-200'
                  } ${darkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-white text-slate-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0390b7]`} 
                  value={form.email} 
                  onChange={handleChange} 
                  required
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                  Phone
                </label>
                <input 
                  name="phone" 
                  placeholder="+20 123 456 7890" 
                  className={`w-full px-3 py-2.5 border ${
                    formErrors.phone 
                      ? 'border-red-500' 
                      : darkMode ? 'border-slate-700' : 'border-slate-200'
                  } ${darkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-white text-slate-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0390b7]`} 
                  value={form.phone} 
                  onChange={handleChange} 
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.phone}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                    Status
                  </label>
                  <select 
                    name="status"
                    className={`w-full px-3 py-2.5 border ${darkMode ? 'border-slate-700 bg-slate-700/50 text-slate-200' : 'border-slate-200 bg-white text-slate-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0390b7]`}
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                    Role
                  </label>
                  <select 
                    name="role"
                    className={`w-full px-3 py-2.5 border ${darkMode ? 'border-slate-700 bg-slate-700/50 text-slate-200' : 'border-slate-200 bg-white text-slate-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0390b7]`}
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                  Location
                </label>
                <input 
                  name="location" 
                  placeholder="Egypt" 
                  className={`w-full px-3 py-2.5 border ${darkMode ? 'border-slate-700 bg-slate-700/50 text-slate-200' : 'border-slate-200 bg-white text-slate-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0390b7]`} 
                  value={form.location} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className={`p-4 sm:p-6 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'} flex flex-col sm:flex-row gap-3`}>
              <button 
                onClick={closeModal} 
                className={`flex-1 px-4 py-2.5 ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} rounded-lg font-medium transition-colors`}
              >
                Cancel
              </button>
              <button 
                onClick={editUser ? handleUpdate : handleCreate} 
                className="flex-1 px-4 py-2.5 bg-[#0390b7] hover:bg-[#027ba0] text-white rounded-lg font-medium transition-colors"
              >
                {editUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;