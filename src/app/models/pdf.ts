import {Photo} from "./photo";

export interface Pdf {
  id?: string;
  _id?: string;
  name: string;
  chapter?: string;
  chapterName?: string;
  description?: string;
  media: File | undefined;
  fullPath?: string;
  date?: Date;
  // type?: 'pfd';
  thumbnail?: string;
}

export type PdfMedia = Photo & { type: 'pdf' };

