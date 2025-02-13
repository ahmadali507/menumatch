export type ImageType = 'logo' | 'background';

export interface ImageFile {
  file: File | null;
  preview: string | null;
}

export interface ImageState {
  logo: ImageFile;
  background: ImageFile;
}

export interface CurrentImage {
  type: ImageType;
  url: string;
}
