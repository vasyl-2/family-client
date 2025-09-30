export interface Photo {
  id?: string;
  _id?: string;
  name: string;
  chapter?: string;
  chapterName?: string;
  description?: string;
  media: File | undefined;
  fullPath?: string;
  date?: Date;
  // type?: 'photo' | 'video' | 'pfd';
  thumbnail?: string;
}

export type PhotoMedia = Photo & { type: 'photo' | 'video' | 'pdf' };
