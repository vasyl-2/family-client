import {Photo} from "./photo";

export interface Video {
  id?: string;
  _id?: string;
  name: string;
  chapter?: string;
  chapterName?: string;
  description?: string;
  video: File | undefined;
  fullPath?: string;
  date?: Date;
  // type?: 'video';
}

export type VideoMedia = Photo & { type: 'video' };

