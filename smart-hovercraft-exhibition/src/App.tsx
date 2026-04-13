/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, 
  CheckCircle2, 
  Download, 
  Image as ImageIcon, 
  ExternalLink, 
  Facebook, 
  FileText,
  ChevronRight,
  Clock,
  Settings,
  X,
  Plus,
  Trash2,
  Lock,
  Presentation,
  Layout
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { cn } from './lib/utils';

// --- Assets ---
const HOVERCRAFT_LOGO = "https://files.oaiusercontent.com/file-7p9m8z4y5x6c7v8b9n0m1l2k3j4h5g6f7d8s9a0p?se=2026-04-13T05%3A38%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dhovercraft.jpg&sig=v8b9n0m1l2k3j4h5g6f7d8s9a0p";
const SCHOOL_LOGO = "https://files.oaiusercontent.com/file-6f7d8s9a0p1o2i3u4y5t6r7e8w9q0p1o2i3u4y5t?se=2026-04-13T05%3A38%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dschool_logo.jpg&sig=6f7d8s9a0p1o2i3u4y5t6r7e8w9q0p1o2i3u4y5t";

// --- Types ---
type Language = 'vi' | 'en';

interface Content {
  title: string;
  school: string;
  checkInSuccess: string;
  checkInDesc: string;
  enterName: string;
  getName: string;
  certTitle: string;
  certConfirm: string;
  certFooter: string;
  checkInNumber: string;
  downloadBtn: string;
  galleryTitle: string;
  linksTitle: string;
  survey: string;
  facebook: string;
  notebook: string;
  presentation: string;
  infographic: string;
  currentTime: string;
  adminTitle: string;
  enterPin: string;
  wrongPin: string;
  addPhoto: string;
  addLink: string;
}

const translations: Record<Language, Content> = {
  vi: {
    title: 'Tàu đệm khí thông minh',
    school: 'Trường THCS Nguyễn Du',
    checkInSuccess: '🎉 CHECK-IN THÀNH CÔNG!',
    checkInDesc: 'Bạn đã check-in tại gian hàng Tàu đệm khí thông minh',
    enterName: 'Nhập tên của bạn',
    getName: 'Nhận chứng nhận',
    certTitle: 'CHỨNG NHẬN',
    certConfirm: 'Chứng nhận này được trao cho:',
    certFooter: 'Vì đã hoàn thành xuất sắc trải nghiệm tại gian hàng khoa học',
    checkInNumber: 'Số thứ tự trải nghiệm:',
    downloadBtn: 'Tải chứng nhận (PNG)',
    galleryTitle: 'Thư viện ảnh',
    linksTitle: 'Liên kết hữu ích',
    survey: 'Khảo sát trải nghiệm',
    facebook: 'Fanpage nhà trường',
    notebook: 'Tài liệu NotebookLM',
    presentation: 'Bài thuyết trình (PPTX)',
    infographic: 'Infographic dự án',
    currentTime: 'Thời gian hiện tại',
    adminTitle: 'Quản trị hệ thống',
    enterPin: 'Nhập mã PIN 6 số',
    wrongPin: 'Mã PIN không chính xác!',
    addPhoto: 'Thêm ảnh mới',
    addLink: 'Thêm liên kết',
  },
  en: {
    title: 'Smart Hovercraft',
    school: 'Nguyen Du Secondary School',
    checkInSuccess: '🎉 CHECK-IN SUCCESSFUL!',
    checkInDesc: 'You have checked in at the Smart Hovercraft booth',
    enterName: 'Enter your name',
    getName: 'Get Certificate',
    certTitle: 'CERTIFICATE',
    certConfirm: 'This certificate is awarded to:',
    certFooter: 'For successfully completing the science booth experience',
    checkInNumber: 'Experience Number:',
    downloadBtn: 'Download Certificate (PNG)',
    galleryTitle: 'Photo Gallery',
    linksTitle: 'Useful Links',
    survey: 'Experience Survey',
    facebook: 'School Fanpage',
    notebook: 'NotebookLM Resources',
    presentation: 'Presentation (PPTX)',
    infographic: 'Project Infographic',
    currentTime: 'Current Time',
    adminTitle: 'System Administration',
    enterPin: 'Enter 6-digit PIN',
    wrongPin: 'Incorrect PIN!',
    addPhoto: 'Add New Photo',
    addLink: 'Add Link',
  }
};

// --- Components ---

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [name, setName] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInNum, setCheckInNum] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleString());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinError, setPinError] = useState(false);
  
  // Dynamic Content State
  const [siteLogo, setSiteLogo] = useState(() => localStorage.getItem('hovercraft_site_logo') || HOVERCRAFT_LOGO);
  const [schoolLogo, setSchoolLogo] = useState(() => localStorage.getItem('hovercraft_school_logo') || SCHOOL_LOGO);
  const [infographicUrl, setInfographicUrl] = useState(() => localStorage.getItem('hovercraft_infographic_url') || "https://files.oaiusercontent.com/file-v6f7d8s9a0p1o2i3u4y5t6r7e8w9q0p1o2i3u4y5t?se=2026-04-13T05%3A46%3A40Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dinfographic.jpg&sig=v6f7d8s9a0p1o2i3u4y5t6r7e8w9q0p1o2i3u4y5t");
  const [pptUrl, setPptUrl] = useState(() => localStorage.getItem('hovercraft_ppt_url') || "");
  
  const [showInfographic, setShowInfographic] = useState(false);
  const [showPpt, setShowPpt] = useState(false);

  const [gallery, setGallery] = useState<string[]>(() => {
    const saved = localStorage.getItem('hovercraft_gallery');
    return saved ? JSON.parse(saved) : [
      'https://picsum.photos/seed/hover1/800/600',
      'https://picsum.photos/seed/hover2/800/600',
      'https://picsum.photos/seed/hover3/800/600',
      'https://picsum.photos/seed/hover4/800/600',
    ];
  });

  const certRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US'));
    }, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('hovercraft_gallery', JSON.stringify(gallery));
    localStorage.setItem('hovercraft_site_logo', siteLogo);
    localStorage.setItem('hovercraft_school_logo', schoolLogo);
    localStorage.setItem('hovercraft_infographic_url', infographicUrl);
    localStorage.setItem('hovercraft_ppt_url', pptUrl);
  }, [gallery, siteLogo, schoolLogo, infographicUrl, pptUrl]);

  const handleCheckIn = () => {
    if (!name.trim()) return;
    const currentCount = parseInt(localStorage.getItem('hovercraft_checkin_count') || '156');
    const newCount = currentCount + 1;
    localStorage.setItem('hovercraft_checkin_count', newCount.toString());
    setCheckInNum(newCount);
    setIsCheckedIn(true);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '27225') { // Updated PIN
      setIsAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const downloadCert = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `Certificate_${name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center glass-light border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img src={siteLogo} alt="Logo" className="w-10 h-10 rounded-full object-cover border-2 border-primary animate-float" referrerPolicy="no-referrer" />
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-tight text-primary leading-none">
              {t.title}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t.school}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-primary transition-all group"
          >
            <Languages size={14} className="text-slate-400 group-hover:text-primary" />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {lang === 'vi' ? 'EN' : 'VI'}
            </span>
          </button>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-primary transition-all"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-lg mx-auto space-y-12">
        
        {/* Hero Section */}
        {!isCheckedIn ? (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="inline-block p-4 rounded-full bg-soft-blue mb-2">
                <img src={siteLogo} alt="Hovercraft" className="w-24 h-24 object-contain animate-float" referrerPolicy="no-referrer" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-slate-900">
                {t.title}
              </h1>
              <p className="text-sm font-medium text-slate-500 max-w-[280px] mx-auto">
                {t.checkInDesc}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] cute-shadow border border-slate-100 space-y-6">
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                  <Clock size={12} />
                  {t.currentTime}
                </div>
                <div className="text-lg font-black text-primary">
                  {time}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    {t.enterName}
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all font-bold text-lg"
                  />
                </div>
                
                <button 
                  onClick={handleCheckIn}
                  disabled={!name.trim()}
                  className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {t.getName}
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section 
            initial={{ opacity: 0, rotateY: -20, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="space-y-8 relative"
          >
            {/* Formal Certificate */}
            <div className="relative group">
              {/* Tech Accents */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-4 border border-primary/20 rounded-[3rem] pointer-events-none"
              />
              
              <div 
                ref={certRef}
                className="cert-container p-6 bg-white formal-border shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-8 min-h-[600px] justify-center tech-glow"
              >
                {/* Hologram/Scan Effect Overlay */}
                <motion.div 
                  initial={{ top: "-100%" }}
                  animate={{ top: "200%" }}
                  transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
                  className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-primary/10 to-transparent z-50 pointer-events-none"
                />
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none hologram-overlay" style={{ backgroundImage: 'radial-gradient(#d4af37 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2 relative z-10"
                >
                  <div className="flex justify-center mb-4">
                    <img src={schoolLogo} alt="School" className="w-20 h-20 object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-gold font-serif text-sm tracking-[0.4em] uppercase font-bold">
                    {t.school}
                  </h3>
                  <h2 className="text-5xl font-serif font-black text-slate-900 tracking-tight">
                    {t.certTitle}
                  </h2>
                  <div className="w-32 h-1 bg-gold mx-auto mt-4" />
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-6 relative z-10 py-8"
                >
                  <p className="font-serif italic text-slate-500 text-lg">{t.certConfirm}</p>
                  <div className="relative inline-block">
                    <motion.span 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-5xl font-serif font-bold text-slate-900 border-b-2 border-gold pb-2 px-8 block"
                    >
                      {name}
                    </motion.span>
                    {/* Name Decoration */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-gold rotate-45" />
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-gold rotate-45" />
                  </div>
                  <p className="text-slate-600 font-serif italic max-w-[300px] mx-auto leading-relaxed">
                    {t.certFooter}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="pt-8 space-y-4 relative z-10 w-full px-12 flex flex-col items-center"
                >
                  <div className="w-full flex justify-between items-end">
                    <div className="text-left space-y-1">
                      <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                        {t.checkInNumber}
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        #{checkInNum}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                        DATE
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 flex justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 rounded-full border-2 border-gold/30 flex items-center justify-center relative"
                    >
                      <div className="w-12 h-12 rounded-full border border-gold/50" />
                      <div className="absolute inset-0 border-t-2 border-gold rounded-full" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="space-y-3"
            >
              <button 
                onClick={downloadCert}
                className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl tech-glow"
              >
                <Download size={20} />
                {t.downloadBtn}
              </button>
              
              <button 
                onClick={() => setIsCheckedIn(false)}
                className="w-full py-4 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-primary transition-all"
              >
                ← Quay lại
              </button>
            </motion.div>
          </motion.section>
        )}

        {/* Gallery */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 justify-center">
            <ImageIcon size={14} />
            {t.galleryTitle}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {gallery.map((src, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-3xl overflow-hidden cute-shadow border-4 border-white group relative"
              >
                <img 
                  src={src} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 justify-center">
            <ExternalLink size={14} />
            {t.linksTitle}
          </h2>
          <div className="space-y-3">
            <a href="https://forms.gle/gRMQDLSQGHDGFQ4n6" target="_blank" className="flex items-center justify-between p-5 bg-white rounded-3xl cute-shadow border border-slate-50 hover:border-primary transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-soft-blue text-primary">
                  <FileText size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{t.survey}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all" />
            </a>

            <a href="https://www.facebook.com/p/Trường-THCS-Nguyễn-Du-Phường-Bà-Rịa-61582115227971/" target="_blank" className="flex items-center justify-between p-5 bg-white rounded-3xl cute-shadow border border-slate-50 hover:border-accent transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-soft-pink text-accent relative">
                  <Facebook size={20} />
                  <img src={schoolLogo} alt="School" className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{t.facebook}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-accent transition-all" />
            </a>

            <button 
              onClick={() => setShowPpt(true)}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl cute-shadow border border-slate-50 hover:border-primary transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-soft-blue text-primary">
                  <Presentation size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{t.presentation}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all" />
            </button>

            <button 
              onClick={() => setShowInfographic(true)}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl cute-shadow border border-slate-50 hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-soft-pink text-accent">
                  <Layout size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{t.infographic}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-accent transition-all" />
            </button>

            <a href="https://notebooklm.google.com/notebook/fd2fd3d8-9680-455d-bf9d-77d612b347b3" target="_blank" className="flex items-center justify-between p-5 bg-white rounded-3xl cute-shadow border border-slate-50 hover:border-slate-400 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-600">
                  <FileText size={20} />
                </div>
                <span className="font-black text-sm uppercase tracking-tight">{t.notebook}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600 transition-all" />
            </a>
          </div>
        </section>

        <footer className="text-center pt-12 opacity-30 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            © 2026 Nguyen Du Secondary School
          </p>
        </footer>
      </main>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showInfographic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
          >
            <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden cute-shadow">
              <button 
                onClick={() => setShowInfographic(false)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 text-slate-900 hover:bg-white transition-all shadow-lg"
              >
                <X size={24} />
              </button>
              <div className="max-h-[85vh] overflow-y-auto p-4">
                <img src={infographicUrl} alt="Infographic" className="w-full h-auto rounded-2xl" referrerPolicy="no-referrer" />
              </div>
            </div>
          </motion.div>
        )}

        {showPpt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
          >
            <div className="relative w-full max-w-5xl aspect-video bg-white rounded-[2.5rem] overflow-hidden cute-shadow">
              <button 
                onClick={() => setShowPpt(false)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 text-slate-900 hover:bg-white transition-all shadow-lg"
              >
                <X size={24} />
              </button>
              {pptUrl ? (
                <iframe 
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptUrl)}`}
                  className="w-full h-full border-none"
                  title="PowerPoint Viewer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                  <Presentation size={64} />
                  <p className="font-bold uppercase tracking-widest">Chưa có link PowerPoint</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 cute-shadow relative overflow-hidden"
            >
              <button 
                onClick={() => { setIsAdminOpen(false); setIsAuthorized(false); setPin(''); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>

              {!isAuthorized ? (
                <div className="space-y-8 py-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-soft-blue rounded-3xl flex items-center justify-center mx-auto mb-4 text-primary">
                      <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">{t.adminTitle}</h2>
                    <p className="text-sm font-medium text-slate-400">{t.enterPin}</p>
                  </div>

                  <form onSubmit={handlePinSubmit} className="space-y-6">
                    <input 
                      type="password" 
                      maxLength={6}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••"
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 text-center text-3xl font-black tracking-[0.5em] focus:outline-none transition-all",
                        pinError ? "border-accent text-accent animate-shake" : "border-slate-100 focus:border-primary"
                      )}
                    />
                    {pinError && <p className="text-center text-xs font-bold text-accent uppercase tracking-widest">{t.wrongPin}</p>}
                    <button 
                      type="submit"
                      className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all"
                    >
                      Login
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                    <Settings size={24} className="text-primary" />
                    Dashboard
                  </h2>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Logos & Assets */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Logos & Assets</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <button 
                          onClick={() => {
                            const url = prompt('Nhập URL Logo Trang mới:', siteLogo);
                            if (url) setSiteLogo(url);
                          }}
                          className="w-full py-3 px-4 bg-slate-50 rounded-2xl text-left flex items-center gap-3 hover:bg-soft-blue transition-all"
                        >
                          <ImageIcon size={18} className="text-primary" />
                          <span className="text-sm font-bold">Đổi Logo Trang</span>
                        </button>
                        <button 
                          onClick={() => {
                            const url = prompt('Nhập URL Logo Trường mới:', schoolLogo);
                            if (url) setSchoolLogo(url);
                          }}
                          className="w-full py-3 px-4 bg-slate-50 rounded-2xl text-left flex items-center gap-3 hover:bg-soft-pink transition-all"
                        >
                          <ImageIcon size={18} className="text-accent" />
                          <span className="text-sm font-bold">Đổi Logo Trường</span>
                        </button>
                        <button 
                          onClick={() => {
                            const url = prompt('Nhập URL Infographic mới:', infographicUrl);
                            if (url) setInfographicUrl(url);
                          }}
                          className="w-full py-3 px-4 bg-slate-50 rounded-2xl text-left flex items-center gap-3 hover:bg-slate-100 transition-all"
                        >
                          <Layout size={18} className="text-slate-600" />
                          <span className="text-sm font-bold">Đổi URL Infographic</span>
                        </button>
                        <button 
                          onClick={() => {
                            const url = prompt('Nhập URL PowerPoint (Embed link):', pptUrl);
                            if (url) setPptUrl(url);
                          }}
                          className="w-full py-3 px-4 bg-slate-50 rounded-2xl text-left flex items-center gap-3 hover:bg-slate-100 transition-all"
                        >
                          <Presentation size={18} className="text-slate-600" />
                          <span className="text-sm font-bold">Đổi URL PowerPoint</span>
                        </button>
                      </div>
                    </div>

                    {/* Gallery Manager */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.galleryTitle}</h3>
                        <button 
                          onClick={() => {
                            const url = prompt(t.addPhoto);
                            if (url) setGallery([...gallery, url]);
                          }}
                          className="p-2 rounded-xl bg-soft-blue text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {gallery.map((src, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                              className="absolute inset-0 bg-accent/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats Reset */}
                    <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Stats</h3>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-600">Total Check-ins</span>
                        <span className="font-black text-xl text-primary">{localStorage.getItem('hovercraft_checkin_count') || 0}</span>
                      </div>
                      <button 
                        onClick={() => {
                          if (confirm('Reset all check-ins?')) {
                            localStorage.setItem('hovercraft_checkin_count', '0');
                            window.location.reload();
                          }
                        }}
                        className="w-full py-3 border-2 border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:border-accent hover:text-accent transition-all"
                      >
                        Reset Data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
