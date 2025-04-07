export interface Photo {
  id?: string;
  _id?: string;
  name: string;
  chapter?: string;
  chapterName?: string;
  description?: string;
  photo: File | undefined;
  fullPath?: string;
  dateOfPhoto?: Date;
  type?: 'photo';
}
