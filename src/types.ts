export type PaperSize = 'A3' | 'A4' | 'A5' | 'A6' | 'Custom';

export type Orientation = 'portrait' | 'landscape';

export type FitMode = 'contain' | 'cover';

export type LayoutPreset = 
  | 'AUTO'
  | '4_A5_ON_A3'
  | '2_A4_ON_A3'
  | '8_A6_ON_A3'
  | '2_A5_ON_A4'
  | '4_A6_ON_A4'
  | '9_3.5x5_ON_A4'
  | 'CUSTOM_GRID';

export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  fileSize?: number;
}

export interface PhotoSlot {
  id: string;
  imageId: string | null;
  rotation: 0 | 90 | 180 | 270;
  zoom: number; // 1.0 to 3.0
  offsetX: number; // -50 to 50%
  offsetY: number; // -50 to 50%
  bgColor: string; // Background color when fitMode is contain
  fitMode: FitMode;
}

export interface PrintPage {
  id: string;
  pageNumber: number;
  slots: PhotoSlot[];
}

export interface AppSettings {
  paperSize: PaperSize;
  customPaperWidthMM: number;
  customPaperHeightMM: number;
  orientation: Orientation;
  
  layoutPreset: LayoutPreset;
  targetPhotoPreset: 'A4' | 'A5' | 'A6' | '10x15' | '13x18' | '9x13' | '3.5x5' | 'custom';
  customPhotoWidthMM: number;
  customPhotoHeightMM: number;
  
  gridCols: number;
  gridRows: number;
  gapMM: number;
  marginMM: number;
  
  showCropMarks: boolean;
  showSafeMargin: boolean;
  safeMarginMM: number;
  showRulers: boolean;
  
  defaultFitMode: FitMode;
  defaultBgColor: string;
  
  lang: 'fa' | 'en';
}
