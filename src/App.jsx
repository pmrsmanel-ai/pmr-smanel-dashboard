import React, { useState, useEffect, useRef } from 'react';
import { 
  Droplets, 
  CalendarDays, 
  FileText, 
  Mail, 
  Users, 
  Globe, 
  AlertCircle,
  HeartPulse,
  Lock,
  UploadCloud,
  LayoutGrid,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  Home,
  Shield
} from 'lucide-react';

// --- ANIMATION COMPONENT ---
// Custom Scroll Reveal Component (Slide-up & Fade-in)
const ScrollReveal = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const currentRef = domRef.current;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- DATA APLIKASI ---
const initialApps = [
  { 
    name: 'BloodLink', 
    url: 'https://bloodlink.pmrsmanel.my.id/', 
    desc: 'Pendataan donor & stok darah digital.', 
    icon: Droplets 
  },
  { 
    name: 'Event System', 
    url: 'https://event.pmrsmanel.my.id/', 
    desc: 'Manajemen kegiatan & registrasi.', 
    icon: CalendarDays 
  },
  { 
    name: 'Report App', 
    url: 'https://report.pmrsmanel.my.id/', 
    desc: 'Pelaporan & dokumentasi proker.', 
    icon: FileText 
  },
  { 
    name: 'Undangan', 
    url: 'https://undangan.pmrsmanel.my.id/', 
    desc: 'Distribusi undangan digital resmi.', 
    icon: Mail 
  },
  { 
    name: 'PMR Admin', 
    url: 'https://appsystem.pmrsmanel.my.id/', 
    desc: 'Manajemen anggota & kas PMR.', 
    icon: Users 
  },
  { 
    name: 'Web Utama', 
    url: 'https://web.pmrsmanel.my.id/', 
    desc: 'Website portal informasi publik.', 
    icon: Globe 
  },
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  // Ambil gambar dari localStorage, perbaiki URL Google Drive agar tidak di-blok
  const [bgImage, setBgImage] = useState(() => {
    const saved = localStorage.getItem('pmr_bgImage');
    // Pastikan bukan string "null" yang tersimpan karena error sebelumnya
    if (saved && saved !== 'null') return saved;
    // Gunakan format CDN lh3 Google untuk bypass block keamanan
    return 'https://lh3.googleusercontent.com/d/1N_TrPjQwUnzQqnhBS7s9bj_94F5bc0xV';
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [appList, setAppList] = useState(initialApps);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const handleAddApp = () => {
    setAppList([...appList, { name: 'Aplikasi Baru', url: 'https://', desc: 'Deskripsi singkat...', icon: Globe }]);
  };

  const handleDeleteApp = (indexToRemove) => {
    setAppList(appList.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = () => {
    if (bgImage) {
      try {
        localStorage.setItem('pmr_bgImage', bgImage);
      } catch (error) {
        console.error("Gagal menyimpan: Ukuran gambar mungkin terlalu besar untuk Local Storage.");
      }
    } else {
      localStorage.removeItem('pmr_bgImage');
    }

    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleAppClick = (e, url) => {
    // Jika URL kosong, '#', atau default 'https://', cegah navigasi & alihkan ke halaman persiapan
    if (!url || url === '#' || url === 'https://') {
      e.preventDefault();
      setActiveTab('preparation');
    }
  };

  // Handle Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex justify-center font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      
      {/* Mobile App Container */}
      <div className={`w-full max-w-md relative shadow-2xl overflow-hidden flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>

        {/* Absolute Background Gradient & Image */}
        <div className="absolute top-0 left-0 w-full h-[45vh] -z-10 rounded-b-[2.5rem] overflow-hidden">
          {bgImage ? (
            <img src={bgImage} alt="Hero Background" className="w-full h-full object-cover opacity-85" />
          ) : (
            // Gradient diubah ke nuansa Maroon Terang (red-800 to red-600)
            <div className="w-full h-full bg-gradient-to-br from-red-800 via-red-700 to-red-600 dark:from-gray-900 dark:via-red-800/50"></div>
          )}
          <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-[2px]"></div>
        </div>
        <div className={`absolute top-[35vh] left-0 w-full h-[65vh] bg-gradient-to-b -z-20 ${darkMode ? 'from-transparent via-gray-900 to-gray-900' : 'from-transparent via-gray-50 to-white'}`}></div>

        {/* --- STICKY TOP HEADER --- */}
        <header className={`z-40 px-5 py-3.5 flex justify-between items-center backdrop-blur-lg border-b transition-colors duration-300
          ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-red-700/85 border-red-600/50 shadow-sm'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-red-700 shadow-inner shrink-0">
              <HeartPulse size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <h1 className="font-bold text-sm leading-tight text-white tracking-wide truncate">
                PMR SMANEL
              </h1>
              <p className="text-[10px] text-red-100/80 font-medium truncate">
                Integrated System Access
              </p>
            </div>
          </div>
        </header>

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
          
          {/* HEADER / HERO */}
          <div className="px-6 pt-12 pb-10">
            <ScrollReveal>
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight mt-2 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] text-center">
                PMR SMANEL<br/>MANAJEMEN SISTEM
              </h2>
            </ScrollReveal>
          </div>

          {/* TAB CONTENT: BERANDA (HOME) */}
          {activeTab === 'home' && (
            <div className="px-5">
              <ScrollReveal delay={200}>
                <div className="flex items-center justify-between mb-5 px-1">
                  <h2 className={`text-base font-bold tracking-wide ${darkMode ? 'text-white' : 'text-gray-800'}`}>Aplikasi & Sistem</h2>
                  <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-700/10 dark:bg-red-700/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {appList.length} Modul
                  </span>
                </div>
              </ScrollReveal>

              {/* Grid Layout 2 Kolom, 3 Baris Aplikasi Mobile */}
              <div className="grid grid-cols-2 gap-3.5">
                {appList.map((app, index) => (
                  <ScrollReveal key={index} delay={250 + (index * 50)}>
                    <a 
                      href={app.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => handleAppClick(e, app.url)}
                      className={`group block h-full p-4 rounded-2xl border transition-all duration-300 active:scale-95 flex flex-col items-center text-center
                        ${darkMode 
                          ? 'bg-gray-800/80 border-gray-700/50 hover:bg-gray-800 hover:border-red-700/50' 
                          : 'bg-white border-gray-100 hover:border-red-700/20 hover:shadow-[0_8px_30px_rgb(185,28,28,0.06)] shadow-sm'
                        }`}
                    >
                      <div className={`w-11 h-11 rounded-full mb-3.5 flex items-center justify-center transition-colors
                        ${darkMode ? 'bg-red-700/20 text-red-400 group-hover:bg-red-700/40' : 'bg-red-50 text-red-700 group-hover:bg-red-100'}`}>
                        <app.icon size={20} strokeWidth={2.5} />
                      </div>
                      
                      <h3 className={`font-bold text-sm leading-tight mb-1.5 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {app.name}
                      </h3>
                      <p className={`text-[10px] leading-snug line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {app.desc}
                      </p>
                    </a>
                  </ScrollReveal>
                ))}
              </div>

              {/* Banner Informasi Tambahan */}
              <ScrollReveal delay={500}>
                <div className={`mt-6 p-5 rounded-2xl flex items-start gap-4 border
                  ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-red-800 to-red-700 border-red-700 text-white shadow-xl shadow-red-700/10'}`}>
                  <div className={`p-2 rounded-xl mt-1 ${darkMode ? 'bg-gray-700 text-red-400' : 'bg-white/20 text-white'}`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 tracking-wide">Status Sistem Aktif</h4>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-red-100/90'}`}>
                      Seluruh modul berjalan dengan normal. Pastikan Anda memiliki otorisasi untuk mengakses data.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          )}

          {/* TAB CONTENT: PERSIAPAN (PREPARATION) */}
          {activeTab === 'preparation' && (
            <div className="px-5 py-8 flex flex-col items-center justify-center text-center mt-2">
              <ScrollReveal>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-red-50 text-red-400'}`}>
                  <AlertCircle size={40} strokeWidth={2} />
                </div>
                <h2 className={`text-2xl font-bold mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Sedang Dalam Persiapan
                </h2>
                <p className={`text-xs mb-8 leading-relaxed max-w-[250px] mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aplikasi atau modul ini sedang dalam tahap pengembangan dan akan segera hadir untuk Anda.
                </p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-bold tracking-wide rounded-xl shadow-lg shadow-red-700/20 transition-all active:scale-95"
                >
                  Kembali ke Beranda
                </button>
              </ScrollReveal>
            </div>
          )}

          {/* TAB CONTENT: ADMIN */}
          {activeTab === 'admin' && (
            <div className="px-5 py-6">
              {!isAdmin ? (
                <ScrollReveal>
                  <div className={`p-7 rounded-3xl border shadow-sm ${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-100'}`}>
                    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-700/20 flex items-center justify-center text-red-700 dark:text-red-400 mb-6 mx-auto shadow-inner">
                      <Lock size={28} />
                    </div>
                    <h2 className="text-xl font-bold mb-1 text-center tracking-tight">Login Admin</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-8">Otentikasi khusus pengelola sistem</p>
                    
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Username" 
                        className={`w-full px-4 py-3.5 text-sm rounded-xl border outline-none transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 focus:border-red-700' : 'bg-gray-50 border-gray-200 focus:border-red-700 focus:bg-white'}`}
                      />
                      <input 
                        type="password" 
                        placeholder="Password" 
                        className={`w-full px-4 py-3.5 text-sm rounded-xl border outline-none transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 focus:border-red-700' : 'bg-gray-50 border-gray-200 focus:border-red-700 focus:bg-white'}`}
                      />
                      <button 
                        onClick={() => setIsAdmin(true)}
                        className="w-full mt-2 py-3.5 bg-red-700 hover:bg-red-800 text-white text-sm font-bold tracking-wide rounded-xl shadow-lg shadow-red-700/20 transition-all active:scale-95"
                      >
                        Akses Panel
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ) : (
                <ScrollReveal>
                  <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold tracking-tight">Panel Admin</h2>
                      <button 
                        onClick={() => setIsAdmin(false)}
                        className="text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-700/20 px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-red-100 transition-colors"
                      >
                        Keluar
                      </button>
                    </div>
                    
                    <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-100'}`}>
                      <h3 className="font-bold text-sm mb-1.5 flex items-center gap-2">
                        <UploadCloud size={16} className="text-red-700" />
                        Visual Hero Menu
                      </h3>
                      <p className={`text-[10px] mb-5 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Ganti gambar latar belakang bagian atas aplikasi.
                      </p>
                      
                      <label className="flex items-center justify-center w-full h-28 border-2 border-dashed border-red-300 dark:border-red-700/50 rounded-xl cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-700/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-7 h-7 mb-2 text-red-700/70" />
                          <p className="text-[11px] text-gray-500 dark:text-gray-400"><span className="font-semibold">Ketuk untuk unggah file</span></p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if(file){
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setBgImage(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 tracking-widest">ATAU LINK G-DRIVE</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                      </div>

                      <div>
                        <input 
                          type="text" 
                          placeholder="Paste link bagikan Google Drive di sini..."
                          value={bgImage && !bgImage.startsWith('data:') ? bgImage : ''}
                          onChange={(e) => {
                            let url = e.target.value;
                            // Regex pintar untuk mengekstrak ID dari berbagai jenis link Google Drive
                            const driveRegex = /(?:file\/d\/|id=|d\/)([a-zA-Z0-9_-]{25,})/;
                            const match = url.match(driveRegex);
                            
                            if (match && match[1]) {
                              // Jika link GDrive terdeteksi, otomatis ubah ke format CDN yang bisa dibaca aplikasi
                              url = `https://lh3.googleusercontent.com/d/${match[1]}`;
                            }
                            
                            setBgImage(url);
                          }}
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-gray-900 border-gray-700 focus:border-red-700' : 'bg-white border-gray-200 focus:border-red-700'}`}
                        />
                        <p className={`text-[9px] mt-2 leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Cukup paste link <b>"Bagikan/Share"</b> dari Google Drive HP Anda. Sistem akan otomatis menyesuaikannya.<br/>
                          <span className="text-red-600 dark:text-red-400 font-semibold">*Pastikan akses di GDrive diset ke "Siapa saja yang memiliki link"</span>
                        </p>
                      </div>
                      
                      {bgImage && (
                        <button 
                          onClick={() => {
                            setBgImage(null);
                            localStorage.removeItem('pmr_bgImage');
                          }}
                          className="w-full mt-4 py-2.5 text-[11px] font-bold text-gray-500 hover:text-red-700 transition-colors border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-300 hover:bg-red-50"
                        >
                          Hapus Gambar Latar
                        </button>
                      )}
                    </div>

                    {/* App List Editor */}
                    <div className={`mt-5 p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-100'}`}>
                      <h3 className="font-bold text-sm mb-1.5 flex items-center gap-2">
                        <LayoutGrid size={16} className="text-red-700" />
                        Kelola Tautan Aplikasi
                      </h3>
                      <p className={`text-[10px] mb-4 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Ubah data aplikasi yang ditampilkan di Beranda. Kosongkan link atau isi dengan 'https://' jika aplikasi masih dikembangkan.
                      </p>
                      
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-hide">
                        {appList.map((app, index) => (
                          <div key={index} className={`p-4 rounded-xl border relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-3.5">
                              <div className="flex items-center gap-2">
                                <app.icon size={16} className="text-red-700" />
                                <span className="font-bold text-[10px] uppercase tracking-wider text-gray-500">Aplikasi {index + 1}</span>
                              </div>
                              <button 
                                onClick={() => handleDeleteApp(index)}
                                className="text-gray-400 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-700/10"
                                title="Hapus Aplikasi"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className={`text-[9px] font-bold tracking-wide uppercase ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Nama</label>
                                <input 
                                  type="text" 
                                  value={app.name} 
                                  onChange={(e) => {
                                    const newList = [...appList];
                                    newList[index].name = e.target.value;
                                    setAppList(newList);
                                  }}
                                  className={`w-full px-3 py-2 mt-1 text-xs rounded-lg border outline-none ${darkMode ? 'bg-gray-900 border-gray-700 focus:border-red-700' : 'bg-gray-50 border-gray-200 focus:border-red-700 focus:bg-white'}`}
                                />
                              </div>
                              <div>
                                <label className={`text-[9px] font-bold tracking-wide uppercase ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>URL Link</label>
                                <input 
                                  type="text" 
                                  value={app.url} 
                                  onChange={(e) => {
                                    const newList = [...appList];
                                    newList[index].url = e.target.value;
                                    setAppList(newList);
                                  }}
                                  className={`w-full px-3 py-2 mt-1 text-xs rounded-lg border outline-none ${darkMode ? 'bg-gray-900 border-gray-700 focus:border-red-700' : 'bg-gray-50 border-gray-200 focus:border-red-700 focus:bg-white'}`}
                                />
                              </div>
                              <div>
                                <label className={`text-[9px] font-bold tracking-wide uppercase ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Deskripsi</label>
                                <textarea 
                                  value={app.desc} 
                                  onChange={(e) => {
                                    const newList = [...appList];
                                    newList[index].desc = e.target.value;
                                    setAppList(newList);
                                  }}
                                  rows={2}
                                  className={`w-full px-3 py-2 mt-1 text-xs rounded-lg border outline-none resize-none ${darkMode ? 'bg-gray-900 border-gray-700 focus:border-red-700' : 'bg-gray-50 border-gray-200 focus:border-red-700 focus:bg-white'}`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons for App List */}
                      <div className="mt-5 flex gap-2.5">
                        <button
                          onClick={handleAddApp}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed font-bold text-[11px] transition-colors
                            ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-red-400' : 'border-gray-300 text-gray-500 hover:bg-red-50 hover:border-red-700 hover:text-red-700'}`}
                        >
                          <Plus size={16} /> Tambah
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex-[2] flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-[11px] tracking-wide rounded-xl shadow-lg shadow-red-700/20 transition-all active:scale-95"
                        >
                          <Save size={16} /> Simpan Perubahan
                        </button>
                      </div>

                      {showSaveToast && (
                        <div className="mt-4 p-2.5 bg-green-50/80 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-500/20 rounded-xl text-[11px] text-center font-semibold animate-pulse">
                          Berhasil disimpan! Perubahan sudah diterapkan.
                        </div>
                      )}
                    </div>

                  </div>
                </ScrollReveal>
              )}
            </div>
          )}

        </div>

        {/* --- FLOATING BOTTOM NAVIGATION BAR --- */}
        <div className={`absolute bottom-6 left-6 right-6 px-6 py-3.5 rounded-full border shadow-2xl z-50 transition-colors duration-300
          ${darkMode ? 'bg-gray-900/90 border-gray-700/50 backdrop-blur-xl shadow-black/60' : 'bg-white/90 border-white/80 backdrop-blur-xl shadow-red-700/10'}`}>
          <div className="flex justify-evenly items-center">
            
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1.5 p-1 transition-all duration-300 w-16 ${activeTab === 'home' ? 'text-red-700 dark:text-red-400 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-wide uppercase">Beranda</span>
            </button>

            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1.5 p-1 transition-all duration-300 w-16 ${activeTab === 'admin' ? 'text-red-700 dark:text-red-400 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Shield size={22} strokeWidth={activeTab === 'admin' ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-wide uppercase whitespace-nowrap">Admin</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}