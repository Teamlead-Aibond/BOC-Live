import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { User } from '../models/auth.models';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  customerRights: any = [];
  vendorRights: any = [];
  RRRights: any = [];

  constructor(private http: HttpClient) { }
  baseUrl = `${environment.api.apiURL}`;
  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // };

  // getAll() {
  //     return this.http.get<User[]>(`/api/login`);
  // }


  postSignin(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    };

    var url = this.baseUrl + `/users/login`
    return this.http.post<any>(url, data).pipe(map(data => {
      if (data.status === true) {
        localStorage.setItem("Access-Token", data.responseData.login.accessToken);
        localStorage.setItem("UserId", data.responseData.login.UserId);
        localStorage.setItem("UserName", data.responseData.login.FirstName + " " + data.responseData.login.LastName);
        localStorage.setItem("IdentityType", data.responseData.login.IdentityType)
        localStorage.setItem("IdentityId", data.responseData.login.IdentityId)
        localStorage.setItem("ProfilePhoto", data.responseData.login.ProfilePhoto)
        localStorage.setItem("IsPrimay", data.responseData.login.IsPrimay)
        localStorage.setItem('workchainAlert', '0'); 

        if (data.responseData.login.IdentityType == "1") {
          localStorage.setItem("CustomerLogo", data.responseData.login.CustomerLogo)
        }
        if (data.responseData.login.IdentityType == "2") {
          localStorage.setItem("VendorLogo", data.responseData.login.VendorLogo)
        }

        // Access Rights
        if (data.responseData.permission.length > 0) {
          let rights: any = {};
          // Store all the rights in a single item
          // localStorage.setItem("accessRights", JSON.stringify(data.responseData.permission));     

          for (let val of data.responseData.permission) {
            rights[val.PermissionCode] = val.Permission;
          }
          // console.log("accessRights", rights);  
          localStorage.setItem("accessRights", JSON.stringify(rights));
        }

      }
      return data;
    }));
  }


  commonSignin(url: string, data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    };

    // var url = this.baseUrl + `/users/login`
    return this.http.post<any>(url, data).pipe(map(data => {
      if (data.status === true) {
        localStorage.setItem("Access-Token", data.responseData.login.accessToken);
        localStorage.setItem("UserId", data.responseData.login.UserId);
        localStorage.setItem("UserName", data.responseData.login.FirstName + " " + data.responseData.login.LastName);
        localStorage.setItem("IdentityType", data.responseData.login.IdentityType)
        localStorage.setItem("IdentityId", data.responseData.login.IdentityId)
        localStorage.setItem("ProfilePhoto", data.responseData.login.ProfilePhoto)
        localStorage.setItem("IsPrimay", data.responseData.login.IsPrimay)
        localStorage.setItem("IsDisplayBaseCurrencyValue", data.responseData.login.IsDisplayBaseCurrencyValue)
        localStorage.setItem("Location", data.responseData.login.Location)
        localStorage.setItem("BaseCurrencyCode", data.responseData.login.DefaultCurrency)
        localStorage.setItem("BaseCurrencySymbol", data.responseData.login.CurrencySymbol)
        localStorage.setItem("IsSuperAdmin", data.responseData.login.IsSuperAdmin)

        localStorage.setItem("LocationName", data.responseData.login.LocationCountryName)
        localStorage.setItem("DefaultCountryName", data.responseData.login.DefaultCountryName)
        localStorage.setItem("DefaultCountryCode", data.responseData.login.DefaultCountryCode)
        localStorage.setItem("DefaultCurrencySymbol", data.responseData.login.DefaultCurrencySymbol)
        localStorage.setItem("DefaultCurrencyCode", data.responseData.login.DefaultCurrencyCode)
        localStorage.setItem("DefaultLocation", data.responseData.login.DefaultLocation)
        localStorage.setItem("AllowLocationsDropdown", JSON.stringify(data.responseData.login.AllowLocationsDropdown))
        localStorage.setItem("UserEmailId", data.responseData.login.Email)
        localStorage.setItem("IsUserUPSEnable", data.responseData.login.IsUserUPSEnable)
        localStorage.setItem("IsRestrictExportReports", data.responseData.login.IsRestrictExportReports)
        localStorage.setItem('workchainAlert', '0'); 

        if (data.responseData.login.IdentityType == "1") {
          localStorage.setItem("CustomerLogo", data.responseData.login.CustomerLogo)
        }
        if (data.responseData.login.IdentityType == "2") {
          localStorage.setItem("VendorLogo", data.responseData.login.VendorLogo)
        }

        // Access Rights
        if (data.responseData.permission.length > 0) {
          let rights: any = {};
          // Store all the rights in a single item
          // localStorage.setItem("accessRights", JSON.stringify(data.responseData.permission));     

          for (let val of data.responseData.permission) {
            rights[val.PermissionCode] = val.Permission;
          }
          // console.log("accessRights", rights);  
          localStorage.setItem("accessRights", JSON.stringify(rights));
        }

      }
      return data;
    }));
  }


  commonautologin(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Token':data

      })
    };

     var url = this.baseUrl + `/users/GetUserInfoFromToken`
    return this.http.get<any>(url).pipe(map(data => {
      if (data.status === true) {
        localStorage.setItem("Access-Token", data.responseData.login.accessToken);
        localStorage.setItem("UserId", data.responseData.login.UserId);
        localStorage.setItem("UserName", data.responseData.login.FirstName + " " + data.responseData.login.LastName);
        localStorage.setItem("IdentityType", data.responseData.login.IdentityType)
        localStorage.setItem("IdentityId", data.responseData.login.IdentityId)
        localStorage.setItem("ProfilePhoto", data.responseData.login.ProfilePhoto)
        localStorage.setItem("IsPrimay", data.responseData.login.IsPrimay)
        localStorage.setItem("IsDisplayBaseCurrencyValue", data.responseData.login.IsDisplayBaseCurrencyValue)
        localStorage.setItem("Location", data.responseData.login.Location)
        localStorage.setItem("BaseCurrencyCode", data.responseData.login.DefaultCurrency)
        localStorage.setItem("BaseCurrencySymbol", data.responseData.login.CurrencySymbol)
        localStorage.setItem("IsSuperAdmin", data.responseData.login.IsSuperAdmin)

        localStorage.setItem("LocationName", data.responseData.login.LocationCountryName)
        localStorage.setItem("DefaultCountryName", data.responseData.login.DefaultCountryName)
        localStorage.setItem("DefaultCountryCode", data.responseData.login.DefaultCountryCode)
        localStorage.setItem("DefaultCurrencySymbol", data.responseData.login.DefaultCurrencySymbol)
        localStorage.setItem("DefaultCurrencyCode", data.responseData.login.DefaultCurrencyCode)
        localStorage.setItem("DefaultLocation", data.responseData.login.DefaultLocation)
        localStorage.setItem("AllowLocationsDropdown", JSON.stringify(data.responseData.login.AllowLocationsDropdown))
        localStorage.setItem("UserEmailId", data.responseData.login.Email)
        localStorage.setItem("IsUserUPSEnable", data.responseData.login.IsUserUPSEnable)
        localStorage.setItem("IsRestrictExportReports", data.responseData.login.IsRestrictExportReports)
        localStorage.setItem('workchainAlert', '0'); 

        if (data.responseData.login.IdentityType == "1") {
          localStorage.setItem("CustomerLogo", data.responseData.login.CustomerLogo)
        }
        if (data.responseData.login.IdentityType == "2") {
          localStorage.setItem("VendorLogo", data.responseData.login.VendorLogo)
        }

        // Access Rights
        if (data.responseData.permission.length > 0) {
          let rights: any = {};
          // Store all the rights in a single item
          // localStorage.setItem("accessRights", JSON.stringify(data.responseData.permission));     

          for (let val of data.responseData.permission) {
            rights[val.PermissionCode] = val.Permission;
          }
          // console.log("accessRights", rights);  
          localStorage.setItem("accessRights", JSON.stringify(rights));
        }

      }
      return data;
    }));
  }

}