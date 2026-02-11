import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
//import { URI } from './restURI';
import { Tracking } from './ups-integration.metadata';

@Injectable()
export class UpsIntegrationService {
    baseUrl = `${environment.api.apiURL}`;
    //Testing
    //private endPointUrl = `https://wwwcie.ups.com/track/v1/details/`;
    //Production
    //private endPointUrl = `https://onlinetools.ups.com/track/v1/details/`;

    constructor(
        private http: HttpClient
    ) { }

    trackConsignment(transactionId: string, transactionSource: string, trackingNumber: string): Observable<Tracking> {
        //const url = 'http://localhost:3000/ups/track'
        var url = this.baseUrl + '/api/v1.0/ups/track';

        var req = {
            transId: transactionId,
            transactionSrc: transactionSource,
            inquiryNumber: trackingNumber
        }

        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };

        return this.http.post<Tracking>(url, req, httpOptions)
            .pipe(
                //catchError((err) => of([err]))
            );
    }

    trackConsignmentXml(transId: string, transactionSource: string, inquiryNumber: string): Observable<Tracking> {
        //const url = `${this.endPointUrl}${inquiryNumber}?locale=en_US`;
        //const url = 'https://wwwcie.ups.com/track/v1/details/1Z5338FF0107231059';
        //const url = 'https://onlinetools.ups.com/track/v1/details/1Z5338FF0107231059';
        //const url = 'http://localhost:3000/ups/track'
        var url = this.baseUrl + '/api/v1.0/ups/track';

        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };

        return this.http.get<Tracking>(url) //, httpOptions
            .pipe(
                //catchError((err) => of([err]))
            );
    }
}