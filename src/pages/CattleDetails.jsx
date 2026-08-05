import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Heart, Thermometer, MapPin, Battery, Eye, Download, AlertTriangle, ShieldCheck, Search, ArrowLeft } from 'lucide-react';

export default function CattleDetails() {
  const { cattle, selectedCattleId, setSelectedCattleId, setActiveTab, t } = useContext(AppContext);
  
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cattle for the list view
  const filteredCattle = cattle.filter(c => {
    const query = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query);
  });

  const handleSelectCattle = (id) => {
    setSelectedCattleId(id);
    setViewMode('detail');
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-6 font-sans">
        {/* Search Bar Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              {t('Livestock Database', 'கால்நடை தரவுத்தளம்', 'पशुधन डेटाबेस')}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {t('Search and select cattle to view detailed telemetry.', 'மாடுகளைத் தேடி அவற்றின் முழுமையான உடல்நிலை தரவுகளைப் பார்க்கவும்.', 'विस्तृत टेलीमेट्री देखने के लिए पशु खोजें और चुनें।')}
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t('Search by name or Collar ID...', 'பெயர் அல்லது ஐடி மூலம் தேடவும்...', 'नाम या कॉलर आईडी से खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-semibold transition-all"
            />
          </div>
        </div>

        {/* Grid View */}
        {filteredCattle.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCattle.map((cow) => {
              const isEmergency = cow.status === 'Emergency';
              const isWarning = cow.status === 'Warning';
              
              return (
                <div 
                  key={cow.id}
                  onClick={() => handleSelectCattle(cow.id)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 flex flex-col"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={cow.photo}
                      alt={cow.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg border border-white/10 uppercase tracking-widest">
                      ID: {cow.id}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white font-display mb-1">{cow.name}</h3>
                      <p className="text-xs text-slate-500 font-bold">{cow.breed} • {cow.age}</p>
                    </div>
                    
                    <div className={`mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
                      isEmergency ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' :
                      isWarning ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' :
                      'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                    }`}>
                      {isEmergency ? <AlertTriangle size={14} className="animate-pulse" /> :
                       isWarning ? <AlertTriangle size={14} /> :
                       <ShieldCheck size={14} />}
                      <span>
                        {isEmergency ? t('Emergency', 'அவசரம்', 'आपातकाल') :
                         isWarning ? t('Warning', 'எச்சரிக்கை', 'चेतावनी') :
                         t('Healthy', 'ஆரோக்கியம்', 'स्वस्थ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {t('No cattle found', 'மாடுகள் கிடைக்கவில்லை', 'कोई मवेशी नहीं मिला')}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              {t('Try adjusting your search query or check the Collar ID again.', 'உங்கள் தேடலை மாற்றி மீண்டும் தேடவும்.', 'अपनी खोज क्वेरी को समायोजित करने का प्रयास करें।')}
            </p>
          </div>
        )}
      </div>
    );
  }

  // --- DETAIL VIEW LOGIC --- //
  const cow = cattle.find((c) => c.id === selectedCattleId) || cattle[0];
  const hr = cow.telemetry.heartRate;
  const temp = cow.telemetry.temperature;
  const batt = cow.telemetry.battery;
  const status = cow.status;

  const tempF = ((temp * 9) / 5 + 32).toFixed(1);

  let statusBg = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900';
  let statusText = 'text-emerald-700 dark:text-emerald-400';
  let statusIcon = <ShieldCheck className="text-emerald-500" size={24} />;
  let statusMsg = t('All vitals are stable. Live sensors indicating normal range.', 'அனைத்து உடல்நிலைகளும் சீராக உள்ளன.', 'सभी महत्वपूर्ण अंग स्थिर हैं। लाइव सेंसर सामान्य श्रेणी का संकेत दे रहे हैं।');

  if (status === 'Emergency') {
    statusBg = 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 animate-pulse';
    statusText = 'text-rose-700 dark:text-rose-400';
    statusIcon = <AlertTriangle className="text-rose-500" size={24} />;
    
    if (hr > 105) {
      statusMsg = t(`Emergency: Heart rate is spiking at ${hr} BPM. Fever check recommended.`, `அவசரம்: இதயத் துடிப்பு ${hr} BPM ஆக அதிகரித்துள்ளது.`, `आपातकाल: हृदय गति ${hr} BPM पर बढ़ रही है। बुखार की जांच अनुशंसित है।`);
    } else if (hr < 50) {
      statusMsg = t(`Emergency: Low heart rate detected (${hr} BPM). Immediate medical checkup needed.`, `அவசரம்: இதயத் துடிப்பு ${hr} BPM ஆகக் குறைந்துள்ளது.`, `आपातकाल: कम हृदय गति (${hr} BPM) पाई गई। तत्काल चिकित्सा जांच की आवश्यकता है।`);
    } else if (temp > 40.0) {
      statusMsg = t(`Emergency: Fever detected (${temp}°C / ${tempF}°F). Request a vet consultation.`, `அவசரம்: மாட்டின் வெப்பநிலை ${temp}°C காய்ச்சலை காட்டுகிறது.`, `आपातकाल: बुखार पाया गया (${temp}°C / ${tempF}°F)। पशु चिकित्सक परामर्श का अनुरोध करें।`);
    } else {
      statusMsg = t('Emergency: GPS geofence boundary breached. Check live tracking map.', 'அவசரம்: மாடு பாதுகாப்பு எல்லையைத் தாண்டியுள்ளது.', 'आपातकाल: जीपीएस जियोफेंस सीमा का उल्लंघन। लाइव ट्रैकिंग मानचित्र देखें।');
    }
  } else if (status === 'Warning') {
    statusBg = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900';
    statusText = 'text-amber-700 dark:text-amber-400';
    statusIcon = <AlertTriangle className="text-amber-500" size={24} />;
    
    if (batt < 20) {
      statusMsg = t(`Warning: Battery level critical (${batt}%). Please plug in transmitter charger.`, `எச்சரிக்கை: காலர் பேட்டரி அளவு (${batt}%) மிகக் குறைவாக உள்ளது.`, `चेतावनी: बैटरी का स्तर गंभीर (${batt}%)। कृपया ट्रांसमीटर चार्जर लगाएं।`);
    } else {
      statusMsg = t('Warning: Subtle vital fluctuations. Continue monitoring.', 'எச்சரிக்கை: லேசான உடல்நிலை மாற்றங்கள் உள்ளன.', 'चेतावनी: सूक्ष्म महत्वपूर्ण उतार-चढ़ाव। निगरानी जारी रखें।');
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Detail Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2">
        <button 
          onClick={() => setViewMode('list')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl transition-all w-max border border-slate-200 dark:border-slate-700"
        >
          <ArrowLeft size={16} />
          {t('Back to all Cattle', 'அனைத்து மாடுகளுக்கும் திரும்பவும்', 'सभी मवेशियों पर वापस जाएं')}
        </button>
        <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1.5 w-max">
          <ShieldCheck size={14} />
          <span>{t('Live Telemetry Streaming', 'நேரடி தரவு ஸ்ட்ரீமிங்', 'लाइव टेलीमेट्री स्ट्रीमिंग')}</span>
        </div>
      </div>

      {/* Meta Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 animate-in fade-in zoom-in-95 duration-300">
        <div className="md:col-span-1 h-64 md:h-full min-h-[220px]">
          <img
            src={cow.photo}
            alt={cow.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 tracking-widest uppercase">
                {t('Collar Activated Node', 'காலர் ஐடி பதிவிறக்கம்', 'कॉलर सक्रिय नोड')}
              </span>
              <span className="text-xs text-slate-400 font-bold">Collar ID: {cow.id}</span>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display">{cow.name}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('Breed', 'இனம்', 'नस्ल')}</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cow.breed}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('Age', 'வயது', 'आयु')}</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cow.age}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('Gender', 'பாலினம்', 'लिंग')}</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{t(cow.gender, cow.gender === 'Female' ? 'பெண்' : 'ஆண்', cow.gender === 'Female' ? 'मादा' : 'नर')}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{t('Registered', 'பதிவு செய்யப்பட்டது', 'पंजीकृत')}</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Aug 2026</p>
              </div>
            </div>
          </div>

          {/* Status Indicators Banner */}
          <div className={`p-4 border rounded-2xl flex items-start gap-3.5 ${statusBg}`}>
            <div className="shrink-0 mt-0.5">{statusIcon}</div>
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider ${statusText}`}>
                {status === 'Healthy' ? t('Healthy Vitals Status', 'ஆரோக்கிய நிலை', 'स्वस्थ जीवन शक्ति स्थिति') : status === 'Warning' ? t('Warning status', 'எச்சரிக்கை நிலை', 'चेतावनी स्थिति') : t('Emergency Status Alert', 'அவசர நிலை எச்சரிக்கை', 'आपातकालीन स्थिति चेतावनी')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{statusMsg}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Vitals Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Heart Rate Dial Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Heart Rate', 'இதயத்துடிப்பு', 'हृदय गति')}</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
              <Heart size={18} className="animate-pulse-heart" />
            </div>
          </div>
          <div>
            <h3 className={`text-4xl font-extrabold font-display ${hr > 105 || hr < 50 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
              {hr}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">{t('Normal: 60-90 BPM (Resting)', 'வழக்கமான அளவு: 60-90 BPM', 'सामान्य: 60-90 BPM (आराम करते समय)')}</p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                hr > 105 || hr < 50 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min((hr / 150) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Temperature Dial Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Body Temperature', 'உடல் வெப்பநிலை', 'शरीर का तापमान')}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
              <Thermometer size={18} />
            </div>
          </div>
          <div>
            <h3 className={`text-4xl font-extrabold font-display ${temp > 40.0 ? 'text-rose-500 font-black' : 'text-slate-900 dark:text-white'}`}>
              {temp}°C
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {tempF}°F • {t('Normal: 38.5 - 39.5°C', 'வழக்கமான அளவு: 38.5 - 39.5°C', 'सामान्य: 38.5 - 39.5°C')}
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                temp > 40.0 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(((temp - 35) / 10) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* GPS Coordinate Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Live GPS Coordinates', 'ஜிபிஎஸ் இருப்பிடம்', 'लाइव जीपीएस निर्देशांक')}</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-teal-500 group-hover:scale-105 transition-transform">
              <MapPin size={18} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {cow.telemetry.gps.lat.toFixed(5)} N
            </h4>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {cow.telemetry.gps.lng.toFixed(5)} E
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">{t('Transmitting via NEO-6M', 'NEO-6M ஜிபிஎஸ் மூலமாக', 'NEO-6M के माध्यम से संचारण')}</p>
          </div>
          <div className="text-xxs text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 py-1.5 px-2.5 rounded-lg flex justify-between items-center">
            <span>{t('Geofence Safe Zone', 'பாதுகாப்பு எல்லை', 'जियोफेंस सुरक्षित क्षेत्र')}</span>
            <span className={status === 'Emergency' && !hr ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
              {status === 'Emergency' && !hr ? t('OUTSIDE', 'வெளியே', 'बाहर') : t('INSIDE', 'உள்ளே', 'अंदर')}
            </span>
          </div>
        </div>

        {/* Battery Telemetry Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('Battery Status', 'பேட்டரி நிலை', 'बैटरी की स्थिति')}</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${batt < 20 ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 animate-pulse' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500'}`}>
              <Battery size={18} />
            </div>
          </div>
          <div>
            <h3 className={`text-4xl font-extrabold font-display ${batt < 20 ? 'text-rose-500 font-black' : 'text-slate-900 dark:text-white'}`}>
              {batt}%
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {batt < 20 ? t('Charge Immediately', 'உடனடியாக சார்ஜ் செய்யவும்', 'तुरंत चार्ज करें') : t('Transmitter Operational', 'காலர் செயல்பாட்டில் உள்ளது', 'ट्रांसमीटर चालू')}
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                batt < 20 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
              }`}
              style={{ width: `${batt}%` }}
            />
          </div>
        </div>
      </div>

      {/* Button Console (live map, graph history, report download) */}
      <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-12 duration-700">
        {/* Live Map Button */}
        <button
          onClick={() => setActiveTab('gps')}
          className="flex-1 min-w-[200px] p-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-slate-950/10 transition-all cursor-pointer"
        >
          <MapPin size={18} />
          <span>{t('View Live Tracking Map', 'நேரடி வரைபடத்தைக் காண்க', 'लाइव ट्रैकिंग मानचित्र देखें')}</span>
        </button>

        {/* Analytics Button */}
        <button
          onClick={() => setActiveTab('analytics')}
          className="flex-1 min-w-[200px] p-4 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-850 font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer"
        >
          <Eye size={18} className="text-emerald-500" />
          <span>{t('View Health Analytics History', 'சுகாதார வரலாறு விவரங்கள்', 'स्वास्थ्य विश्लेषण इतिहास देखें')}</span>
        </button>

        {/* Generate Report */}
        <button
          onClick={() => setActiveTab('reports')}
          className="flex-1 min-w-[200px] p-4 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-850 font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer"
        >
          <Download size={18} className="text-teal-500" />
          <span>{t('Generate Vitals Report PDF', 'சுகாதார அறிக்கை தயாரித்தல்', 'वाइटल रिपोर्ट पीडीएफ जेनरेट करें')}</span>
        </button>
      </div>
    </div>
  );
}
