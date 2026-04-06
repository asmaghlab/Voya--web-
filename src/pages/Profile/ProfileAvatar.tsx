import { useState } from "react";
import { useAppDispatch } from "@/routes/hooks";
import { updateUserLocally } from "@/features/auth/authSlice";
import { updateUserImage } from "./ProfileService";

export default function ProfileAvatar({ user }) {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user.image || null);
  const dispatch = useAppDispatch();

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "avatars");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dyvbg3cgl/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");

    return res.json();
  };

  const handleUpload = async (file) => {
    if (!file) return;

    try {
      setLoading(true);

      // 1️⃣ Upload to Cloudinary
      const data = await uploadToCloudinary(file);

      // 2️⃣ Save URL in API
      await updateUserImage(user.id, data.secure_url);

      // 3️⃣ Update Redux + localStorage
      dispatch(updateUserLocally({ image: data.secure_url }));

      // 4️⃣ Update UI
      setAvatar(data.secure_url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-28 h-28">
      <img
        src={
          avatar ||
          `https://ui-avatars.com/api/?name=${user.name}&size=200`
        }
        alt={user.name}
        className="w-28 h-28 rounded-full object-cover border-4 "
      />

      <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white rounded-full cursor-pointer opacity-0 hover:opacity-100 transition">
        {loading ? "Uploading..." : "Change"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </label>
    </div>
  );
}
