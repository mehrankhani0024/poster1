import React, { useState } from 'react';
import { 
  FileText, 
  LayoutGrid, 
  Upload, 
  Trash2, 
  RotateCw, 
  ZoomIn, 
  Check, 
  Layers, 
  Copy, 
  Palette, 
  Sparkles,
  SlidersHorizontal,
  X,
  Maximize2
} from 'lucide-react';
import { AppSettings, UploadedImage, PhotoSlot, LayoutPreset, PaperSize, FitMode } from '../types';
import { translations } from '../translations';
import { PHOTO_PRESET_MM } from '../utils/constants';

interface SidebarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  uploadedImages: UploadedImage[];
  onUploadPhotos: (files: FileList | File[]) => void;
  onClearAllPhotos: () => void;
  onAutoArrangePhotos: () => void;
  selectedSlot: PhotoSlot | null;
  onUpdateSelectedSlot: (updated: Partial<PhotoSlot>) => void;
  onDuplicateSlotToNext: () => void;
  onClearSelectedSlot: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  settings,
  onUpdateSettings,
  uploadedImages,
  onUploadPhotos,
  onClearAllPhotos,
  onAutoArrangePhotos,
  selectedSlot,
  onUpdateSelectedSlot,
  onDuplicateSlotToNext,
  onClearSelectedSlot,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'photos' | 'frame'>('layout');
  const t = translations[settings.lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadPhotos(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadPhotos(e.dataTransfer.files);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`no-print fixed lg:static top-0 bottom-0 ${settings.lang === 'fa' ? 'right-0' : 'left-0'} z-50 w-80 sm:w-96 bg-white border-x border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${
          isOpenMobile ? 'translate-x-0' : (settings.lang === 'fa' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
        }`}
        id="sidebar-container"
      >
        {/* Header Tabs */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex bg-slate-200/80 p-1 rounded-xl w-full text-xs font-semibold">
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'layout'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-btn-layout"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t.tabLayout}</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'photos'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-btn-photos"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.tabPhotos}</span>
              {uploadedImages.length > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {uploadedImages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('frame')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'frame'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-btn-frame"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.tabFrame}</span>
            </button>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* TAB 1: SHEET & LAYOUT SETTINGS */}
          {activeTab === 'layout' && (
            <div className="space-y-5">
              {/* Paper Size Preset */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {t.paperSizeLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['A3', 'A4', 'A5', 'A6', 'Custom'] as PaperSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => onUpdateSettings({ paperSize: size })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-0.5 transition-all ${
                        settings.paperSize === size
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                      id={`paper-size-${size}`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>{size}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {size === 'A3' && '297×420 mm'}
                        {size === 'A4' && '210×297 mm'}
                        {size === 'A5' && '148×210 mm'}
                        {size === 'A6' && '105×148 mm'}
                        {size === 'Custom' && 'سفارشی'}
                      </span>
                    </button>
                  ))}
                </div>

                {settings.paperSize === 'Custom' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-[11px] text-slate-500">عرض (mm):</span>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={settings.customPaperWidthMM}
                        onChange={(e) =>
                          onUpdateSettings({ customPaperWidthMM: Number(e.target.value) })
                        }
                        className="w-full mt-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500">ارتفاع (mm):</span>
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        value={settings.customPaperHeightMM}
                        onChange={(e) =>
                          onUpdateSettings({ customPaperHeightMM: Number(e.target.value) })
                        }
                        className="w-full mt-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {t.orientationLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ orientation: 'portrait' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      settings.orientation === 'portrait'
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="w-3 h-4 border-2 border-current rounded-xs" />
                    <span>{t.portrait}</span>
                  </button>

                  <button
                    onClick={() => onUpdateSettings({ orientation: 'landscape' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      settings.orientation === 'landscape'
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="w-4 h-3 border-2 border-current rounded-xs" />
                    <span>{t.landscape}</span>
                  </button>
                </div>
              </div>

              {/* Layout Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {t.presetLabel}
                </label>
                <select
                  value={settings.layoutPreset}
                  onChange={(e) => onUpdateSettings({ layoutPreset: e.target.value as LayoutPreset })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="select-layout-preset"
                >
                  <option value="AUTO">{t.presetAuto}</option>
                  <option value="4_A5_ON_A3">{t.preset4A5onA3}</option>
                  <option value="2_A4_ON_A3">{t.preset2A4onA3}</option>
                  <option value="8_A6_ON_A3">{t.preset8A6onA3}</option>
                  <option value="2_A5_ON_A4">{t.preset2A5onA4}</option>
                  <option value="4_A6_ON_A4">{t.preset4A6onA4}</option>
                  <option value="9_3.5x5_ON_A4">{t.preset9_35x5}</option>
                  <option value="CUSTOM_GRID">{t.presetCustomGrid}</option>
                </select>
              </div>

              {/* Auto mode target photo size selector */}
              {settings.layoutPreset === 'AUTO' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    {t.targetPhotoSize}
                  </label>
                  <select
                    value={settings.targetPhotoPreset}
                    onChange={(e) =>
                      onUpdateSettings({ targetPhotoPreset: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white text-slate-800"
                  >
                    {Object.entries(PHOTO_PRESET_MM).map(([key, item]) => (
                      <option key={key} value={key}>
                        {settings.lang === 'fa' ? item.nameFa : item.nameEn} ({item.width}×{item.height} mm)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Grid Controls */}
              {settings.layoutPreset === 'CUSTOM_GRID' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.columns}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={settings.gridCols}
                      onChange={(e) =>
                        onUpdateSettings({ gridCols: Math.max(1, Number(e.target.value)) })
                      }
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.rows}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={settings.gridRows}
                      onChange={(e) =>
                        onUpdateSettings({ gridRows: Math.max(1, Number(e.target.value)) })
                      }
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Spacing & Margins */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.marginMM}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={settings.marginMM}
                    onChange={(e) =>
                      onUpdateSettings({ marginMM: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.gapMM}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={settings.gapMM}
                    onChange={(e) =>
                      onUpdateSettings({ gapMM: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              {/* Toggles: Crop marks, Safe area, Rulers */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showCropMarks}
                    onChange={(e) => onUpdateSettings({ showCropMarks: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="text-xs font-medium text-slate-800">{t.cropMarks}</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showSafeMargin}
                    onChange={(e) => onUpdateSettings({ showSafeMargin: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="text-xs font-medium text-slate-800">{t.safeMargin}</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showRulers}
                    onChange={(e) => onUpdateSettings({ showRulers: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="text-xs font-medium text-slate-800">{t.showRulers}</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTOS & AUTO-ARRANGE */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              {/* Dropzone Upload */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-2xl p-4 text-center transition-all cursor-pointer relative group"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-input-batch"
                />
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-indigo-900 leading-snug">
                  {t.dragDropText}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">{t.orClickToBrowse}</p>
              </div>

              {/* Auto Arrange & Clear All Actions */}
              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <button
                    onClick={onAutoArrangePhotos}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
                    id="btn-auto-fill-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t.autoFillBtn}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>{t.photosUploadedCount.replace('{count}', uploadedImages.length.toString())}</span>
                    <button
                      onClick={onClearAllPhotos}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.clearAllPhotos}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Uploaded Photos Grid */}
              {uploadedImages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  {t.noPhotosUploaded}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={img.id}
                      className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-square shadow-2xs"
                    >
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <span className="text-[10px] text-white font-bold bg-slate-900/80 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FRAME & NON-DISTORTION SETTINGS */}
          {activeTab === 'frame' && (
            <div className="space-y-5">
              {/* Anti-distortion promise badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-snug">{t.aspectNotice}</p>
              </div>

              {/* Default Fit Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {t.fitModeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onUpdateSettings({ defaultFitMode: 'contain' });
                      if (selectedSlot) onUpdateSelectedSlot({ fitMode: 'contain' });
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      (selectedSlot ? selectedSlot.fitMode === 'contain' : settings.defaultFitMode === 'contain')
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span className="text-center">{t.fitContain}</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateSettings({ defaultFitMode: 'cover' });
                      if (selectedSlot) onUpdateSelectedSlot({ fitMode: 'cover' });
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      (selectedSlot ? selectedSlot.fitMode === 'cover' : settings.defaultFitMode === 'cover')
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span className="text-center">{t.fitCover}</span>
                  </button>
                </div>
              </div>

              {/* Background Color Picker for Frame Padding */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {t.bgColorLabel}
                </label>
                <div className="flex items-center gap-2">
                  {['#ffffff', '#000000', '#f8fafc', '#f1f5f9'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => {
                        onUpdateSettings({ defaultBgColor: hex });
                        if (selectedSlot) onUpdateSelectedSlot({ bgColor: hex });
                      }}
                      className="w-8 h-8 rounded-full border border-slate-300 shadow-2xs flex items-center justify-center"
                      style={{ backgroundColor: hex }}
                    >
                      {(selectedSlot ? selectedSlot.bgColor === hex : settings.defaultBgColor === hex) && (
                        <Check className={`w-4 h-4 ${hex === '#ffffff' ? 'text-slate-900' : 'text-white'}`} />
                      )}
                    </button>
                  ))}

                  <input
                    type="color"
                    value={selectedSlot?.bgColor || settings.defaultBgColor || '#ffffff'}
                    onChange={(e) => {
                      onUpdateSettings({ defaultBgColor: e.target.value });
                      if (selectedSlot) onUpdateSelectedSlot({ bgColor: e.target.value });
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0"
                    title="رنگ پس‌زمینه دلخواه"
                  />
                </div>
              </div>

              {/* Controls for currently selected slot */}
              {selectedSlot ? (
                <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">
                      تنظیمات فریم انتخابی
                    </span>
                    <button
                      onClick={onClearSelectedSlot}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold"
                    >
                      {t.clearSlot}
                    </button>
                  </div>

                  {/* Rotate Buttons */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                      {t.rotatePhoto}
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0, 90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => onUpdateSelectedSlot({ rotation: deg as any })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                            selectedSlot.rotation === deg
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-slate-700 border border-slate-200'
                          }`}
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>{deg}°</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inner Zoom */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>{t.zoomLabel}</span>
                      <span>{Math.round(selectedSlot.zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.05}
                      value={selectedSlot.zoom}
                      onChange={(e) =>
                        onUpdateSelectedSlot({ zoom: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Offset X / Y Shift */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-600">{t.offsetXLabel}</span>
                      <input
                        type="range"
                        min={-50}
                        max={50}
                        value={selectedSlot.offsetX}
                        onChange={(e) =>
                          onUpdateSelectedSlot({ offsetX: Number(e.target.value) })
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-600">{t.offsetYLabel}</span>
                      <input
                        type="range"
                        min={-50}
                        max={50}
                        value={selectedSlot.offsetY}
                        onChange={(e) =>
                          onUpdateSelectedSlot({ offsetY: Number(e.target.value) })
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Duplicate to next slots */}
                  <button
                    onClick={onDuplicateSlotToNext}
                    className="w-full py-2 bg-white hover:bg-slate-50 border border-indigo-300 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.duplicateToNext}</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">
                  {t.selectSlotPrompt}
                </p>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
