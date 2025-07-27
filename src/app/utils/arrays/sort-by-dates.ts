import {Photo} from "../../models/photo";
import {Video} from "../../models/video";

export function sortByNewestDates(media: (Photo | Video)[]): (Photo | Video)[] {

  const sorted = media.sort((a: Photo | Video, b: Photo | Video) => {
    const dateA = a.date ? new Date(a.date) : null;
    const dateB = b.date ? new Date(b.date) : null;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateB - dateA;
  });

  return sorted;
}
