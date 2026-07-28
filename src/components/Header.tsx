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
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            title={t.settings}
            id="btn-toggle-sidebar"
          >
            <Sliders className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200 font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                  {t.appTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
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
        <div className="flex items-center gap-2">
          {/* Photo count indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
            <ImageIcon className="w-4 h-4 text-slate-500" />
            <span>{photoCount} {settings.lang === 'fa' ? 'عکس' : 'photos'}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => onUpdateSettings({ lang: settings.lang === 'fa' ? 'en' : 'fa' })}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-medium transition-all shadow-2xs shrink-0"
            id="btn-lang-toggle"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">{t.language}</span>
          </button>

          {/* Export PNG */}
          <button
            onClick={onExportPng}
            disabled={isExportingPng}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50 shrink-0"
            id="btn-export-png"
          >
            {isExportingPng ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{t.exportPng}</span>
            <span className="sm:hidden">PNG</span>
          </button>

          {/* Export ZIP */}
          <button
            onClick={onExportZip}
            disabled={isExportingZip}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50 shrink-0"
            id="btn-export-zip"
          >
            {isExportingZip ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-amber-400" />
            )}
            <span className="hidden lg:inline">{t.exportZip}</span>
            <span className="lg:hidden">ZIP</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200 shadow-2xs disabled:opacity-50 shrink-0"
            id="btn-export-pdf"
          >
            {isExportingPdf ? (
              <div className="w-4 h-4 border-2 border-slate-600/30 border-t-slate-800 rounded-full animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-red-600" />
            )}
            <span className="hidden md:inline">{t.exportPdf}</span>
            <span className="md:hidden">PDF</span>
          </button>

          {/* Direct Print */}
          <button
            onClick={onDirectPrint}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-200 shrink-0"
            id="btn-direct-print"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{t.directPrint}</span>
            <span className="sm:hidden">چاپ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
