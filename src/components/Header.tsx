import React, { useState, useEffect } from 'react';
import { ActiveModuleTab } from '../types';
import { getCurrentUserProfile, SETTINGS_UPDATED_EVENT } from '../utils/settingsStorage';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Calendar,
  Layers,
  Settings,
  Sparkles,
  Sun,
  Moon,
  Search,
  Bell,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface HeaderProps {
  activeTab: ActiveModuleTab;
  setActiveTab: (tab: ActiveModuleTab) => void;
  onToggleMobileSidebar: () => void;
  alertsCount?: number;
  onOpenAlertsModal?: () => void;
}

const TAB_TITLES: Record<ActiveModuleTab, { title: string; subtitle: string; icon: string }> = {
  dashboard: {
    title: 'اللوحة التحكم',
    subtitle: 'نظرة شاملة ولحظية على مؤشرات الأداء، الأرصدة المالية، والمخزون والمهام',
    icon: '📊',
  },
  financial: {
    title: 'ادارة السجل اليومي',
    subtitle: 'المطابقة المحاسبية الدقيقة للتدفقات النقدية والمصرفية وحسابات الصندوق',
    icon: '💳',
  },
  debts: {
    title: 'ادارة الديون والالتزامات',
    subtitle: 'تتبع الديون المستحقة لنا وعلينا، سجلات السداد، وجداول الأقساط',
    icon: '🪙',
  },
  stock: {
    title: 'ادارة صرف وتوريد',
    subtitle: 'مراقبة حركة المخزون، رصيد أول المدة، وحركات التوريد والصرف',
    icon: '📦',
  },
  tasks: {
    title: 'إدارة العمل',
    subtitle: 'متابعة المشاريع والمهام وأداء العمل',
    icon: '⚡',
  },
  taskflow: {
    title: 'إدارة العمل',
    subtitle: 'متابعة المشاريع والمهام وأداء العمل',
    icon: '⚡',
  },
  workos: {
    title: 'إدارة العمل',
    subtitle: 'متابعة المشاريع والمهام وأداء العمل',
    icon: '⚡',
  },
  customers: {
    title: 'ادارة العملاء وزيارات',
    subtitle: 'سجل العملاء، خطوط السير الأسبوعية، وتوثيق الزيارات والتحصيلات',
    icon: '👥',
  },
  doctors: {
    title: 'ادارة الاطباء وزيارات',
    subtitle: 'دليل الأطباء والمراكز، تتبع العينات المجانية، وتقييم خطط التغطية',
    icon: '🩺',
  },
  routines: {
    title: 'ادارة الروتين والعادات',
    subtitle: 'بناء الانضباط والالتزام اليومي والأسبوعي وتتبع سلاسل الإنجاز',
    icon: '🔥',
  },
  knowledge: {
    title: 'ادارة الملاحظات',
    subtitle: 'أرشفة التوجيهات الإدارية، محاضر الاجتماعات، والمسودات السريعة',
    icon: '📚',
  },
  custody: {
    title: 'ادارة العهد والاشكاليات',
    subtitle: 'متابعة وتوثيق العهد المالية والعينية، الفروقات المحاسبية، والتسويات',
    icon: '🛡️',
  },
  links: {
    title: 'مكتبة الروابط',
    subtitle: 'فهرس شامل لأدوات الذكاء الاصطناعي، مواقع العمل، المنصات، ومصادر الإنتاجية',
    icon: '🌐',
  },
  settings: {
    title: 'الاعدادات',
    subtitle: 'تصدير واستيراد قواعد البيانات الموحدة وإدارة النسخ الاحتياطي والأمان',
    icon: '⚙️',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onToggleMobileSidebar,
  alertsCount = 0,
  onOpenAlertsModal,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { currentUser, logout } = useAuth();
  const currentTabMeta = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;
  const [userProfile, setUserProfile] = useState(() => getCurrentUserProfile());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setUserProfile(getCurrentUserProfile());
    };
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
  }, []);

  const todayArabic = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors" dir="rtl">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Right side: Mobile Menu Toggle + Current Active View Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Right Sidebar Toggle */}
          <button
            onClick={onToggleMobileSidebar}
            className="flex lg:hidden items-center justify-center w-9 h-9 rounded-xl bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors cursor-pointer shadow-xs shrink-0"
            title="فتح القائمة الجانبية"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base select-none">{currentTabMeta.icon}</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 truncate">
                {currentTabMeta.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block font-medium">
              {currentTabMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Search Bar matching Nova ERP layout */}
        <div className="flex-1 max-w-md mx-2 lg:mx-6 hidden sm:block">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="بحث سريع في الصفحة الحالية... (Ctrl+K)"
              className="w-full bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl pr-4 pl-9 py-2 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
          </div>
        </div>

        {/* Left side: User Pill + Notification Bell + Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* User Avatar Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg transition-all cursor-pointer group"
              title={`المستخدم الحالي: ${currentUser?.name || userProfile.name} (انقر لفتح الإعدادات)`}
            >
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover:text-teal-600 transition-colors">
                  {currentUser?.name || userProfile.name}
                </span>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
                  {currentUser?.role === 'admin'
                    ? 'مدير النظام'
                    : currentUser?.role === 'accountant'
                    ? 'محاسب مالي'
                    : currentUser?.role === 'sales'
                    ? 'مندوب مبيعات'
                    : 'مستعرض'}
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-[#0d6854] text-white font-black text-xs flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                {currentUser?.avatarInitial || userProfile.initial}
              </div>
            </button>

            {/* Logout Quick Action Button */}
            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
              title="تسجيل الخروج من المنظومة"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Notification Bell with Dynamic Alerts */}
          <div className="relative">
            <button
              onClick={onOpenAlertsModal}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
              title={`الإشعارات وتنبيهات المواعيد (${alertsCount} مستحقة)`}
              aria-label="تنبيهات المواعيد والاستحقاقات"
            >
              <Bell className="w-4 h-4" />
            </button>
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-in zoom-in">
                {alertsCount > 99 ? '99+' : alertsCount}
              </span>
            )}
          </div>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs group"
            title={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton compact />
        </div>
      </div>
    </header>
  );
};

