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
  LayoutGrid,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  Home,
  Shield,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
  Loader2
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// --- FIREBASE INITIALIZATION ---
let app = null;
let auth = null;
let db = null;
let appId = 'pmr-smanel-live';

const firebaseConfig = {
  apiKey: "AIzaSyAtaafsB2e7RB_1EgZ5AJxOrQrHOxBDLNk",
  authDomain: "pmr-smanel-dashboard.firebaseapp.com",
  projectId: "pmr-smanel-dashboard",
  storageBucket: "pmr-smanel-dashboard.firebasestorage.app",
  messagingSenderId: "1023504029235",
  appId: "1:1023504029235:web:4051ef78a3854d94fcf546"
};

// VVV TAMBAHKAN BLOK TRY-CATCH INI VVV
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Gagal inisialisasi Firebase", error);
}

// --- ICON MAPPING ---
// Karena Firebase tidak bisa menyimpan komponen icon (seperti <Droplets />), 
// kita harus menyimpannya sebagai nama (teks) dan memanggilnya di sini.
const iconMap = {
  Droplets, CalendarDays, FileText, Mail, Users, Globe
};

// --- ANIMATION COMPONENT ---
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
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- DATA APLIKASI (DEFAULT) ---
const initialApps = [
  { 
    name: 'BloodLink', 
    url: 'https://bloodlink.pmrsmanel.my.id/', 
    desc: 'Pendataan donor & stok darah.', 
    iconName: 'Droplets' 
  },
  { 
    name: 'Event System', 
    url: 'https://event.pmrsmanel.my.id/', 
    desc: 'Manajemen kegiatan & registrasi.', 
    iconName: 'CalendarDays' 
  },
  { 
    name: 'Report App', 
    url: 'https://report.pmrsmanel.my.id/', 
    desc: 'Pelaporan dokumentasi proker.', 
    iconName: 'FileText' 
  },
  { 
    name: 'Undangan', 
    url: 'https://undangan.pmrsmanel.my.id/', 
    desc: 'Distribusi undangan resmi digital.', 
    iconName: 'Mail' 
  },
  { 
    name: 'PMR Admin', 
    url: 'https://appsystem.pmrsmanel.my.id/', 
    desc: 'Manajemen anggota & kas PMR.', 
    iconName: 'Users' 
  },
  { 
    name: 'Web Utama', 
    url: 'https://web.pmrsmanel.my.id/', 
    desc: 'Portal informasi publik resmi.', 
    iconName: 'Globe' 
  },
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State Data & UI
  const [appList, setAppList] = useState(initialApps);
  const [isSyncing, setIsSyncing] = useState(!!auth); // Loading status
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  
  // Perbaikan State Dark Mode (Menyimpan Pilihan Tema ke Local Storage)
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('pmr_theme');
    return savedTheme === 'dark';
  });
  
  // State Admin Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // State Firebase User
  const [user, setUser] = useState(null);

  // 1. Inisialisasi Otentikasi Firebase
  useEffect(() => {
    if (!auth) {
      setIsSyncing(false);
      return;
    }
    
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Gagal otentikasi Firebase:", err);
        setIsSyncing(false);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Fetching Data Real-time dari Firestore
  useEffect(() => {
    if (!user || !db) return;

    // Lokasi penyimpanan data di database
    const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'pmr_config', 'main_config');

    // onSnapshot akan memonitor data secara live
    const unsubscribe = onSnapshot(configDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.appList && Array.isArray(data.appList)) {
          setAppList(data.appList);
        }
      } else {
        // Jika data kosong di database, gunakan data awal (initialApps)
        setAppList(initialApps);
      }
      setIsSyncing(false);
    }, (error) => {
      console.error("Error mengambil data:", error);
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [user]);


  // Action: Tambah Aplikasi Kosong
  const handleAddApp = () => {
    setAppList([...appList, { name: 'Aplikasi Baru', url: 'https://', desc: 'Deskripsi singkat...', iconName: 'Globe' }]);
  };

  // Action: Hapus Aplikasi
  const handleDeleteApp = (indexToRemove) => {
    setAppList(appList.filter((_, index) => index !== indexToRemove));
  };

  // Action: Simpan ke Firebase
  const handleSave = async () => {
    if (!user || !db) {
      // Jika mode lokal, cukup tampilkan sukses tanpa menyimpan ke cloud
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    try {
      const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'pmr_config', 'main_config');
      await setDoc(configDocRef, { appList: appList });
      setSaveStatus('success');
    } catch (err) {
      console.error("Gagal menyimpan ke Firebase:", err);
      setSaveStatus('error');
    }
    
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleAppClick = (e, url) => {
    if (!url || url === '#' || url === 'https://') {
      e.preventDefault();
      setActiveTab('preparation');
    }
  };

  const handleLogin = () => {
    if (username === 'admin' && password === 'pmr123') {
      setIsAdmin(true);
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Kredensial tidak valid. Akses ditolak!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab('home');
  };

  // Efek Theme Tailwind (Simpan ke Local Storage)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pmr_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pmr_theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex justify-center font-sans transition-colors duration-500 bg-slate-100 dark:bg-[#02040a] text-slate-800 dark:text-gray-100 selection:bg-blue-900 selection:text-white">
      
      {/* Mobile App Container */}
      <div className="w-full max-w-md relative shadow-2xl overflow-hidden flex flex-col transition-colors duration-500 bg-[#f8fafc] dark:bg-[#050b14]">

        {/* --- CREATIVE AMBIENT BACKGROUND --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[20%] w-[150%] h-[50%] bg-blue-300/30 dark:bg-blue-950/40 rounded-[100%] blur-[80px] opacity-80 animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-[30%] -right-[30%] w-[100%] h-[60%] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-[100%] blur-[100px] opacity-60 mix-blend-screen dark:mix-blend-screen"></div>
          <div className="absolute -bottom-[20%] left-[-10%] w-[120%] h-[50%] bg-slate-300/50 dark:bg-blue-900/30 rounded-[100%] blur-[90px] opacity-70 mix-blend-screen dark:mix-blend-screen"></div>
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] mix-blend-multiply dark:mix-blend-normal bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>

        {/* --- STICKY TOP HEADER --- */}
        <header className="z-40 px-6 py-4 flex justify-between items-center backdrop-blur-2xl border-b shadow-lg transition-colors duration-500 bg-white/80 border-slate-200 dark:bg-black/20 dark:border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative group transition-colors duration-500 bg-slate-900 text-white shadow-[0_0_15px_rgba(15,23,42,0.2)] dark:bg-gradient-to-br dark:from-blue-800 dark:to-blue-950 dark:shadow-[0_0_15px_rgba(30,58,138,0.5)] dark:border dark:border-blue-500/20">
              <HeartPulse size={20} strokeWidth={2.5} className="relative z-10" />
              <div className="hidden dark:block absolute inset-0 bg-blue-500/20 rounded-2xl blur-md group-hover:bg-blue-500/40 transition-all"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-sm leading-tight tracking-widest uppercase transition-colors duration-500 text-slate-900 dark:text-white">
                PMR SMANEL
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full transition-colors duration-300 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-300 dark:border-white/10"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <div className="px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-colors duration-500 bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10">
              {isSyncing ? (
                <Loader2 size={10} className="animate-spin text-blue-600 dark:text-cyan-400" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)] dark:bg-cyan-400 dark:shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
              )}
              <span className="text-[8px] font-bold tracking-widest uppercase transition-colors duration-500 text-slate-600 dark:text-gray-300">
                {isSyncing ? 'Syncing...' : 'Online'}
              </span>
            </div>
          </div>
        </header>

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto pb-36 pt-6 scrollbar-hide relative z-10">
          
          {/* HEADER / HERO */}
          {activeTab !== 'admin' && (
            <div className="px-6 pb-10">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm transition-colors duration-500 bg-blue-100 border border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-900/50 dark:text-blue-300 dark:shadow-[0_0_20px_rgba(30,58,138,0.2)]">
                  <Sparkles size={12} className="text-blue-600 dark:text-cyan-400" /> Digital Ecosystem
                </div>
                <h2 className="text-4xl font-black tracking-tighter leading-[1.1] mb-1 transition-colors duration-500 text-slate-900 dark:text-white">
                  PMR SMANEL
                </h2>
                <h2 className={`text-[2rem] font-black tracking-tighter leading-none text-transparent bg-clip-text drop-shadow-sm mb-4 pb-1 transition-all duration-500 bg-gradient-to-r ${darkMode ? 'from-cyan-400 via-blue-500 to-blue-800' : 'from-slate-900 via-blue-900 to-blue-700'}`}>
                  MANAJEMEN SISTEM
                </h2>
                <p className="text-sm font-medium leading-relaxed max-w-[90%] transition-colors duration-500 text-slate-600 dark:text-gray-400">
                  Pusat integrasi seluruh modul operasional dalam satu antarmuka yang elegan.
                </p>
              </ScrollReveal>
            </div>
          )}

          {/* TAB CONTENT: BERANDA (HOME) */}
          {activeTab === 'home' && (
            <div className="px-5">
              <ScrollReveal delay={150}>
                <div className="flex items-center justify-between mb-6 px-1">
                  <h2 className="text-xs font-bold tracking-widest uppercase transition-colors duration-500 text-slate-500 dark:text-gray-300">Modul Aplikasi</h2>
                  <span className="text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-500 bg-blue-100 border border-blue-200 text-blue-800 dark:text-cyan-400 dark:bg-blue-950/40 dark:border-blue-900/30">
                    {appList.length} Active
                  </span>
                </div>
              </ScrollReveal>

              {isSyncing && appList.length === initialApps.length && (
                <div className="flex justify-center my-10">
                  <Loader2 className="animate-spin text-blue-500 opacity-50" size={32} />
                </div>
              )}

              {/* BENTO GRID LAYOUT */}
              <div className="grid grid-cols-2 gap-4">
                {appList.map((app, index) => {
                  const AppIcon = iconMap[app.iconName] || Globe;
                  return (
                    <ScrollReveal key={index} delay={200 + (index * 50)}>
                      <a 
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => handleAppClick(e, app.url)}
                        className="group relative flex flex-col h-full p-5 rounded-[2rem] transition-all duration-500 overflow-hidden active:scale-95 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 dark:bg-white/[0.02] dark:border-white/[0.05] dark:hover:border-blue-500/30 dark:hover:shadow-none"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-50/0 to-blue-50/50 dark:from-blue-900/0 dark:to-blue-950/20"></div>
                        
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 relative z-10 bg-slate-50 border border-slate-100 text-blue-800 group-hover:text-blue-600 group-hover:bg-blue-50 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 dark:border-white/10 dark:text-blue-400 dark:group-hover:text-cyan-300 dark:group-hover:bg-transparent dark:group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] dark:group-hover:scale-110">
                          <AppIcon size={22} strokeWidth={2} />
                        </div>
                        
                        <div className="relative z-10 flex-1 flex flex-col justify-end">
                          <h3 className="font-bold text-sm mb-1.5 tracking-wide transition-colors duration-500 text-slate-900 dark:text-white">
                            {app.name}
                          </h3>
                          <p className="text-[10px] leading-relaxed line-clamp-2 transition-colors duration-500 text-slate-500 dark:text-gray-400">
                            {app.desc}
                          </p>
                        </div>

                        <div className="absolute top-5 right-5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-slate-100 dark:bg-white/5">
                          <ChevronRight size={12} className="text-blue-700 dark:text-cyan-400" />
                        </div>
                      </a>
                    </ScrollReveal>
                  );
                })}
              </div>

              {/* System Status Banner */}
              <ScrollReveal delay={500}>
                <div className="mt-8 p-5 rounded-[2rem] relative overflow-hidden group transition-all duration-500 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl dark:bg-white/[0.02] dark:border-white/[0.05] dark:shadow-none dark:hover:border-blue-900/50">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-colors bg-blue-100 dark:bg-blue-900/20 dark:group-hover:bg-blue-800/30"></div>
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-2.5 rounded-2xl transition-colors duration-500 bg-blue-50 border border-blue-100 text-blue-600 dark:bg-blue-950/50 dark:border-blue-900/50 dark:text-cyan-400 dark:shadow-[0_0_15px_rgba(30,58,138,0.3)]">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1 tracking-wide transition-colors duration-500 text-slate-900 dark:text-white">Database Tersinkronisasi</h4>
                      <p className="text-[11px] leading-relaxed transition-colors duration-500 text-slate-500 dark:text-gray-400">
                        Keamanan & pembaruan data real-time berjalan dengan baik. Server dalam status prima.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          )}

          {/* TAB CONTENT: PERSIAPAN */}
          {activeTab === 'preparation' && (
            <div className="px-5 py-16 flex flex-col items-center justify-center text-center">
              <ScrollReveal>
                <div className="w-24 h-24 mx-auto rounded-[2.5rem] flex items-center justify-center mb-8 relative transition-all duration-500 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 dark:bg-white/[0.03] dark:shadow-none dark:border-white/[0.05]">
                  <div className="hidden dark:block absolute inset-0 bg-blue-900/20 rounded-[2.5rem] blur-xl animate-pulse"></div>
                  <AlertCircle size={40} strokeWidth={1.5} className="relative z-10 transition-colors duration-500 text-blue-800 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-black mb-3 tracking-tight transition-colors duration-500 text-slate-900 dark:text-white">
                  Modul Terkunci
                </h2>
                <p className="text-xs mb-10 leading-relaxed max-w-[260px] mx-auto transition-colors duration-500 text-slate-500 dark:text-gray-400">
                  Modul ini sedang dalam tahap pengembangan (maintenance).
                </p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="px-8 py-3.5 text-xs font-bold tracking-widest uppercase rounded-2xl transition-all active:scale-95 bg-slate-900 border border-slate-800 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 dark:bg-gradient-to-r dark:from-blue-800 dark:to-blue-950 dark:border-blue-800/50 dark:shadow-[0_0_20px_rgba(30,58,138,0.4)] dark:hover:shadow-[0_0_30px_rgba(30,58,138,0.6)]"
                >
                  Kembali
                </button>
              </ScrollReveal>
            </div>
          )}

          {/* TAB CONTENT: ADMIN */}
          {activeTab === 'admin' && (
            <div className="px-5 py-2">
              {!isAdmin ? (
                <ScrollReveal>
                  <div className="p-8 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 dark:bg-white/[0.02] dark:border-white/[0.05] dark:shadow-none dark:backdrop-blur-sm">
                    <div className="hidden dark:block absolute -top-20 -right-20 w-40 h-40 bg-blue-900/30 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-8 mx-auto transition-colors duration-500 bg-slate-900 text-white shadow-lg shadow-slate-900/30 dark:bg-blue-950/50 dark:border dark:border-blue-900/50 dark:text-blue-400 dark:shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                      <Lock size={24} />
                    </div>
                    <h2 className="text-xl font-black mb-2 text-center tracking-tight transition-colors duration-500 text-slate-900 dark:text-white">Login Admin</h2>
                    <p className="text-[11px] text-center mb-8 transition-colors duration-500 text-slate-500 dark:text-gray-400">Masukan kredensial untuk mengakses root system.</p>
                    
                    <div className="space-y-4 relative z-10">
                      {loginError && (
                        <div className="p-3 mb-2 rounded-2xl text-[10px] uppercase tracking-widest text-center font-bold animate-pulse shadow-sm bg-red-50 border border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-400 dark:shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                          {loginError}
                        </div>
                      )}

                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Username" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={`w-full px-5 py-4 text-sm rounded-2xl outline-none transition-all duration-500 bg-slate-50 border text-slate-900 focus:bg-white placeholder:text-slate-400 dark:bg-black/40 dark:text-white dark:focus:bg-white/5 dark:placeholder:text-gray-600 ${loginError ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 focus:border-blue-500 dark:border-white/10 dark:focus:border-blue-500/50'}`}
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type="password" 
                          placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          className={`w-full px-5 py-4 text-sm rounded-2xl outline-none transition-all duration-500 bg-slate-50 border text-slate-900 focus:bg-white placeholder:text-slate-400 dark:bg-black/40 dark:text-white dark:focus:bg-white/5 dark:placeholder:text-gray-600 ${loginError ? 'border-red-400 dark:border-red-500/50' : 'border-slate-200 focus:border-blue-500 dark:border-white/10 dark:focus:border-blue-500/50'}`}
                        />
                      </div>
                      <button 
                        onClick={handleLogin}
                        className="w-full mt-4 py-4 text-xs font-bold tracking-widest uppercase rounded-2xl transition-all active:scale-95 bg-slate-900 border border-slate-800 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 dark:bg-gradient-to-r dark:from-blue-700 dark:to-blue-950 dark:border-blue-800/50 dark:shadow-[0_0_20px_rgba(30,58,138,0.3)] dark:hover:shadow-[0_0_30px_rgba(30,58,138,0.5)]"
                      >
                        Buka Akses
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ) : (
                <ScrollReveal>
                  <div className="p-6 rounded-[2.5rem] transition-all duration-500 bg-white/80 border border-slate-200 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:bg-white/[0.02] dark:border-white/[0.05] dark:shadow-none dark:backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-lg font-black tracking-tight transition-colors duration-500 text-slate-900 dark:text-white">Terminal Admin</h2>
                      <button 
                        onClick={handleLogout}
                        className="text-[9px] font-bold px-4 py-2 rounded-xl uppercase tracking-widest transition-colors duration-500 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border dark:border-blue-900/30 dark:hover:bg-blue-900/50"
                      >
                        Keluar
                      </button>
                    </div>

                    {/* App List Editor */}
                    <div className="p-1">
                      <h3 className="font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2 transition-colors duration-500 text-slate-800 dark:text-gray-300">
                        <LayoutGrid size={14} className="text-blue-700 dark:text-cyan-400" />
                        Routing Cloud
                      </h3>
                      <p className="text-[10px] mb-6 leading-relaxed transition-colors duration-500 text-slate-500 dark:text-gray-500">
                        Konfigurasi ini terhubung langsung dengan Firebase Database. Perubahan akan disinkronisasi ke seluruh perangkat secara real-time.
                      </p>
                      
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                        {appList.map((app, index) => {
                           const AppIcon = iconMap[app.iconName] || Globe;
                           return (
                            <div key={index} className="p-5 rounded-3xl relative group transition-colors shadow-sm bg-slate-50 border border-slate-200 hover:border-blue-300 dark:bg-black/40 dark:border-white/[0.05] dark:hover:border-white/10 dark:shadow-none">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-colors duration-500 bg-white border border-slate-200 text-blue-700 dark:bg-white/5 dark:border-transparent dark:text-blue-400 dark:shadow-none">
                                    <AppIcon size={14} />
                                  </div>
                                  <span className="font-bold text-[10px] uppercase tracking-widest transition-colors duration-500 text-slate-500 dark:text-gray-400">Modul 0{index + 1}</span>
                                </div>
                                <button 
                                  onClick={() => handleDeleteApp(index)}
                                  className="p-2 rounded-xl transition-colors duration-300 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-950/50"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <input 
                                    type="text" 
                                    value={app.name} 
                                    placeholder="Nama Aplikasi"
                                    onChange={(e) => {
                                      const newList = [...appList];
                                      newList[index].name = e.target.value;
                                      setAppList(newList);
                                    }}
                                    className="w-full px-4 py-3 text-xs rounded-xl outline-none transition-all font-bold bg-white border border-slate-200 text-slate-900 focus:border-blue-500 placeholder:text-slate-400 dark:bg-white/5 dark:border-transparent dark:text-white dark:focus:border-blue-500/50 dark:placeholder:text-gray-600"
                                  />
                                </div>
                                <div>
                                  <input 
                                    type="text" 
                                    value={app.url} 
                                    placeholder="https://"
                                    onChange={(e) => {
                                      const newList = [...appList];
                                      newList[index].url = e.target.value;
                                      setAppList(newList);
                                    }}
                                    className="w-full px-4 py-3 text-[11px] rounded-xl outline-none transition-all font-mono bg-white border border-slate-200 text-slate-600 focus:border-blue-500 placeholder:text-slate-400 dark:bg-white/5 dark:border-transparent dark:text-gray-300 dark:focus:border-blue-500/50 dark:placeholder:text-gray-600"
                                  />
                                </div>
                                <div>
                                  <textarea 
                                    value={app.desc} 
                                    placeholder="Deskripsi singkat..."
                                    onChange={(e) => {
                                      const newList = [...appList];
                                      newList[index].desc = e.target.value;
                                      setAppList(newList);
                                    }}
                                    rows={2}
                                    className="w-full px-4 py-3 text-[11px] rounded-xl outline-none resize-none transition-all bg-white border border-slate-200 text-slate-600 focus:border-blue-500 placeholder:text-slate-400 dark:bg-white/5 dark:border-transparent dark:text-gray-400 dark:focus:border-blue-500/50 dark:placeholder:text-gray-600"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={handleAddApp}
                          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-dashed font-bold text-[10px] uppercase tracking-widest transition-all border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-400 dark:border-white/20 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white dark:hover:border-white/40"
                        >
                          <Plus size={14} /> Add
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex-[2] flex items-center justify-center gap-2 py-4 font-bold text-[10px] uppercase tracking-widest rounded-2xl transition-all active:scale-95 bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 dark:bg-gradient-to-r dark:from-blue-800 dark:to-blue-950 dark:border dark:border-blue-800/50 dark:shadow-[0_0_20px_rgba(30,58,138,0.3)] dark:hover:shadow-[0_0_30px_rgba(30,58,138,0.5)]"
                        >
                          <Save size={14} /> Sync Cloud
                        </button>
                      </div>

                      {/* Notifikasi Status Save */}
                      {saveStatus === 'success' && (
                        <div className="mt-5 p-3 rounded-2xl text-[10px] uppercase tracking-widest text-center font-bold animate-pulse shadow-sm bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-cyan-300 dark:shadow-[0_0_15px_rgba(30,58,138,0.2)]">
                          Berhasil Disinkronisasi ke Database
                        </div>
                      )}
                      {saveStatus === 'error' && (
                        <div className="mt-5 p-3 rounded-2xl text-[10px] uppercase tracking-widest text-center font-bold shadow-sm bg-red-50 border border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-400">
                          Gagal Menghubungi Server
                        </div>
                      )}
                    </div>

                  </div>
                </ScrollReveal>
              )}
            </div>
          )}

        </div>

        {/* --- ULTRA MODERN FLOATING BOTTOM DOCK --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[300px] p-2 rounded-[2rem] backdrop-blur-xl z-50 transition-colors duration-500 bg-white/90 border border-slate-200 shadow-[0_20px_40px_rgba(15,23,42,0.1)] dark:bg-black/40 dark:border-white/10 dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center relative">
            
            {/* Active Pill Indicator */}
            <div 
              className={`absolute top-0 bottom-0 w-1/2 rounded-[1.5rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-slate-900 dark:bg-white/10 ${activeTab === 'home' || activeTab === 'preparation' ? 'translate-x-0' : 'translate-x-full'}`}
            ></div>

            <button 
              onClick={() => setActiveTab('home')}
              className={`relative z-10 flex-1 flex py-3 items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'home' || activeTab === 'preparation' ? 'text-white' : 'text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
            >
              <Home size={18} strokeWidth={activeTab === 'home' || activeTab === 'preparation' ? 2.5 : 2} />
              <span className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'home' || activeTab === 'preparation' ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>Beranda</span>
            </button>

            <button 
              onClick={() => setActiveTab('admin')}
              className={`relative z-10 flex-1 flex py-3 items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'admin' ? 'text-white' : 'text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
            >
              <Shield size={18} strokeWidth={activeTab === 'admin' ? 2.5 : 2} />
              <span className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'admin' ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>Admin</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}