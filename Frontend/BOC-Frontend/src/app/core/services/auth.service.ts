import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { CookieService } from '../services/cookie.service';
import { User } from '../models/auth.models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    [x: string]: any;
    user: User;
    userSub = new BehaviorSubject<User>(null);
    clearTimeout: any;
    constructor(private http: HttpClient, private cookieService: CookieService,
      private router: Router,) {
    }

    /**
     * Returns the current user
     */
    // public currentUser(): User {
    //     if (!this.user) {
    //         this.user = JSON.parse(this.cookieService.getCookie('currentUser'));
    //     }
    //     return this.user;
    // }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    // login(email: string, password: string) {
    //     return this.http.post<any>(`/api/login`, { email, password })
    //         .pipe(map(user => {
    //             // login successful if there's a jwt token in the response
    //             if (user && user.token) {
    //                 this.user = user;
    //                 // store user details and jwt in cookie
    //                 this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
    //             }
    //             return user;
    //         }));
    // }

    // /**
    //  * Logout the user
    //  */
    // logout() {
    //     // remove user from local storage to log user out
    //     this.cookieService.deleteCookie('currentUser');
    //     this.user = null;
    // }
    /**
     * Returns the current user
     */
    // public currentUser(): User {
    //     if (!this.user) {
    //         this.user = JSON.parse(this.cookieService.getCookie('currentUser'));
    //     }
    //     return this.user;
    // }

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    // login(email: string, password: string) {
    //     return this.http.post<any>(`/api/login`, { email, password })
    //         .pipe(map(user => {
    //             // login successful if there's a jwt token in the response
    //             if (user && user.token) {
    //                 this.user = user;
    //                 // store user details and jwt in cookie
    //                 this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
    //             }
    //             return user;
    //         }));
    // }

    /**
     * Logout the user
     */
    // logout() {
    //     // remove user from local storage to log user out
    //     this.cookieService.deleteCookie('currentUser');
    //     this.user = null;
    // }


    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        localStorage.removeItem('Access-Token');
        localStorage.removeItem('workchainAlert');
        localStorage.clear();
      }
    
      // new 
      isAuthenticated() {
        // get the auth token from localStorage
        let token = localStorage.getItem('Access-Token');
        let DefaultLocation = localStorage.getItem('DefaultLocation');
      

        console.log(token)
        // check if token and DefaultLocation is set, then...
        if (token && DefaultLocation) {
          
          return true;
        }
        else{
          this.router.navigate(["/account/login"]);
          //this.router.navigate(["/account/junologin"]);
          return false;
        }
      }

  
    
      autoLogout(expirationDate: number) {
        console.log(expirationDate);
        this.clearTimeout = setTimeout(() => {
          this.logout();
        }, 4000);
      }
    
      
      
}


