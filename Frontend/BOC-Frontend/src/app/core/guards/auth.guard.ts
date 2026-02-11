import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const currentUser = this.authenticationService.currentUser();
        // if (currentUser) {
        //     // logged in so return true
        //     return true;
        // }


        if(this.authenticationService.isAuthenticated()){
            // If they do, return true and allow the user to load app
            return true;
         }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        //this.router.navigate(['/account/junologin'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}