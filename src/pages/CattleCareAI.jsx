import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Scan, UploadCloud, Camera, Image as ImageIcon, CheckCircle, 
  AlertTriangle, Info, Pill, Leaf, Activity, Droplets, 
  HeartPulse, ShieldAlert, History, Download, FileText 
} from 'lucide-react';

export default function CattleCareAI() {
  const { t } = useContext(AppContext);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // --- Handlers for Drag and Drop ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    // Validate size (<10MB) and type
    if (file.size > 10 * 1024 * 1024) {
      alert(t("File size exceeds 10MB limit.", "கோப்பு அளவு 10MB வரம்பை மீறுகிறது.", "फ़ाइल का आकार 10MB सीमा से अधिक है।"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setAnalysisResult(null); // Reset previous result
    };
    reader.readAsDataURL(file);
  };

  const triggerAnalysis = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const mockResult = {
        date: new Date().toLocaleString(),
        animalId: "COW-105",
        diseaseName: t("Foot-and-Mouth Disease (FMD)", "கால் மற்றும் வாய் நோய் (FMD)", "पैर और मुंह की बीमारी (FMD)"),
        category: t("Viral", "வைரஸ்", "वायरल"),
        confidence: 94,
        severity: t("High", "உயர்", "उच्च"),
        description: t(
          "A highly contagious viral disease affecting cloven-hoofed animals.",
          "பிளவுபட்ட குளம்பு விலங்குகளைப் பாதிக்கும் மிகவும் தொற்று வைரஸ் நோய்.",
          "खुर वाले जानवरों को प्रभावित करने वाला एक अत्यधिक संक्रामक वायरल रोग।"
        ),
        symptoms: t(
          "Fever, blisters in mouth and on feet, excessive salivation, lameness.",
          "காய்ச்சல், வாய் மற்றும் கால்களில் கொப்புளங்கள், அதிக உமிழ்நீர், நொண்டியடித்தல்.",
          "बुखार, मुंह और पैरों पर छाले, अत्यधिक लार, लंगड़ापन।"
        ),
        causes: t("Picornavirus", "பிகார்னாவைரஸ்", "पिकोर्नवायरस"),
        riskFactors: t("Direct contact, contaminated water/feed", "நேரடி தொடர்பு, அசுத்தமான நீர்/தீவனம்", "सीधा संपर्क, दूषित पानी/चारा"),
        transmission: t("Aerosol, Contact", "காற்று மூலம், தொடர்பு", "एयरोसोल, संपर्क"),
        affectedParts: t("Mouth, Hooves, Teats", "வாய், குளம்புகள், காம்புகள்", "मुंह, खुर, थन"),
        recoveryTime: t("2-3 Weeks", "2-3 வாரங்கள்", "2-3 सप्ताह"),
        mortalityRisk: t("Low (Adults), High (Calves)", "குறைவு (பெரியவை), அதிகம் (கன்றுகள்)", "कम (वयस्क), उच्च (बछड़े)"),
        prevention: [
          t("Vaccination schedule", "தடுப்பூசி அட்டவணை", "टीकाकरण अनुसूची"),
          t("Isolation of infected animals", "பாதிக்கப்பட்ட விலங்குகளை தனிமைப்படுத்துதல்", "संक्रमित जानवरों का अलगाव"),
          t("Shelter sanitation", "தங்குமிடம் சுகாதாரம்", "आश्रय स्वच्छता"),
          t("Regular health check-ups", "வழக்கமான சுகாதார பரிசோதனைகள்", "नियमित स्वास्थ्य जांच")
        ],
        organicTreatment: [
          t("Neem solution for washing wounds", "காயங்களை கழுவ வேப்பிலை கரைசல்", "घावों को धोने के लिए नीम का घोल"),
          t("Turmeric paste application", "மஞ்சள் விழுது தடவுதல்", "हल्दी पेस्ट लगाना"),
          t("Aloe vera gel on blisters", "கொப்புளங்களில் கற்றாழை ஜெல்", "छालों पर एलोवेरा जेल"),
          t("Electrolyte water for hydration", "நீரேற்றத்திற்கு எலக்ட்ரோலைட் நீர்", "जलयोजन के लिए इलेक्ट्रोलाइट पानी")
        ],
        vetTreatment: [
          {
            med: t("Analgesics/Antipyretics", "வலி நிவாரணிகள்", "दर्द निवारक"),
            purpose: t("Reduce fever and pain", "காய்ச்சல் மற்றும் வலியைக் குறைக்கும்", "बुखार और दर्द कम करें"),
            dosage: t("As per vet advice (weight-based)", "கால்நடை மருத்துவர் ஆலோசனைப்படி", "पशु चिकित्सक की सलाह के अनुसार")
          },
          {
            med: t("Broad-spectrum Antibiotics", "நுண்ணுயிர் எதிர்ப்பிகள்", "एंटीबायोटिक्स"),
            purpose: t("Prevent secondary bacterial infections", "இரண்டாம் நிலை தொற்றுகளைத் தடுக்கவும்", "माध्यमिक जीवाणु संक्रमण को रोकें"),
            dosage: t("Varies by drug formulation", "மருந்து கலவையைப் பொறுத்து மாறுபடும்", "दवा के अनुसार भिन्न होता है")
          }
        ],
        aiSummary: t(
          "The uploaded image indicates early signs of Foot-and-Mouth Disease with a confidence score of 94%. Immediate isolation of the animal is recommended. Maintain hydration, disinfect the affected area, and consult a veterinarian for confirmation and treatment.",
          "பதிவேற்றப்பட்ட படம் 94% நம்பிக்கை மதிப்பெண்ணுடன் கால் மற்றும் வாய் நோயின் ஆரம்ப அறிகுறிகளைக் குறிக்கிறது. விலங்குகளை உடனடியாக தனிமைப்படுத்த பரிந்துரைக்கப்படுகிறது.",
          "अपलोड की गई छवि 94% आत्मविश्वास स्कोर के साथ पैर और मुंह की बीमारी के शुरुआती लक्षणों को इंगित करती है। जानवर को तत्काल अलग करने की सिफारिश की जाती है।"
        ),
        scores: {
          overallHealth: 35,
          recoveryProb: 85,
          infectionRisk: 95,
          hydration: 60,
          stress: 80
        },
        urgency: "Immediate Veterinary Attention Required"
      };

      setAnalysisResult(mockResult);
      setAnalysisHistory(prev => [
        { ...mockResult, image: selectedImage, id: Date.now() }, 
        ...prev
      ]);
      setIsAnalyzing(false);
    }, 2500); // 2.5 seconds delay
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 print:max-w-none print:pb-0">
      
      {/* HEADER / HERO SECTION */}
      <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-3xl p-8 mb-8 text-white shadow-xl flex flex-col md:flex-row items-center gap-8 print:hidden relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="flex-1 z-10">
          <div className="flex items-center gap-3 mb-2">
            <Scan className="text-emerald-400" size={28} />
            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight">CattleCare AI</h1>
          </div>
          <p className="text-emerald-100 text-sm md:text-base font-medium max-w-xl">
            {t(
              "AI-Powered Disease Detection & Treatment Recommendation Module.",
              "AI-ஆதரவுடன் கூடிய நோய் கண்டறிதல் & சிகிச்சை பரிந்துரைத் தொகுதி.",
              "एआई-संचालित रोग पहचान और उपचार सिफारिश मॉड्यूल।"
            )}
          </p>
          <p className="text-slate-300 text-xs md:text-sm mt-3 leading-relaxed max-w-xl">
            {t(
              "Upload or capture an image of your livestock to instantly identify potential diseases, get organic remedy suggestions, and view veterinary recommendations.",
              "சாத்தியமான நோய்களை உடனடியாகக் கண்டறிய, உங்கள் கால்நடைகளின் படத்தைப் பதிவேற்றவும் அல்லது படம்பிடிக்கவும்.",
              "संभावित बीमारियों की तुरंत पहचान करने के लिए अपने पशुधन की एक छवि अपलोड करें या कैप्चर करें।"
            )}
          </p>
        </div>
        
        {/* Hero Illustration Placeholder */}
        <div className="hidden md:flex w-48 h-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-full items-center justify-center shrink-0 z-10 shadow-2xl">
          <div className="w-36 h-36 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Activity size={64} className="text-emerald-400" />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: UPLOAD & ACTIONS */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Camera size={20} className="text-emerald-500" />
              {t("Analyze Image", "படத்தை பகுப்பாய்வு செய்", "छवि का विश्लेषण करें")}
            </h2>

            {/* Upload Area */}
            {!selectedImage ? (
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  dragActive ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleChange} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
                
                <div className="flex justify-center mb-4 text-slate-400">
                  <UploadCloud size={48} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t("Drag & Drop image here", "படத்தை இங்கே இழுத்து விடவும்", "छवि को यहां खींचें और छोड़ें")}
                </p>
                <p className="text-xs text-slate-500 mb-6">
                  {t("Supports JPG, JPEG, PNG up to 10MB", "10MB வரை JPG, JPEG, PNG ஆதரிக்கிறது", "10MB तक JPG, JPEG, PNG का समर्थन करता है")}
                </p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                    className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-sm border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex justify-center items-center gap-2"
                  >
                    <ImageIcon size={18} />
                    {t("Browse Image", "படத்தை உலாவுக", "छवि ब्राउज़ करें")}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); cameraInputRef.current.click(); }}
                    className="w-full py-2.5 px-4 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex justify-center items-center gap-2"
                  >
                    <Camera size={18} />
                    {t("Use Camera", "கேமராவைப் பயன்படுத்தவும்", "कैमरे का प्रयोग करें")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-video flex items-center justify-center">
                  <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain" />
                  {!isAnalyzing && !analysisResult && (
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white p-1.5 rounded-lg backdrop-blur-sm transition-colors text-xs font-semibold"
                    >
                      {t("Remove", "அகற்று", "निकालें")}
                    </button>
                  )}
                </div>
                
                {!analysisResult ? (
                  <button
                    onClick={triggerAnalysis}
                    disabled={isAnalyzing}
                    className={`w-full py-3.5 font-bold rounded-xl text-sm flex justify-center items-center gap-2 transition-all shadow-lg ${
                      isAnalyzing 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-500/25 hover:scale-[1.02]'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <Scan className="animate-spin text-emerald-500" size={18} />
                        {t("Analyzing cattle health using AI...", "AI மூலம் பகுப்பாய்வு செய்யப்படுகிறது...", "AI का उपयोग करके विश्लेषण कर रहा है...")}
                      </>
                    ) : (
                      <>
                        <Activity size={18} />
                        {t("Analyze Now", "பகுப்பாய்வு செய்", "अभी विश्लेषण करें")}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => { setSelectedImage(null); setAnalysisResult(null); }}
                    className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-colors"
                  >
                    {t("Analyze Another Image", "மற்றொரு படத்தைப் பகுப்பாய்வு செய்", "दूसरी छवि का विश्लेषण करें")}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Analysis History Mini */}
          {analysisHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <History size={16} className="text-blue-500" />
                {t("Recent Scans", "சமீபத்திய ஸ்கேன்கள்", "हाल के स्कैन")}
              </h2>
              <div className="space-y-3">
                {analysisHistory.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3 items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors" onClick={() => { setSelectedImage(item.image); setAnalysisResult(item); }}>
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 dark:border-slate-700">
                      <img src={item.image} alt="thumb" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.diseaseName}</p>
                      <p className="text-[10px] text-slate-500">{item.date.split(',')[0]} • {item.confidence}% match</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RESULTS DASHBOARD */}
        <div className="lg:col-span-2">
          
          {/* Default State before upload */}
          {!selectedImage && !isAnalyzing && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 print:hidden">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <Scan size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t("Ready for AI Analysis", "AI பகுப்பாய்வுக்கு தயார்", "AI विश्लेषण के लिए तैयार")}
              </h3>
              <p className="text-slate-500 max-w-sm text-sm">
                {t("Upload an image of the affected area to get instant disease detection and actionable treatment recommendations.", "பாதிக்கப்பட்ட பகுதியின் படத்தைப் பதிவேற்றவும்.", "प्रभावित क्षेत्र की एक छवि अपलोड करें।")}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm print:hidden">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-emerald-100 dark:border-emerald-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                <Scan size={32} className="absolute inset-0 m-auto text-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 animate-pulse">
                {t("Analyzing Cattle Image...", "படத்தை பகுப்பாய்வு செய்கிறது...", "छवि का विश्लेषण कर रहा है...")}
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                {t("Our AI models are processing the visual data.", "எங்கள் AI மாதிரிகள் தரவைச் செயல்படுத்துகின்றன.", "हमारे एआई मॉडल डेटा को प्रोसेस कर रहे हैं।")}
              </p>
            </div>
          )}

          {/* Result Dashboard */}
          {analysisResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* PRINT HEADER ONLY VISIBLE IN PRINT MODE */}
              <div className="hidden print:block mb-8 border-b-2 border-slate-200 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Scan size={24} className="text-emerald-600" />
                  <h1 className="text-2xl font-black text-slate-900">CattleCare AI Report</h1>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <p><strong>Report Date:</strong> {analysisResult.date}</p>
                  <p><strong>Animal ID:</strong> {analysisResult.animalId}</p>
                  <p><strong>Generated By:</strong> BioSense Collar System</p>
                </div>
              </div>

              {/* Top Banner: Emergency Status */}
              <div className={`rounded-2xl p-4 flex items-center justify-between border ${
                analysisResult.urgency.includes("Immediate") 
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle size={24} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">{t("Emergency Status", "அவசர நிலை", "आपातकालीन स्थिति")}</p>
                    <p className="text-base font-black">{analysisResult.urgency}</p>
                  </div>
                </div>
                <button 
                  onClick={handlePrint}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-current rounded-xl text-sm font-bold shadow-sm hover:opacity-80 transition-opacity print:hidden"
                >
                  <Download size={16} />
                  {t("Download PDF", "PDF பதிவிறக்கவும்", "पीडीएफ डाउनलोड करें")}
                </button>
              </div>

              {/* Print Only Image Preview */}
              <div className="hidden print:block w-full max-w-xs mx-auto mb-6 rounded-xl overflow-hidden border border-slate-200">
                <img src={selectedImage} alt="Analyzed Cattle" className="w-full h-auto" />
              </div>

              {/* Disease Identity Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 dark:bg-rose-500/5 rounded-bl-[100px] -z-0"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold mb-3 border border-slate-200 dark:border-slate-700">
                      <Activity size={12} />
                      {analysisResult.category} {t("Disease", "நோய்", "रोग")}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                      {analysisResult.diseaseName}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
                      {analysisResult.description}
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex gap-4 w-full md:w-auto">
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl p-4 flex-1 md:w-32 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 mb-1">{t("Severity", "தீவிரம்", "गंभीरता")}</p>
                      <p className="text-xl font-black text-rose-700 dark:text-rose-300">{analysisResult.severity}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-4 flex-1 md:w-32 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">{t("Confidence", "நம்பிக்கை", "आत्मविश्वास")}</p>
                      <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{analysisResult.confidence}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6 flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <SparklesIcon />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">{t("AI Health Summary", "AI சுகாதார சுருக்கம்", "एआई स्वास्थ्य सारांश")}</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    "{analysisResult.aiSummary}"
                  </p>
                </div>
              </div>

              {/* Grid: Details & Health Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Disease Profile */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                    <FileText size={18} className="text-slate-400" />
                    {t("Clinical Profile", "மருத்துவ விவரக்குறிப்பு", "नैदानिक प्रोफ़ाइल")}
                  </h3>
                  
                  <ul className="space-y-4 text-sm">
                    <li className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("Symptoms", "அறிகுறிகள்", "लक्षण")}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{analysisResult.symptoms}</span>
                    </li>
                    <li className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("Primary Cause", "முக்கிய காரணம்", "मुख्य कारण")}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{analysisResult.causes}</span>
                    </li>
                    <li className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("Transmission", "பண்பு", "हस्तांतरण")}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{analysisResult.transmission}</span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("Est. Recovery", "மதிப்பிடப்பட்ட மீட்பு", "अनुमानित वसूली")}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{analysisResult.recoveryTime}</span>
                    </li>
                  </ul>
                </div>

                {/* Health Score Dashboard */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-500" />
                    {t("Estimated Vitals Matrix", "மதிப்பிடப்பட்ட உயிரணுக்களின் அணி", "अनुमानित विटल्स मैट्रिक्स")}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <ScoreCard label={t("Overall Health", "ஒட்டுமொத்த ஆரோக்கியம்", "समग्र स्वास्थ्य")} score={analysisResult.scores.overallHealth} icon={HeartPulse} color="rose" />
                    <ScoreCard label={t("Infection Risk", "தொற்று அபாயம்", "संक्रमण का खतरा")} score={analysisResult.scores.infectionRisk} icon={ShieldAlert} color="amber" invert />
                    <ScoreCard label={t("Hydration", "நீரேற்றம்", "जलयोजन")} score={analysisResult.scores.hydration} icon={Droplets} color="blue" />
                    <ScoreCard label={t("Recovery Prob.", "மீட்பு வாய்ப்பு", "वसूली की संभावना")} score={analysisResult.scores.recoveryProb} icon={CheckCircle} color="emerald" />
                  </div>
                </div>

              </div>

              {/* Treatments Section */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                
                {/* Vet Disclaimer */}
                <div className="bg-slate-800 text-slate-200 p-4 px-6 flex gap-3 text-xs md:text-sm items-start">
                  <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-white">Disclaimer:</strong> {t(
                      "Medicine recommendations are AI-generated for educational purposes. Always consult a qualified veterinarian before administering medication.",
                      "மருந்து பரிந்துரைகள் கல்வி நோக்கங்களுக்காக AI மூலம் உருவாக்கப்படுகின்றன. மருந்து கொடுப்பதற்கு முன் எப்போதும் தகுதிவாய்ந்த கால்நடை மருத்துவரை அணுகவும்.",
                      "दवा की सिफारिशें शैक्षिक उद्देश्यों के लिए AI-जनित हैं। दवा देने से पहले हमेशा एक योग्य पशु चिकित्सक से सलाह लें।"
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                  
                  {/* Organic Treatment */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                        <Leaf size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t("Organic Treatment", "இயற்கை சிகிச்சை", "जैविक उपचार")}</h3>
                    </div>
                    <ul className="space-y-3">
                      {analysisResult.organicTreatment.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle size={16} className="text-teal-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Veterinary Treatment */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Pill size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t("Veterinary Care", "கால்நடை சிகிச்சை", "पशु चिकित्सा देखभाल")}</h3>
                    </div>
                    <div className="space-y-4">
                      {analysisResult.vetTreatment.map((med, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{med.med}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{med.purpose}</p>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 w-fit px-2 py-1 rounded-md">
                            <Info size={12} />
                            {med.dosage}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Prevention Tips */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <ShieldAlert size={20} className="text-emerald-500" />
                  {t("Prevention & Management", "தடுப்பு மற்றும் மேலாண்மை", "रोकथाम और प्रबंधन")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {analysisResult.prevention.map((tip, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-2 border border-slate-100 dark:border-slate-700">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle size={14} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Utility icon component
const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

// Mini Score Card Component
const ScoreCard = ({ label, score, icon: Icon, color, invert = false }) => {
  // Logic to determine color based on score
  const isGood = invert ? score < 40 : score > 60;
  const isBad = invert ? score > 70 : score < 40;
  
  let valColor = "text-slate-700 dark:text-slate-300";
  if (isGood) valColor = "text-emerald-500";
  else if (isBad) valColor = "text-rose-500";
  else valColor = "text-amber-500";

  const colorMap = {
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
          <Icon size={14} />
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-2xl font-black leading-none ${valColor}`}>{score}</span>
        <span className="text-xs font-bold text-slate-400 mb-0.5">/100</span>
      </div>
      
      {/* Mini Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
        <div 
          className={`h-full rounded-full ${isGood ? 'bg-emerald-500' : isBad ? 'bg-rose-500' : 'bg-amber-500'}`} 
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
