import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../reducers';
import { Store } from '@ngrx/store';
import { getAuthState } from '../reducers';
import { defaultIfEmpty, map } from 'rxjs/operators';
import * as RouterActions from '../actions/router.action';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private store$: Store<fromRoot.State>) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store$.select(getAuthState).pipe(map(auth => {
      const result = auth.token !== null && auth.token !== undefined;
      if (!result) {
        this.store$.dispatch(new RouterActions.Go({path: [`/login`]}));
      }
      return result;
    }), defaultIfEmpty(false));
  }

}
