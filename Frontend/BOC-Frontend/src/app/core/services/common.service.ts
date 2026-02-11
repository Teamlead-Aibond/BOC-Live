import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URI } from './restURI';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { error } from 'protractor';
import { Tracking } from 'src/app/pages/admin-modules/common-template/ups-integration/ups-integration.metadata';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  baseUrl = `${environment.api.apiURL}`;
  private cartCount = new BehaviorSubject<string>('0');
  getCount = this.cartCount.asObservable();
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

  postHttpService(data, method, customHeaders = {}) {
    //console.log('request data', data); 
    var url = this.baseUrl + URI[method];
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...customHeaders
      })
    };
    return this.http.post<any>(url, data, httpOptions).pipe(map(data => {
      //console.log(method, data); 
      return data;
    }), catchError(this.handleError),


    );
  }

  postHttpServiceWithIndex(data, idx, method, customHeaders = {}) {
    //console.log('request data', data); 
    var url = this.baseUrl + URI[method];
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...customHeaders
      })
    };
    return this.http.post<any>(url, data, httpOptions).pipe(map(data => {
      if (data)
        data.idx = idx
      //console.log(method, data); 
      return data;
    }), catchError(this.handleError),


    );
  }

  postHttpUPSService(data, method) {
    //console.log('request data', data); 
    var url = this.baseUrl + URI[method];
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<Tracking>(url, data, httpOptions).pipe(map(data => {
      //console.log(method, data); 
      return data;
    }), catchError(this.handleError),


    );
  }


  postHttpImageService(data, method) {
    //console.log('request data', data); 
    var url = this.baseUrl + URI[method];
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this.http.post<any>(url, data, httpOptions).pipe(map(data => {
      //console.log('data', data); 
      return data;
    }), catchError(this.handleError));
  }

  getHttpServiceStateId(data, method) {
    var url = this.baseUrl + URI[method] + data.CountryId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;',
      })
    };
    return this.http.get<any>(url, httpOptions).pipe(map(data => {
      return data;
    }), catchError(this.handleError));
  }

  putHttpService(data, method) {
    var url = this.baseUrl + URI[method];
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<any>(url, data, httpOptions).pipe(map(data => {
      // console.log(data); 
      return data;
    }), catchError(this.handleError));
  }

  getHttpService(method) {
    var url = this.baseUrl + URI[method];
    // console.log(url);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(url, httpOptions).pipe(map(data => {
      return data;
    }), catchError(this.handleError));
  }



  httpServices(data, method) {
    var url = this.baseUrl + URI[method] + data.CustomerId
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<any>(url, httpOptions).pipe(map(data => {
      return data;
    }), catchError(this.handleError));
  }

  // getFollowupView(data, method) {
  //   var url = this.baseUrl + URI[method] + data.FollowupId
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     })
  //   };
  //   return this.http.get<any>(url, httpOptions).pipe(map(data => {
  //     return data;
  //   }), catchError(this.handleError));
  // }

  getUserRoleList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    var url = this.baseUrl + `/api/v1.0/Role/GetAllRoles`
    return this.http.get<any>(url, httpOptions).pipe(map(datas => {
      return datas;
    }), catchError(this.handleError));
  }

  getconutryList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    var url = this.baseUrl + `/api/v1.0/country/list`
    return this.http.get<any>(url, httpOptions).pipe(map(datas => {
      return datas;
    }), catchError(this.handleError));
  }

  getstateList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    var url = this.baseUrl + `/api/v1.0/state/list`
    return this.http.get<any>(url, httpOptions).pipe(map(datas => {
      return datas;
    }), catchError(this.handleError));
  }

  gettermsList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    var url = this.baseUrl + `/api/v1.0/term/list`
    return this.http.get<any>(url, httpOptions).pipe(map(datas => {
      return datas;
    }), catchError(this.handleError));
  }

  addCustomer(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    var url = this.baseUrl + `/api/v1.0/customers/create`
    return this.http.post<any>(url, data, httpOptions).pipe(map(datas => {
      return datas;
    }), catchError(this.handleError));
  }

  // to check the permisison of each module
  // test
  permissionCheck(PermissionCode, PermissionIndex) {
    var accessRights = JSON.parse(localStorage.getItem("accessRights"));
    if (accessRights[PermissionCode] && accessRights[PermissionCode] != '' && accessRights[PermissionCode] != null) {
      var PermissionArray = accessRights[PermissionCode].split(",");
      if (PermissionArray[PermissionIndex] && PermissionArray[PermissionIndex] == 1) {
        return true;
      }
    }
    return false;
  }

  base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  async getLogoAsBas64(): Promise<string> {
    let url = window.location.protocol + "\\\\" + window.location.host + "/assets/images/ah_logo.png";
    return this.getBase64ImageFromUrl(url);
  }

  async getBase64ImageFromUrl(imageUrl: string): Promise<string> {

    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result.toString());
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }


  postEDIHttpService(data) {
    //console.log('request data', data); 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "x-api-key": "vGXuMUoRlJUeDN.bUWduge4GhQbgPkm6pfyGxwgEWT0vEkHKBUWa",
        "Authorization": "Basic c3RvY2tvOjNqOGNuYUdGdGpDSm9HMHpMZ0V2",
        "cache-control": "no-cache"
      })
    };
    var url = `https://staging.junoedge.com/api/invoice`
    return this.http.post<any>(url, data, httpOptions).pipe(map(data => {
      //console.log(method, data); 
      return data;
    }), catchError(this.handleError),
    );
  }

  getCartCount(){
    var IdentityType = localStorage.getItem("IdentityType");
    var CustomerId: any = 0;
    if(IdentityType == '1'){
      CustomerId = localStorage.getItem("IdentityId")
    }else{
      CustomerId = localStorage.getItem("adminOnlineStoreCustomerId")
    }

    var postData = {
      CustomerId: CustomerId
    }
    
    this.postHttpService(postData, 'getCartCount').subscribe(response => {
      if(response.status == true){
        // this.cartCount = response.responseData.count;
        this.cartCount.next(response.responseData.count); 
      }
    });
  }

  postMEMSHttpService(data, method) {
    //console.log('request data', data); 
    var url = URI[method];
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'multipart/form-data'
    //   })
    // };
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    console.log(httpOptions);
    return this.http.post<any>(url, data, httpOptions).pipe(map(data => {
      //console.log(method, data); 
      return data;
    }), catchError(this.handleError),


    );
  }
}
