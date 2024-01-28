import {RouterStateUrl} from "../models/router-utils";
import { RouterStateSerializer } from '@ngrx/router-store';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

export class RouterCustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  // serialize(routerState: RouterStateSnapshot): RouterStateUrl {
  //   let route = routerState.root;
  //
  //   while (route.firstChild) {
  //     route = route.firstChild;
  //   }
  //
  //   const {
  //     url,
  //     root: { queryParams },
  //   } = routerState;
  //   const { params } = route;
  //
  //   return { url, params, queryParams };
  // }

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const parsedRoute = route.pathFromRoot.filter((data: ActivatedRouteSnapshot) => !!data.routeConfig ? data.routeConfig.path : null )
      .map((data) => {
        return { params: data.params, path: data.routeConfig ? data.routeConfig.path : null};
      });

    const { url, root: { queryParams } } = routerState;

    return { url, queryParams, parsedRoute };
  }
}
