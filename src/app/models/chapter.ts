export interface Chapter {
  _id?: string;
  id?: string;
  readable_id?: string;
  readableName?: string;
  title: string;
  parent?: string;
  children?: Chapter[];
}
