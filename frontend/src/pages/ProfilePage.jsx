import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Camera, User, Mail } from "lucide-react"

const ProfilePage = () => {
  const { updateProfile, isUpdatingProfile, authUser } = useAuthStore();
  const [selected, setSelected] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return; 

    // setLoading(true);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        
       const base64Image = reader.result; 
       setSelected(base64Image)
       await updateProfile({profilePic: base64Image}); 
        // setLoading(false); 
      };
  };
  return (
    <div className=' h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 '>
          <div className="text-center py-2">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img
                src={selected ||authUser.ProfilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt="Profile"
                className='size-32 rounded-full object-cover border-4' />
              <label htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}>
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id='avatar-upload'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                   />
              </label>
            </div>
            <p className=' text-sm text-zinc-400'>
              {isUpdatingProfile ? "Uploading..." : "Click the Camera icon to update your photo"}
            </p>
          </div>
          <div className='space-y-6'>
            <div className="space-y-1 5">
              <div className="text-sm text-zinc-400 flex items-center gap-2 px-1">
                <User className='w-4 h-4'/>
                Full Name
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.name}</p>
            </div>

            <div className="space-y-1 5">
              <div className="text-sm text-zinc-400 flex items-center gap-2 px-1">
                <Mail className='w-4 h-4'/>
                Email Address
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border '>{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className=' text-lg font-medium mb-4'>Account Infromation</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                {authUser?.createdAt ? authUser.createdAt.split("T")[0] : "N/A"}
                  </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className='text-green-500'>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage