import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, FileText, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

export default function GovernmentSchemes() {
  const { t } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'subsidy' | 'insurance' | 'loan' | 'other'
  
  // Application form state
  const [applyingScheme, setApplyingScheme] = useState(null);
  const [applicantName, setApplicantName] = useState('Uma');
  const [cattleCount, setCattleCount] = useState('2');
  const [appliedSchemes, setAppliedSchemes] = useState({});

  const schemes = [
    {
      id: 1,
      title: t('Rashtriya Gokul Mission (RGM)', 'ராஷ்ட்ரிய கோகுல் மிஷன் (RGM)'),
      type: 'subsidy',
      provider: t('Department of Animal Husbandry & Dairying', 'கால்நடை பராமரிப்பு துறை'),
      subsidyAmount: t('Artificial insemination, IVF, quality semen, breed conservation support', 'செயற்கை கருவூட்டல், IVF, தரமான விந்து, இனப் பாதுகாப்பு ஆதரவு'),
      eligibility: t('State departments, dairy cooperatives, breeding institutions', 'மாநில துறைகள், பால் கூட்டுறவு சங்கங்கள், இனப்பெருக்க நிறுவனங்கள்'),
      documents: [t('Project Proposal', 'திட்ட அறிக்கை'), t('Registration Certificate', 'பதிவு சான்றிதழ்')],
      applyLink: 'https://dahd.gov.in/schemes/programmes/rashtriya_gokul_mission'
    },
    {
      id: 2,
      title: t('National Programme for Dairy Development (NPDD)', 'தேசிய பால்வள மேம்பாட்டு திட்டம் (NPDD)'),
      type: 'subsidy',
      provider: t('Department of Animal Husbandry & Dairying', 'கால்நடை பராமரிப்பு துறை'),
      subsidyAmount: t('Bulk milk coolers, testing labs, chilling units, training support', 'மொத்த பால் குளிரூட்டிகள், சோதனை ஆய்வகங்கள், பயிற்சி ஆதரவு'),
      eligibility: t('Dairy cooperatives, milk federations, FPOs, producer companies', 'பால் கூட்டுறவு, பால் கூட்டமைப்புகள், FPOக்கள்'),
      documents: [t('Detailed Project Report', 'திட்ட அறிக்கை'), t('Financial Statements', 'நிதி அறிக்கைகள்')],
      applyLink: 'https://dahd.gov.in/schemes/programmes/npdd'
    },
    {
      id: 3,
      title: t('Animal Husbandry Infrastructure Development Fund (AHIDF)', 'கால்நடை பராமரிப்பு உள்கட்டமைப்பு மேம்பாட்டு நிதி (AHIDF)'),
      type: 'loan',
      provider: t('Department of Animal Husbandry & Dairying', 'கால்நடை பராமரிப்பு துறை'),
      subsidyAmount: t('Bank loans, 3% interest subvention, credit guarantee support', 'வங்கி கடன்கள், 3% வட்டி மானியம், கடன் உத்தரவாத ஆதரவு'),
      eligibility: t('MSMEs, FPOs, cooperatives, private companies, entrepreneurs', 'MSMEகள், FPOக்கள், கூட்டுறவு நிறுவனங்கள், தொழில்முனைவோர்'),
      documents: [t('Business Plan', 'வணிகத் திட்டம்'), t('Bank Loan Documents', 'வங்கி கடன் ஆவணங்கள்')],
      applyLink: 'https://dahd.gov.in/en/schemes/programmes/ahidf'
    },
    {
      id: 4,
      title: t('Supporting Dairy Cooperatives & FPOs (SDCFPO)', 'பால் கூட்டுறவு மற்றும் FPOக்களுக்கு ஆதரவு (SDCFPO)'),
      type: 'loan',
      provider: t('Department of Animal Husbandry & Dairying', 'கால்நடை பராமரிப்பு துறை'),
      subsidyAmount: t('Financial assistance, infrastructure support, procurement strengthening', 'நிதி உதவி, உள்கட்டமைப்பு ஆதரவு'),
      eligibility: t('Registered dairy cooperatives, milk unions, dairy FPOs', 'பதிவு செய்யப்பட்ட பால் கூட்டுறவு சங்கங்கள், பால் சங்கங்கள்'),
      documents: [t('Registration Certificate', 'பதிவு சான்றிதழ்'), t('Audit Reports', 'தணிக்கை அறிக்கைகள்')],
      applyLink: 'https://dahd.gov.in/schemes/programmes/sdcfpo'
    },
    {
      id: 5,
      title: t('National Gopal Ratna Award (NGRA)', 'தேசிய கோபால் ரத்னா விருது (NGRA)'),
      type: 'other',
      provider: t('Department of Animal Husbandry & Dairying', 'கால்நடை பராமரிப்பு துறை'),
      subsidyAmount: t('Cash award, certificate, national recognition', 'பண விருது, சான்றிதழ், தேசிய அங்கீகாரம்'),
      eligibility: t('Dairy farmers, AI technicians, dairy cooperative societies', 'பால் பண்ணையாளர்கள், AI தொழில்நுட்ப வல்லுநர்கள்'),
      documents: [t('Nomination Form', 'பரிந்துரை படிவம்'), t('Proof of Achievements', 'சாதனைகளுக்கான சான்று')],
      applyLink: 'https://dahd.gov.in/schemes/programmes/ngra'
    },
    {
      id: 6,
      title: t('Scheme for Special Assistance to States for Capital Investment (SASCI)', 'மாநிலங்களுக்கான சிறப்பு உதவி திட்டம் (SASCI)'),
      type: 'subsidy',
      provider: t('Ministry of Finance', 'நிதி அமைச்சகம்'),
      subsidyAmount: t('Support state-level infrastructure projects, large-scale funding', 'பெரிய அளவிலான உள்கட்டமைப்பு நிதி'),
      eligibility: t('State Governments and their agencies only', 'மாநில அரசுகள் மற்றும் அவற்றின் முகவர்கள் மட்டுமே'),
      documents: [t('State Proposal', 'மாநில அரசின் அறிக்கை'), t('Budget Details', 'பட்ஜெட் விவரங்கள்')],
      applyLink: 'https://www.finmin.nic.in'
    },
    {
      id: 7,
      title: t('National Livestock Mission (NLM)', 'தேசிய கால்நடை மிஷன் (NLM)'),
      type: 'subsidy',
      provider: t('Department of Animal Husbandry & Dairying', 'கால்நடை பராமரிப்பு துறை'),
      subsidyAmount: t('Capital subsidy, fodder support, training, breed development assistance', 'மூலதன மானியம், தீவன ஆதரவு, பயிற்சி'),
      eligibility: t('Individuals, entrepreneurs, SHGs, FPOs, cooperatives', 'தனிநபர்கள், தொழில்முனைவோர், SHGகள், FPOக்கள்'),
      documents: [t('Project Report', 'திட்ட அறிக்கை'), t('Aadhaar Card', 'ஆதார் அட்டை'), t('Land Ownership Details', 'நில ஆவணங்கள்')],
      applyLink: 'https://dahd.gov.in/schemes/programmes/national_livestock_mission'
    },
    {
      id: 8,
      title: t('Livestock Health & Disease Control Programme (LHDCP)', 'கால்நடை சுகாதாரம் மற்றும் நோய் கட்டுப்பாட்டு திட்டம் (LHDCP)'),
      type: 'subsidy',
      provider: t('Department of Animal Husbandry & Dairying', 'கால்நடை பராமரிப்பு துறை'),
      subsidyAmount: t('Free/subsidized vaccination, disease testing, veterinary camps', 'இலவச/மானிய தடுப்பூசி, நோய் பரிசோதனை'),
      eligibility: t('All livestock owners', 'அனைத்து கால்நடை உரிமையாளர்களும்'),
      documents: [t('No specific documents required for basic vaccination', 'அடிப்படை தடுப்பூசிக்கு சிறப்பு ஆவணங்கள் தேவையில்லை')],
      applyLink: 'https://dahd.gov.in/schemes-programmes/lhdcp'
    },
    {
      id: 9,
      title: t('Livestock Census & Integrated Sample Survey (LC&ISS)', 'கால்நடை கணக்கெடுப்பு மற்றும் ஒருங்கிணைந்த மாதிரி ஆய்வு (LC&ISS)'),
      type: 'other',
      provider: t('Department of Animal Husbandry & Dairying', 'கால்நடை பராமரிப்பு துறை'),
      subsidyAmount: t('Helps policy planning and resource allocation', 'கொள்கை திட்டமிடல் மற்றும் வள ஒதுக்கீட்டிற்கு உதவுகிறது'),
      eligibility: t('All livestock-owning households may be surveyed', 'அனைத்து கால்நடை உரிமையாளர் குடும்பங்களும்'),
      documents: [t('Provide information to surveyors', 'கணக்கெடுப்பவர்களுக்கு தகவல்களை வழங்கவும்')],
      applyLink: 'https://dahd.gov.in/schemes/programmes/animal-husbandry-statistics'
    }
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || s.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleApplyClick = (scheme) => {
    setApplyingScheme(scheme);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setAppliedSchemes((prev) => ({
      ...prev,
      [applyingScheme.id]: true
    }));
    
    // Confetti
    canvasConfetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.8 }
    });

    setApplyingScheme(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('Search active schemes...', 'அரசு திட்டங்களைத் தேடுங்கள்...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800/80 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/40 self-start md:self-auto gap-1">
          {['all', 'subsidy', 'insurance', 'loan', 'other'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
              }`}
            >
              {tab === 'all' ? t('All Schemes', 'அனைத்தும்') : t(tab, tab === 'subsidy' ? 'மானியம்' : tab === 'insurance' ? 'காப்பீடு' : tab === 'loan' ? 'கடன்' : 'பிற')}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => {
          const isApplied = appliedSchemes[scheme.id];

          return (
            <div
              key={scheme.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-start gap-2">
                  <div className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 text-[10px] font-bold uppercase rounded-lg tracking-wider">
                    {t(scheme.type, scheme.type === 'subsidy' ? 'SUBSIDY' : scheme.type === 'insurance' ? 'INSURANCE' : scheme.type === 'loan' ? 'INFRA LOAN' : 'OTHER')}
                  </div>
                  {isApplied && (
                    <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs uppercase bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <ShieldCheck size={14} />
                      {t('Applied', 'விண்ணப்பிக்கப்பட்டது')}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display leading-snug">
                  {scheme.title}
                </h3>

                <p className="text-xxs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  {t('Provider:', 'வழங்குபவர்:')} {scheme.provider}
                </p>

                {/* Amount / Benefit card */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t('Scheme Benefits', 'திட்டத்தின் பலன்கள்')}</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 leading-normal">{scheme.subsidyAmount}</p>
                </div>

                {/* Eligibility criteria */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">{t('Eligibility Requirements', 'தகுதிகள்')}</span>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{scheme.eligibility}</p>
                </div>

                {/* Required Docs */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">{t('Required Documents Check', 'தேவைப்படும் ஆவணங்கள்')}</span>
                  <ul className="grid grid-cols-2 gap-1 text-slate-500 text-[11px]">
                    {scheme.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle size={10} className="text-slate-400 shrink-0" />
                        <span className="truncate">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Apply Button */}
              <div className="flex flex-col gap-2">
                {!isApplied ? (
                  <button
                    onClick={() => handleApplyClick(scheme)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl text-xs hover:shadow-lg hover:shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('Apply for Scheme Benefits', 'விண்ணப்பிக்கவும்')}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <div className="text-center py-2.5 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    {t('✓ Applied. Application ID: PMY-807213', '✓ விண்ணப்பம் சமர்ப்பிக்கப்பட்டது. எண்: PMY-807213')}
                  </div>
                )}
                
                {scheme.applyLink && (
                  <a
                    href={scheme.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t('Official Scheme Portal', 'அதிகாரப்பூர்வ இணையதளம்')}</span>
                    <ArrowRight size={12} className="-rotate-45" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* APPLY SCHEME FORM MODAL */}
      {applyingScheme && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Design header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                    {t('Scheme Registration Form', 'திட்ட பதிவு படிவம்')}
                  </h3>
                  <p className="text-xs text-slate-400">{t('Submit details for subsidy claim.', 'மானியம் கோர உங்களது விவரங்களை அனுப்பவும்.')}</p>
                </div>
              </div>
              <button
                onClick={() => setApplyingScheme(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-2.5 rounded-xl mb-4 leading-snug">
              {applyingScheme.title}
            </h4>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t("Applicant's Full Name", 'விண்ணப்பதாரர் பெயர்')}</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('Number of Vitals Registered Cattle', 'பதிவுசெய்யப்பட்ட மாடுகளின் எண்ணிக்கை')}</label>
                <input
                  type="number"
                  value={cattleCount}
                  onChange={(e) => setCattleCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                  required
                />
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('Documents Verification checklist', 'ஆவணங்கள் சரிபார்ப்பு')}</span>
                <div className="space-y-1.5">
                  {applyingScheme.documents.map((doc, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-slate-350 dark:border-slate-700 text-emerald-500" required />
                      <span>{t('Attached scanned copy of ', 'நகல் இணைக்கப்பட்டுள்ளது - ')} {doc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setApplyingScheme(null)}
                  className="w-1/2 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition-all animate-none"
                >
                  {t('Cancel', 'ரத்து')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl text-xs hover:shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  {t('Submit Application', 'சமர்ப்பிக்கவும்')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
