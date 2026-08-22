import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { Phone, MapPin, Mail, Building, Calendar, Edit3, Save, Check } from 'lucide-react';

export const EmployeeProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      phone,
      address,
      photoUrl,
    };
    storageService.saveUser(updatedUser);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Employee Profile</h2>
          <p className="text-xs text-slate-500 font-normal">View personal details and update contact information.</p>
        </div>
        {saved && (
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Profile Updated
          </span>
        )}
      </div>

      {/* Profile Card */}
      <div className="hr-panel p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 pb-5 border-b border-slate-100">
          <img
            src={currentUser.photoUrl}
            alt={currentUser.name}
            className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-slate-900">{currentUser.name}</h3>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase border border-slate-200">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-0.5">{currentUser.jobTitle}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {currentUser.employeeId}</p>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 justify-center sm:justify-start">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" /> {currentUser.department}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined {currentUser.joinDate}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {currentUser.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Contact Info'}</span>
          </button>
        </div>

        {/* Details Grid */}
        <form onSubmit={handleSave} className="mt-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Read-Only Details */}
            <div className="space-y-3 p-3.5 rounded-md bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-slate-900 uppercase font-mono tracking-wider text-[10px]">
                Job Information (HR Controlled)
              </h4>
              <div>
                <label className="text-slate-500 block font-normal">Department</label>
                <div className="font-semibold text-slate-900 text-xs mt-0.5">{currentUser.department}</div>
              </div>
              <div>
                <label className="text-slate-500 block font-normal">Job Title</label>
                <div className="font-semibold text-slate-900 text-xs mt-0.5">{currentUser.jobTitle}</div>
              </div>
              <div>
                <label className="text-slate-500 block font-normal">Official Email</label>
                <div className="font-semibold text-slate-900 text-xs mt-0.5 font-mono">{currentUser.email}</div>
              </div>
            </div>

            {/* Editable Contact Info */}
            <div className="space-y-3 p-3.5 rounded-md bg-white border border-slate-200">
              <h4 className="font-semibold text-slate-900 uppercase font-mono tracking-wider text-[10px]">
                Personal & Contact Information
              </h4>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs"
                  />
                ) : (
                  <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {currentUser.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Home Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  />
                ) : (
                  <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentUser.address}
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Avatar Photo URL</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs"
                  />
                ) : (
                  <div className="text-xs text-slate-500 font-mono truncate">{currentUser.photoUrl}</div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs flex items-center space-x-1.5 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact Details</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
