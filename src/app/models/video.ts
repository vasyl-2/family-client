export interface Video {
  id?: string;
  id_?: string;
  name: string;
  chapter?: string;
  chapterName?: string;
  description?: string;
  video: File | undefined;
  fullPath?: string;
}
