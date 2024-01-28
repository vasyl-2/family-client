import {Params} from "@angular/router";

export interface RoutePart {
  params: Params;
  path: string | null | undefined;
}

export interface RouterStateUrl {
  url: string;
  params?: Params;
  queryParams: Params;
  parsedRoute?: RoutePart[];
}

