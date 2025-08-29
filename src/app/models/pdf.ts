export interface Pdf {
  id?: string;
  _id?: string;
  name: string;
  chapter?: string;
  chapterName?: string;
  description?: string;
  pdf: File | undefined;
  fullPath?: string;
  date?: Date;
  type?: 'pfd';
  thumbnail?: string;
}
