import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URI } from './restURI';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoapserviceService {
  baseUrl = `${environment.api.apiURL}`;
  constructor(private http: HttpClient, private router: Router,) { }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else
    // (error.status==403)
    {

      //this.router.navigate(["/account/login"]);
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `error ${error}, ` +
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // if(error.status==403){
    //   // alert(error.status)
    //   // this.router.navigate(["/account/login"]);
    // }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.'
    );
  };

  postHttpService(data, url, method, customHeaders = {}) {
    // console.log('request data', data); 
    // var url = "https://wwwcie.ups.com/webservices/Ship";
    // var url = url + URI[method];
    // console.log(url);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Headers': 'content-type',
        ...customHeaders
      }),
      responseType: 'text'
    };
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/xml',
    //     ...customHeaders
    //   })
    // };
    return this.http.post(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Headers': 'content-type',
        ...customHeaders
      }),
      responseType: 'text'
    }).pipe(map(data => {
      // console.log(data); 
      return data;
    }), catchError(this.handleError),
    );
  }

  // postHttpServiceXML(data, url,  method, customHeaders = {}) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/xml',
  //       'Access-Control-Allow-Headers': 'content-type',
  //       ...customHeaders
  //     }),
  //     responseType: 'text'
  //   };
  //   return this.http.post(url, data, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/xml',
  //       'Access-Control-Allow-Headers': 'content-type',
  //       ...customHeaders
  //     }),
  //     responseType: 'text'
  //   }).pipe(map(data => {
  //     // console.log(data); 
  //     return data;
  //   }), catchError(this.handleError),
  //   );
  // }

  postHttpServiceJson(data, url, method, customHeaders = {}) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'content-type',
        ...customHeaders
      }),
      responseType: 'json'
    };
    return this.http.post(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'content-type',
        ...customHeaders
      }),
      responseType: 'json'
    }).pipe(map(data => {
      return data;
    }), catchError(this.handleError),
    );
  }
  
}
