import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Phone, 
  MapPin, 
  Compass, 
  Stethoscope, 
  Clock, 
  ShieldAlert, 
  X, 
  Calendar, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Building2, 
  Sparkles,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export default function VeterinaryServices() {
  const { cattle, appointments, bookAppointment, updateAppointmentStatus, setSelectedCattleId, setActiveTab, t } = useContext(AppContext);
  
  const [activeTabSub, setActiveTabSub] = useState('directory'); // 'directory' | 'appointments'
  const [activeCall, setActiveCall] = useState(null); // name of service calling
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVetForBooking, setSelectedVetForBooking] = useState(null);

  // Form State
  const [bookingForm, setBookingForm] = useState({
    collarId: cattle[0]?.id || '101',
    vetName: 'Dr. Rajesh Kannan',
    vetHospital: 'Madurai East Government Veterinary Hospital',
    appointmentType: 'Farm Doorstep Visit',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredTimeSlot: 'Morning (09:00 AM - 12:00 PM)',
    urgency: 'Normal',
    reason: ''
  });

  const services = [
    {
      id: 1,
      name: t('Madurai East Govt Veterinary Hospital', 'மதுரை கிழக்கு அரசு கால்நடை மருத்துவமனை', 'मदुरै पूर्व सरकारी पशु चिकित्सा अस्पताल'),
      type: 'hospital',
      distance: '1.4 km',
      phone: '+91 94420 89761',
      doctor: 'Dr. Rajesh Kannan (Senior District Vet Officer)',
      hours: t('Open 24 Hours (Govt Care)', '24 மணி நேரமும் திறந்திருக்கும் (அரசு)', '24 घंटे खुला'),
      address: t('12, Melur Main Road, Madurai East, TN', '12, மேலூர் மெயின் ரோடு, மதுரை கிழக்கு, தமிழ்நாடு', '12, मेलूर मेन रोड, मदुरै पूर्व'),
      icon: '🏥',
      rating: '4.9 ★',
      canBook: true
    },
    {
      id: 2,
      name: t('Dr. Rajesh Kannan, M.V.Sc', 'டாக்டர் ராஜேஷ் கண்ணன்', 'डॉ. राजेश कन्नन'),
      type: 'doctor',
      distance: '1.4 km',
      phone: '+91 94432 10987',
      doctor: 'M.V.Sc (Animal Husbandry) • VCI-TN-2024-8842',
      hours: '09:00 AM - 05:00 PM (Emergency calls 24/7)',
      address: t('Consulting Room 2, East Govt Hospital', 'ஆலோசனை அறை 2, கிழக்கு அரசு மருத்துவமனை', 'परामर्श कक्ष 2, सरकारी अस्पताल'),
      icon: '👨⚕️',
      rating: '5.0 ★',
      canBook: true
    },
    {
      id: 3,
      name: t('Mobile Veterinary Clinic Unit #3 (Annur Zone)', 'மொபைல் கால்நடை மருத்துவ ஊர்தி #3', 'मोबाइल पशु चिकित्सा क्लिनिक इकाई #3'),
      type: 'mobile',
      distance: '2.5 km',
      phone: '+91 98421 55670',
      doctor: 'Dr. Ramesh Kumar, B.V.Sc & A.H',
      hours: '08:00 AM - 06:00 PM (Field Doorstep Visits)',
      address: t('Covers Annur & Madurai East Rural Farms', 'கிராமப்புற பண்ணை எல்லை முழுவதும்', 'ग्रामीण क्षेत्रों को कवर करता है'),
      icon: '🚜',
      rating: '4.8 ★',
      canBook: true
    },
    {
      id: 4,
      name: t('Pashu Raksha Vet Medical & Pharmacy', 'பசு ரக்ஷா கால்நடை மருந்துக்கடை', 'पशु रक्षा पशु चिकित्सा फार्मेसी'),
      type: 'medical',
      distance: '2.8 km',
      phone: '+91 98421 34567',
      doctor: 'Licensed Veterinary Pharmacist',
      hours: '08:00 AM - 10:00 PM',
      address: t('Opposite Government Hospital, Madurai East', 'அரசு மருத்துவமனை எதிரில், மதுரை கிழக்கு', 'सरकारी अस्पताल के सामने'),
      icon: '💊',
      rating: '4.7 ★',
      canBook: false
    },
    {
      id: 5,
      name: t('Govt Emergency Veterinary Ambulance', 'அரசு அவசர கால்நடை ஆம்புலன்ஸ்', 'सरकारी आपातकालीन पशु चिकित्सा एम्बुलेंस'),
      type: 'ambulance',
      distance: 'Available on Toll-Free 1962',
      phone: '1962',
      doctor: 'Emergency Paramedic & Vet Team',
      hours: t('24/7 Emergency Dispatch', '24 மணி நேர அவசர உதவி', '24/7 आपातकालीन सेवा'),
      address: t('District Emergency Response Network', 'மாவட்ட அவசர சேவை நெட்வொர்க்', 'जिला आपातकालीन नेटवर्क'),
      icon: '🚑',
      rating: '4.9 ★',
      canBook: false
    }
  ];

  const handleCall = (name) => {
    setActiveCall(name);
  };

  const handleOpenBooking = (svc) => {
    setSelectedVetForBooking(svc);
    setBookingForm((prev) => ({
      ...prev,
      vetName: svc.name,
      vetHospital: svc.address
    }));
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.reason) return;

    const selectedCow = cattle.find(c => c.id === bookingForm.collarId) || cattle[0];

    await bookAppointment({
      collarId: selectedCow.id,
      animalName: selectedCow.name,
      animalBreed: selectedCow.breed,
      farmerName: 'Uma',
      farmerPhone: '+91 98765 43210',
      vetName: bookingForm.vetName,
      vetHospital: bookingForm.vetHospital,
      appointmentType: bookingForm.appointmentType,
      preferredDate: bookingForm.preferredDate,
      preferredTimeSlot: bookingForm.preferredTimeSlot,
      urgency: bookingForm.urgency,
      reason: bookingForm.reason
    });

    setShowBookingModal(false);
    setActiveTabSub('appointments');
    setBookingForm({
      collarId: cattle[0]?.id || '101',
      vetName: 'Dr. Rajesh Kannan',
      vetHospital: 'Madurai East Government Veterinary Hospital',
      appointmentType: 'Farm Doorstep Visit',
      preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTimeSlot: 'Morning (09:00 AM - 12:00 PM)',
      urgency: 'Normal',
      reason: ''
    });
  };

  const handleStartConsultation = (collarId) => {
    setSelectedCattleId(collarId);
    setActiveTab('chatbot');
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm(t('Are you sure you want to cancel this appointment?', 'இந்த சந்திப்பை ரத்து செய்ய விரும்புகிறீர்களா?'))) {
      await updateAppointmentStatus(id, 'Cancelled', 'Cancelled by farmer.');
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {t('GPS Geo-Located Services', 'ஜிபிஎஸ் வழிகாட்டல்', 'जीपीएस भू-स्थित')}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-display">
            {t('Nearby Veterinary Clinics & Appointments', 'அருகிலுள்ள கால்நடை சேவைகள் & முன்பதிவு', 'निकटवर्ती पशु चिकित्सालय और अपॉइंटमेंट')}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            {t('Connect with government veterinarians, book farm doorstep visits, or schedule clinical appointments.', 'கால்நடை மருத்துவர்களுடன் தொடர்பு கொள்ளவும், பண்ணை வருகைக்கான சந்திப்புகளை முன்பதிவு செய்யவும்.')}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSelectedVetForBooking(services[0]);
              setShowBookingModal(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>{t('Book Vet Appointment', 'மருத்துவர் சந்திப்பு முன்பதிவு', 'अपॉइंटमेंट बुक करें')}</span>
          </button>

          <div className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <ShieldAlert size={15} />
            <span>{t('Emergency 1962', 'அவசரம்: 1962')}</span>
          </div>
        </div>
      </div>

      {/* Main Sub Navigation Tabs */}
      <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTabSub('directory')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTabSub === 'directory'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 size={15} />
          <span>{t('Nearby Doctors & Hospitals Directory', 'மருத்துவமனை பட்டியல்', 'अस्पताल सूची')}</span>
        </button>

        <button
          onClick={() => setActiveTabSub('appointments')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTabSub === 'appointments'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar size={15} />
          <span>{t('My Booked Appointments', 'எனது முன்பதிவுகள்', 'मेरी अपॉइंटमेंट')} ({appointments.length})</span>
        </button>
      </div>

      {/* ─── TAB 1: NEARBY DIRECTORY WITH BOOKING BUTTONS ─── */}
      {activeTabSub === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition-all hover:shadow-lg group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                    {svc.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900">
                      {svc.rating}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      {svc.distance}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white font-display group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-teal-600 dark:text-teal-400 text-xs font-bold mt-0.5">{svc.doctor}</p>
                  <p className="text-slate-400 text-xxs mt-1 font-medium leading-relaxed">{svc.address}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Clock size={14} className="text-teal-500 shrink-0" />
                  <span className="text-[11px] font-semibold">{svc.hours}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {svc.canBook && (
                  <button
                    onClick={() => handleOpenBooking(svc)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar size={14} />
                    <span>{t('Book Appointment / Visit', 'சந்திப்பு முன்பதிவு செய்', 'अपॉइंटमेंट बुक करें')}</span>
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCall(svc.name)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone size={13} className="text-emerald-500" />
                    <span>{t('Call', 'அழைக்க')}</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(svc.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 text-center"
                  >
                    <Compass size={13} className="text-teal-500" />
                    <span>{t('Navigate', 'வழித்தடம்')}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 2: MY BOOKED APPOINTMENTS ─── */}
      {activeTabSub === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Calendar className="text-teal-500" size={22} />
                {t('My Scheduled Veterinary Appointments', 'முன்பதிவு செய்யப்பட்ட சந்திப்புகள்', 'शेड्यूल अपॉइंटमेंट')}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t('Track doctor confirmation status, field visit schedules, and consultation links.', 'மருத்துவர் உறுதிப்படுத்தல் நிலை மற்றும் வருகை நேரம்.')}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedVetForBooking(services[0]);
                setShowBookingModal(true);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 w-max"
            >
              <Plus size={15} />
              <span>{t('Book Another Appointment', 'மற்றொரு சந்திப்பு முன்பதிவு', 'अन्य अपॉइंटमेंट')}</span>
            </button>
          </div>

          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5 hover:border-teal-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-teal-600 dark:text-teal-400">{apt.preferredDate}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500 font-bold">{apt.preferredTimeSlot}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white font-display mt-1">
                          {apt.appointmentType}
                        </h3>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                          : apt.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {apt.status === 'Confirmed' ? t('Confirmed ✓', 'உறுதியானது ✓', 'पुष्टि ✓') : 
                         apt.status === 'Pending' ? t('Pending Confirmation ⏳', 'நிலுவையில் ⏳', 'लंबित ⏳') : 
                         apt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200/60 dark:border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Patient Cattle', 'மாடு', 'पशु')}</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">🐄 {apt.animalName} (ID: {apt.collarId})</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{t('Attending Veterinarian', 'மருத்துவர்', 'पशु चिकित्सक')}</span>
                        <p className="font-bold text-teal-600 dark:text-teal-400">{apt.vetName}</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="font-semibold"><strong>{t('Reason:', 'காரணம்:', 'कारण:')}</strong> "{apt.reason}"</p>
                      {apt.doctorNotes && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 italic">
                          <strong>{t('Doctor note:', 'மருத்துவர் குறிப்பு:')}</strong> {apt.doctorNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                    <button
                      onClick={() => handleStartConsultation(apt.collarId)}
                      className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare size={13} />
                      <span>{t('Open AI Tele-Chat', 'அரட்டை தொடங்கு', 'चैट खोलें')}</span>
                    </button>

                    {apt.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs transition-colors"
                      >
                        {t('Cancel', 'ரத்து', 'रद्द करें')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <Calendar className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('No booked appointments yet', 'முன்பதிவுகள் ஏதுமில்லை', 'कोई अपॉइंटमेंट नहीं')}</p>
              <button
                onClick={() => {
                  setSelectedVetForBooking(services[0]);
                  setShowBookingModal(true);
                }}
                className="mt-3 text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline"
              >
                + {t('Book First Appointment', 'முதல் சந்திப்பை முன்பதிவு செய்', 'पहली अपॉइंटमेंट बुक करें')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── BOOK APPOINTMENT MODAL ─── */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Calendar size={22} />
                <div>
                  <h3 className="font-bold font-display text-base leading-tight">
                    {t('Book Veterinary Appointment', 'கால்நடை மருத்துவர் சந்திப்பு முன்பதிவு', 'पशु चिकित्सक अपॉइंटमेंट बुक करें')}
                  </h3>
                  <p className="text-[11px] text-teal-100 mt-0.5">{bookingForm.vetName}</p>
                </div>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="p-1 rounded-lg hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              
              {/* Cattle Selection & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Select Cattle Patient', 'மாட்டைத் தேர்ந்தெடுக்கவும்', 'मवेशी रोगी चुनें')} *
                  </label>
                  <select
                    value={bookingForm.collarId}
                    onChange={(e) => setBookingForm({ ...bookingForm, collarId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                  >
                    {cattle.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Collar {c.id}) - {c.breed}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Urgency Level', 'அவசர நிலை', 'तत्कालता')}
                  </label>
                  <select
                    value={bookingForm.urgency}
                    onChange={(e) => setBookingForm({ ...bookingForm, urgency: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Normal">{t('Normal (Routine Checkup)', 'வழக்கமானது', 'सामान्य')}</option>
                    <option value="Urgent">{t('Urgent (Symptoms Active)', 'அவசரமானது', 'तत्काल')}</option>
                    <option value="Emergency">{t('Emergency (Critical Health)', 'மிக அவசரம்', 'आपातकाल')}</option>
                  </select>
                </div>
              </div>

              {/* Service / Clinic Selector */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {t('Attending Veterinarian / Hospital', 'மருத்துவர் / மையம்', 'पशु चिकित्सक / अस्पताल')}
                </label>
                <select
                  value={bookingForm.vetName}
                  onChange={(e) => {
                    const svc = services.find(s => s.name === e.target.value);
                    setBookingForm({
                      ...bookingForm,
                      vetName: e.target.value,
                      vetHospital: svc?.address || 'Government Veterinary Hospital'
                    });
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="Dr. Rajesh Kannan">Dr. Rajesh Kannan (Madurai East Govt Hospital)</option>
                  <option value="Mobile Veterinary Clinic Unit #3">Mobile Veterinary Clinic Unit #3 (Doorstep Farm Visit)</option>
                  <option value="Madurai East Govt Veterinary Hospital">Madurai East Govt Veterinary Hospital (Direct In-Clinic)</option>
                </select>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {t('Appointment Type', 'சந்திப்பு வகை', 'अपॉइंटमेंट का प्रकार')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Farm Doorstep Visit', label: t('🚜 Farm Doorstep Visit', '🚜 பண்ணை வருகை', '🚜 फार्म विजिट') },
                    { id: 'In-Clinic Hospital Visit', label: t('🏥 In-Clinic Hospital Visit', '🏥 மருத்துவமனை வருகை', '🏥 क्लिनिक विजिट') },
                    { id: 'Live Tele-Consultation', label: t('📱 Live Tele-Consultation', '📱 வீடியோ ஆலோசனை', '📱 टेली-परामर्श') },
                    { id: 'Vaccination Booster', label: t('💉 Vaccination Drive', '💉 தடுப்பூசி முகாம்', '💉 टीकाकरण') },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, appointmentType: item.id })}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all ${
                        bookingForm.appointmentType === item.id
                          ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-500'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Preferred Date', 'விருப்பமான தேதி', 'पसंदीदा दिनांक')} *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.preferredDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    {t('Time Slot', 'நேர இடைவெளி', 'समय स्लॉट')}
                  </label>
                  <select
                    value={bookingForm.preferredTimeSlot}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredTimeSlot: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                    <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Reason / Symptoms */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {t('Reason for Visit / Symptoms Description', 'வருகைக்கான காரணம் / அறிகுறிகள்', 'यात्रा का कारण / लक्षण')} *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={t('Describe symptoms, vital changes, or vaccination requirement...', 'அறிகுறிகள், உடல்நிலை மாற்றங்கள் அல்லது தடுப்பூசி தேவைகளை விவரிக்கவும்...')}
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold placeholder:text-slate-400"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs"
                >
                  {t('Cancel', 'ரத்து', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  {t('Confirm & Send to Doctor', 'உறுதிசெய்து மருத்துவருக்கு அனுப்பு', 'पुष्टि करें और डॉक्टर को भेजें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALER DIALOG POPUP */}
      {activeCall && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-6 text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-end relative z-10">
              <button
                onClick={() => setActiveCall(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-20 h-20 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xl shadow-emerald-500/20 animate-pulse">
                📞
              </div>
              <div>
                <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest animate-pulse">BioSense Tele-Call</p>
                <h3 className="text-lg font-extrabold text-white mt-1.5 font-display line-clamp-2 px-4">{activeCall}</h3>
                <span className="text-xs text-slate-400 mt-2 block">{t('Connecting line...', 'அழைப்பு இணைக்கப்படுகிறது...')}</span>
              </div>

              <button
                onClick={() => setActiveCall(null)}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-rose-600/30"
              >
                {t('End Call', 'அழைப்பை முடிக்க')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
