import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { User, Phone, MapPin, Mail, Building, Calendar, Edit3, Save, Check } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Employee Profile</h2>
          <p className="text-xs text-slate-500">View personal details and update contact information.</p>
        </div>
        {saved && (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Profile Updated
          </span>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100">
          <img
            src={currentUser.photoUrl}
            alt={currentUser.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg shrink-0"
          />
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-2xl font-bold text-slate-900">{currentUser.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-1">{currentUser.jobTitle}</p>
            <p className="text-xs text-slate-400 mt-0.5">Employee ID: {currentUser.employeeId}</p>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 justify-center sm:justify-start">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-500" /> {currentUser.department}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Joined {currentUser.joinDate}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" /> {currentUser.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Contact Info'}</span>
          </button>
        </div>

        {/* Read-only Work Details + Editable Contact Info */}
        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Read-Only Details (Managed by HR Admin) */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Job Information (HR Controlled)
              </h4>
              <div>
                <label className="text-slate-400 block font-medium">Department</label>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{currentUser.department}</div>
              </div>
              <div>
                <label className="text-slate-400 block font-medium">Job Title</label>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{currentUser.jobTitle}</div>
              </div>
              <div>
                <label className="text-slate-400 block font-medium">Official Work Email</label>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{currentUser.email}</div>
              </div>
            </div>

            {/* Editable Employee Contact Info */}
            <div className="space-y-4 p-4 rounded-2xl bg-white border border-slate-200">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Personal & Contact Information
              </h4>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {currentUser.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Home Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentUser.address}
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Avatar Photo URL</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="text-xs text-slate-400 truncate">{currentUser.photoUrl}</div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-2 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
