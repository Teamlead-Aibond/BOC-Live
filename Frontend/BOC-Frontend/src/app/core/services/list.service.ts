import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  baseUrl = `${environment.api.apiURL}`;
  URI = {
    'GetHotelList'       : '/hotel_Api/hotel_list',
    'GetRestaurantList'  : '/restaurant/restaurant_list',
    'GetServiceTypeList' : '/RoomServices/ddlservicetype_list',
    'GetItemTypeList'    : '/RoomServices/ddlitemtype_list',
    'GetSpicyLevelList'  : '/RoomServices/ddlspicylevel_list',
    'GetCategoriesList'  : '/spapackage/ddlSpaPackageCategory_list'
  } 
  constructor(private http: HttpClient) { }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError (
      'Something bad happened; please try again later.');
  };
  
  httpService (data, method) {
    var url = this.baseUrl + this.URI[method];
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':  `Bearer ${localStorage.getItem("Access-Token")}`
      })
    };
    return this.http.post<any>(url, data,httpOptions).pipe(map(data => { 
      return data;
    }), catchError(this.handleError));
  }
}