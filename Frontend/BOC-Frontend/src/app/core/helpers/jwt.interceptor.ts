import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,private router: Router) { }
	headers = new Headers({
        'Content-Type': 'application/json',
        'Token': localStorage.getItem("Access-Token")
    });
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // const currentUser = this.authenticationService.currentUser();
        // if (currentUser && currentUser.token) {
        //     request = request.clone({
        //         setHeaders: {
        //             Authorization: `Bearer ${currentUser.token}`
        //         }
        //     });
		// }
		

		if (localStorage.getItem("Access-Token") && !request.headers.get("skip")) {
			    request = request.clone({
			         setHeaders: {
			             Authorization: `Bearer ${localStorage.getItem("Access-Token")}`
			         }
			     });
		 }

        return next.handle(request).pipe(
			tap(
				event => {
					 if (event instanceof HttpResponse) {
						// console.log('all looks good');
						// http response status code
						// console.log(event.status,"event");

					
					}
				},
				error => {
					
					// http response status code
					// console.log('----response----');
					// console.error('status code:');
					// tslint:disable-next-line:no-debugger
					console.log(error,"error");
					// console.log('--- end of response---');
					//this.router.navigate(["/account/login"]);
					
                    
				}
			)
        );
    
    }
}
