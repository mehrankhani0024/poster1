import React from 'react';
import { 
  Printer, 
  FileText, 
  Download, 
  Globe, 
  Sliders, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onDirectPrint: () => void;
  onExportPdf: () => void;
  onExportPng: () => void;
  onExportZip: () => void;
  isExportingPdf: boolean;
  isExportingPng: boolean;
  isExportingZip: boolean;
  onToggleMobileSidebar: () => void;
  photoCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onDirectPrint,
  onExportPdf,
  onExportPng,
  onExportZip,
  isExportingPdf,
  isExportingPng,
  isExportingZip,
  onToggleMobileSidebar,
  photoCount,
}) => {
  const t = translations[settings.lang];

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-2.5 sm:px-4 py-2.5 w-full max-w-full overflow-hidden shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            title={t.settings}
            id="btn-toggle-sidebar"
          >
            <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200 font-bold shrink-0">
              <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">
                  {t.appTitle}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-3 h-3" />
                  {settings.lang === 'fa' ? 'بدون تغییر نسبت عکس' : 'Zero Distortion'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
                {t.appSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Photo count indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium shrink-0">
            <ImageIcon className="w-4 h-4 text-slate-500" />
            <span>{photoCount} {settings.lang === 'fa' ? 'عکس' : 'photos'}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => onUpdateSettings({ lang: settings.lang === 'fa' ? 'en' : 'fa' })}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-medium transition-all shadow-2xs shrink-0"
            id="btn-lang-toggle"
            title={t.language}
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            <span className="hidden sm:inline">{t.language}</span>
          </button>

          {/* Export PNG */}
          <button
            onClick={onExportPng}
            disabled={isExportingPng}
            className="flex items-center gap-1 px-2 sm:px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50 shrink-0"
            id="btn-export-png"
            title={t.exportPng}
          >
            {isExportingPng ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
            <span className="text-[11px] sm:text-xs font-bold">PNG</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1 px-2 sm:px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200 shadow-2xs disabled:opacity-50 shrink-0"
            id="btn-export-pdf"
            title={t.exportPdf}
          >
            {isExportingPdf ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-600/30 border-t-slate-800 rounded-full animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
            )}
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Direct Print */}
          <button
            onClick={onDirectPrint}
            className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-200 shrink-0"
            id="btn-direct-print"
            title={t.directPrint}
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[11px] sm:text-xs font-bold">{settings.lang === 'fa' ? 'چاپ' : 'Print'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
