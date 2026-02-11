import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {
  baseUrl = "http://sun.smartpoint.in/api/v2"
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
    return throwError(
      'Something bad happened; please try again later.');
  };

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  checkPartFromPartList(partList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      if(partList.length > 0 && !partList.find(a => a.PartNo == control.value)) {
        control.value == "";
        return { partNotExist: true };
      } else {
        return null;
      }
    };
  }

  // checkPartFromPartList(partNo: string, partList: any[]) {
  //   return (formGroup: FormGroup) => {
  //     const partNoControl = formGroup.controls[partNo];

  //     if (!partNoControl.errors) {
  //       return null;
  //     }

  //     if(!partList.find(a => a.PartNo == partNoControl.value)) {
  //       partNoControl.value == "";
  //       partNoControl.setErrors({ partNotExist: true });
  //     } else {
  //       partNoControl.setErrors(null);
  //     }
  //   }
  // }


  // URL: http://sun.smartpoint.in/api/v2/banner/create_banner
  addBanner(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem("Access-Token")}`
      })
    };
    var url = this.baseUrl + `/banner/create_banner`
    return this.http.post<any>(url, data, httpOptions).pipe(map(datas => {
      return datas;
    }), catchError(this.handleError));
  }
}
