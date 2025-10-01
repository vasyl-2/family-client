import {PhotoMedia} from "../../models/photo";

export function sortByNewestDates(media: (PhotoMedia)[]): (PhotoMedia)[] {

  const sorted = media.sort((a: PhotoMedia, b: PhotoMedia) => {
    const dateA = a.date ? new Date(a.date) : null;
    const dateB = b.date ? new Date(b.date) : null;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    const resp = dateB - dateA;
    return resp;
  });

  return sorted;
}
