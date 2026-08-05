import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { User, Phone, MapPin, Check, Save } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

export default function Profile() {
  const { activeRole, farmerProfile, setFarmerProfile, doctorProfile, setDoctorProfile, t } = useContext(AppContext);
  const [successMsg, setSuccessMsg] = useState('');

  // Local input states
  const [farmerName, setFarmerName] = useState(farmerProfile.name);
  const [farmerMobile, setFarmerMobile] = useState(farmerProfile.mobile);
  const [farmerAddress, setFarmerAddress] = useState(farmerProfile.address);

  const [doctorName, setDoctorName] = useState(doctorProfile.name);
  const [doctorMobile, setDoctorMobile] = useState(doctorProfile.phone);
  const [doctorHospital, setDoctorHospital] = useState(doctorProfile.hospital);
  const [doctorQual, setDoctorQual] = useState(doctorProfile.qualification);
  const [doctorExp, setDoctorExp] = useState(doctorProfile.experience);

  const handleFarmerSave = (e) => {
    e.preventDefault();
    setFarmerProfile({
      name: farmerName,
      mobile: farmerMobile,
      address: farmerAddress,
      cattleCount: farmerProfile.cattleCount
    });
    triggerSuccess();
  };

  const handleDoctorSave = (e) => {
    e.preventDefault();
    setDoctorProfile({
      ...doctorProfile,
      name: doctorName,
      phone: doctorMobile,
      hospital: doctorHospital,
      qualification: doctorQual,
      experience: doctorExp
    });
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSuccessMsg(t('Profile updated successfully!', 'சுயவிவரம் புதுப்பிக்கப்பட்டது!'));
    
    // Confetti
    canvasConfetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.85 }
    });

    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <div className="space-y-6 font-sans max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
          <User size={24} className="text-emerald-500" />
          <span>{t('Manage Profile Details', 'சுயவிவரத்தை நிர்வகி')}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {t('Edit credentials and physical credentials listed on consultations.', 'மருத்துவ ஆலோசனைகளில் தோன்றும் உங்களது விவரங்களை மாற்றவும்.')}
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-250 dark:border-emerald-900 flex items-center gap-2">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {activeRole === 'farmer' ? (
        <form onSubmit={handleFarmerSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Farmer Name', 'விவசாயி பெயர்')}</label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Mobile Number', 'கைபேசி எண்')}</label>
            <input
              type="tel"
              value={farmerMobile}
              onChange={(e) => setFarmerMobile(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Physical Farm Address', 'பண்ணை முகவரி')}</label>
            <textarea
              value={farmerAddress}
              onChange={(e) => setFarmerAddress(e.target.value)}
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl text-xs hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{t('Save Changes', 'சுயவிவரத்தைச் சேமி')}</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleDoctorSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Doctor Name', 'மருத்துவர் பெயர்')}</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Qualification', 'தகுதி')}</label>
              <input
                type="text"
                value={doctorQual}
                onChange={(e) => setDoctorQual(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Experience', 'அனுபவம்')}</label>
              <input
                type="text"
                value={doctorExp}
                onChange={(e) => setDoctorExp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Assigned Government Hospital', 'அரசு கால்நடை மருத்துவமனை')}</label>
            <input
              type="text"
              value={doctorHospital}
              onChange={(e) => setDoctorHospital(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Contact Phone', 'கைபேசி எண்')}</label>
            <input
              type="tel"
              value={doctorMobile}
              onChange={(e) => setDoctorMobile(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl text-xs hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{t('Save Changes', 'சுயவிவரத்தைச் சேமி')}</span>
          </button>
        </form>
      )}
    </div>
  );
}
