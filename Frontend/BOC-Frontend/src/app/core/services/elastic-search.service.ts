import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { URI } from './restURI';

@Injectable({
  providedIn: 'root'
})
export class ElasticSearchService {
  // private http: HttpClient;
  constructor(

    private router: Router,
    handler: HttpBackend,
    private http: HttpClient
  ) {
    // this.http = new HttpClient(handler);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  search(body) {
    let url = `${environment.api.apiURL}${URI.GlobalSearch}`

    return this.http.post(url, body).pipe(map(data => {
      return data;
    }), catchError(this.handleError));
  }
}
