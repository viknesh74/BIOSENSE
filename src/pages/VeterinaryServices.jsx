import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Phone, MapPin, Compass, Stethoscope, Clock, ShieldAlert, X } from 'lucide-react';

export default function VeterinaryServices() {
  const { t } = useContext(AppContext);
  const [activeCall, setActiveCall] = useState(null); // name of service calling

  const services = [
    {
      id: 1,
      name: t('Madurai East Govt Veterinary Hospital', 'மதுரை கிழக்கு அரசு கால்நடை மருத்துவமனை'),
      type: 'hospital',
      distance: '1.4 km',
      phone: '+91 94420 89761',
      hours: t('Open 24 Hours (Govt Care)', '24 மணி நேரமும் திறந்திருக்கும் (அரசு)'),
      address: t('12, Melur Main Road, Madurai, TN', '12, மேலூர் மெயின் ரோடு, மதுரை, தமிழ்நாடு'),
      icon: '🏥'
    },
    {
      id: 2,
      name: t('Pashu Raksha Vet Medical Shop', 'பசு ரக்ஷா கால்நடை மருந்துக்கடை'),
      type: 'medical',
      distance: '2.8 km',
      phone: '+91 98421 34567',
      hours: '08:00 AM - 10:00 PM',
      address: t('Opposite Government Hospital, Madurai East', 'அரசு மருத்துவமனை எதிரில், மதுரை கிழக்கு'),
      icon: '💊'
    },
    {
      id: 3,
      name: t('Dr. Rajesh Kannan (Govt Doctor)', 'டாக்டர் ராஜேஷ் கண்ணன் (அரசு மருத்துவர்)'),
      type: 'doctor',
      distance: '3.5 km',
      phone: '+91 94432 10987',
      hours: '09:00 AM - 05:00 PM (Emergency calls 24/7)',
      address: t('Consulting Room 2, East Govt Hospital', 'ஆலோசனை அறை 2, கிழக்கு அரசு மருத்துவமனை'),
      icon: '👨⚕️'
    },
    {
      id: 4,
      name: t('Govt Emergency Veterinary Ambulance', 'அரசு அவசர கால்நடை ஆம்புலன்ஸ்'),
      type: 'ambulance',
      distance: 'Available on call',
      phone: '1962',
      hours: t('Emergency Response (Toll-Free)', 'அவசர உதவி எண் (கட்டணமில்லா சேவை)'),
      address: t('Covers Madurai District Rural zones', 'மதுரை மாவட்ட கிராமப்புற எல்லை முழுவதும்'),
      icon: '🚑'
    }
  ];

  const handleCall = (name) => {
    setActiveCall(name);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">{t('Nearby Veterinary Services', 'அருகிலுள்ள கால்நடை சேவைகள்')}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {t('Distance-calculated lists based on collar GPS telemetry logs.', 'காலர் ஜிபிஎஸ் அமைவிடம் மூலம் கண்டறியப்பட்ட மருத்துவ சேவைகள்.')}
          </p>
        </div>
        
        <div className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start md:self-auto animate-pulse">
          <ShieldAlert size={14} />
          <span>{t('Government Ambulance Helpline: 1962', 'அரசு அவசர ஆம்புலன்ஸ் எண்: 1962')}</span>
        </div>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm p-6 flex flex-col justify-between space-y-4 group hover:border-emerald-500/30 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  {svc.icon}
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-850">
                  {svc.distance}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {svc.name}
                </h3>
                <p className="text-slate-400 text-xxs mt-1 font-semibold uppercase tracking-wider">{svc.address}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Clock size={14} className="text-slate-400" />
                <span>{svc.hours}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                onClick={() => handleCall(svc.name)}
                className="w-1/2 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-xs hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone size={14} />
                <span>{t('Call Now', 'அழைக்கவும்')}</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(svc.name)}`}
                target="_blank"
                rel="noreferrer"
                className="w-1/2 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 text-center"
              >
                <Compass size={14} className="text-teal-500" />
                <span>{t('Navigate', 'வழித்தடம்')}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* DIALER DIALOG POPUP */}
      {activeCall && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-6 text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Call ripple background rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-emerald-500/5 animate-ping duration-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-emerald-500/10 animate-ping duration-1500" />

            <div className="flex justify-end relative z-10">
              <button
                onClick={() => setActiveCall(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-20 h-20 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xl shadow-emerald-500/20 animate-pulse-heart">
                📞
              </div>
              <div>
                <p className="text-xxs text-emerald-400 font-extrabold uppercase tracking-widest animate-pulse">BioSense Tele-Call</p>
                <h3 className="text-lg font-extrabold text-white mt-1.5 font-display line-clamp-2 px-4">{activeCall}</h3>
                <span className="text-xs text-slate-400 mt-2 block">{t('Connecting line...', 'அழைப்பு இணைக்கப்படுகிறது...')}</span>
              </div>
            </div>

            {/* Calling voice waves */}
            <div className="flex justify-center items-end gap-1 h-8 relative z-10">
              {[0.4, 0.8, 0.6, 0.9, 0.3, 0.7, 0.5, 0.8, 0.4].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full transition-all duration-300 animate-pulse"
                  style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveCall(null)}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-xs transition-all relative z-10 uppercase tracking-wider shadow-lg shadow-rose-950/20 cursor-pointer"
            >
              {t('Disconnect Call', 'அழைப்பைத் துண்டி')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
