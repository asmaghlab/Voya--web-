import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { Helmet } from "react-helmet-async";
import { updateUserProfile } from "@/features/auth/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import { Mail, User, Phone, Globe, Edit2, Save, X } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import MyRoadMap from "./MyRoadMap";

export default function Profile() {
  const dispatch = useAppDispatch();
 
 
  const { user } = useAppSelector((state) => state.auth);



  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user?.email) {
  
  
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
   
   
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    


    setSuccessMessage("");
    setErrorMessage("");
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};



    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }



    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }



    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone) || formData.phone.trim().length < 8) {
      newErrors.phone = "Invalid phone number";
    }



    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user?.id) return;



    if (!validateForm()) {
      setErrorMessage("Please fix the errors before saving");
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      const resultAction = await dispatch(
        updateUserProfile({ id: user.id, ...formData })
      );
      
      if (updateUserProfile.fulfilled.match(resultAction)) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setErrors({});
        
      
      
      
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(resultAction.payload as string || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
      });
    }
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#252836] border-0 shadow-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <p className="text-xl font-semibold text-white mb-2">
              Authentication Required
            </p>
            <p className="text-gray-400">
              Please log in to view your profile and bookings
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
        <Helmet>
            <title>Voya | Profile </title>
          </Helmet>
      <div className="container mx-auto max-w-7xl space-y-6">
        
        {/* Header with Avatar */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-white rounded-2xl p-6 shadow-lg border-l-4 border-cyan-400">
       
       
          <ProfileAvatar user={user} />



          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              {user.name}
            </h1>
            <p className="text-slate-600 text-sm font-medium">{user.email}</p>
          </div>

        
        
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Edit2 className="h-5 w-5" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Details Card */}
        <Card className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <User className="h-5 w-5 text-cyan-600" />
                </div>
                Profile Information
              </CardTitle>

      
      
      
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2 group">
                <label className="text-sm text-slate-600 flex items-center gap-2 font-semibold">
                  <User className="h-4 w-4 text-cyan-500" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white rounded-lg px-4 py-3 text-slate-800 border-2 border-cyan-400 focus:border-cyan-600 outline-none transition-colors duration-300 font-medium"
                  />
                ) : (
                  <div className="bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border-2 border-slate-200 group-hover:border-cyan-400 transition-colors duration-300 font-medium">
                    {user.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                <label className="text-sm text-slate-600 flex items-center gap-2 font-semibold">
                  <Mail className="h-4 w-4 text-cyan-500" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white rounded-lg px-4 py-3 text-slate-800 border-2 border-cyan-400 focus:border-cyan-600 outline-none transition-colors duration-300 font-medium"
                  />
                ) : (
                  <div className="bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border-2 border-slate-200 group-hover:border-cyan-400 transition-colors duration-300 font-medium">
                    {user.email}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2 group">
                <label className="text-sm text-slate-600 flex items-center gap-2 font-semibold">
                  <Phone className="h-4 w-4 text-cyan-500" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white rounded-lg px-4 py-3 text-slate-800 border-2 border-cyan-400 focus:border-cyan-600 outline-none transition-colors duration-300 font-medium"
                  />
                ) : (
                  <div className="bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border-2 border-slate-200 group-hover:border-cyan-400 transition-colors duration-300 font-medium">
                    {user.phone}
                  </div>
                )}
              </div>

              {/* Country */}
              <div className="space-y-2 group">
                <label className="text-sm text-slate-600 flex items-center gap-2 font-semibold">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  Country
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-white rounded-lg px-4 py-3 text-slate-800 border-2 border-cyan-400 focus:border-cyan-600 outline-none transition-colors duration-300 font-medium"
                  />
                ) : (
                  <div className="bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border-2 border-slate-200 group-hover:border-cyan-400 transition-colors duration-300 font-medium">
                    {user.country}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* {User Roadmap} */}
        <MyRoadMap/>
      </div>
    </div>
  );
}