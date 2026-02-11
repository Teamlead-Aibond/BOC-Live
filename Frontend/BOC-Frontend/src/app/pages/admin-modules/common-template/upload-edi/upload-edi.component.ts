import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { notes_type, attachment_thumb_images, Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-edi',
  templateUrl: './upload-edi.component.html',
  styleUrls: ['./upload-edi.component.scss']
})
export class UploadEDIComponent implements OnInit {
    submitted = false;
    model: any = {};
    fileData; 
    api_check: any;
  spinner: boolean;

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
    public event: EventEmitter<any> = new EventEmitter();
    constructor(public modalRef: BsModalRef,
      private fb: FormBuilder,private http: HttpClient,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      // private spinner: NgxSpinnerService,
      @Inject(BsModalRef) public data: any, ) { }
  
    ngOnInit(): void {
     
    }
  
    //Attachment process
    fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
    }
  
 
  
  onSubmit(f: NgForm) {
    this.submitted = true;
    this.spinner = true;
    if (f.valid) {
      console.log(this.fileData)
      const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('InvoiceId', this.data.InvoiceId);
      formData.append('InvoiceNo', this.data.InvoiceNo);
      this.commonService.postHttpImageService(formData, "uploadEDIINVCSV").subscribe(response => {
        this.spinner = false;
        if (response.responseData.success == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'EDI Uploaded Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }else if(response.responseData.success == false){
          Swal.fire({
            title: 'Error!',
            text: response.responseData.errors && response.responseData.errors[0] ? response.responseData.errors[0] : 'EDI could not be Uploaded!' ,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }else {
          Swal.fire({
            title: 'Error!',
            text: 'EDI could not be Uploaded!' ,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
      });

    }else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }
  }
  
    triggerEvent(item: string) {
      this.event.emit({ data: item, res: 200 });
    }
  
  

}
