import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { SessionService } from 'src/app/_helpers/session.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('token');
    const isSecure = localStorage.getItem('is-secure'); 
    const triggered = localStorage.getItem('manualLogoutTriggered');
    if (isSecure == '1' && !triggered) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    localStorage.removeItem('token');
    localStorage.removeItem('is-secure'); 
    localStorage.removeItem('manualLogoutTriggered');
    this.router.navigate(['/auth/login']);
    return false;
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   const token = localStorage.getItem('token');
  //   const triggered = localStorage.getItem('manualLogoutTriggered');

  //   if (token && !triggered) {
  //     return true;
  //   }

  //   // if (triggered) {
  //   //   this.sessionService.logoutUser();      
  //   // }
  //   return false;
  // }
}