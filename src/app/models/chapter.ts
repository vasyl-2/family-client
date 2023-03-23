export interface Chapter {
  id?: string;
  title: string;
  parent?: string;
  children?: Chapter[];
}
