/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import { Observable } from 'rxjs';
import { attachment_thumb_images, Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [
    NgxSpinnerService, DatePipe ,BsModalRef
  ],
})
export class UserProfileComponent implements OnInit {
  submitted = false;
  UserForm: FormGroup;
  result;
  ProfilePhoto;
  Status;
  uploadedpath;
  fileData;
  DepartmentList;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private insidemodalService: NgbModal,
    private commonService: CommonService,
    private cd_ref: ChangeDetectorRef,
    private customValidator: CustomvalidationService) { }
  ngOnInit(): void {





    this.UserForm = this.fb.group({
      UserId: ['', Validators.required],
      IdentityType:"2",
      Title: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      ProfilePhoto: [''],
      Email: ['', [Validators.required, Validators.email]],
      Status: [true],
      DepartmentId: [''],
      Username:['', Validators.required],


    })



    this.getViewContent();
    this.getDepartmentList();

  }


  getDepartmentList() {
    this.commonService.getHttpService("getDepartmentList").subscribe(response => {
      if (response.status == true) {
        this.DepartmentList = response.responseData;
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  //get UserForm validation control
  get UserFormControl() {
    return this.UserForm.controls;
  }

  getViewContent() {

    this.commonService.getHttpService("ViewUserProfile").subscribe(response => {
      this.result = response.responseData;

      if (this.result.ProfilePhoto === "" || this.result.ProfilePhoto === null) {
        this.ProfilePhoto = "";
      } else {

        this.ProfilePhoto = this.result.ProfilePhoto;
      }
      if (this.result.Status == "1") {
        this.Status = true
      } else {
        this.Status = false
      }
      this.UserForm.setValue({
        UserId: this.result.UserId,
        Title: this.result.Title,
        IdentityType:"2",
        FirstName: this.result.FirstName,
        LastName: this.result.LastName,
        ProfilePhoto: this.result.ProfilePhoto,
        Email: this.result.Email,
        Status: this.Status,
        DepartmentId: this.result.DepartmentId,
        Username: this.result.Username,
       })

      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.UserForm.controls['ProfilePhoto'].setValue(file ? file.name : ''); // <-- Set Value for Validation
  }


  onSubmit() {
    this.submitted = true;
    if (this.UserForm.valid) {

      if (this.UserForm.value.Status == true) {
        this.Status = 1
      }
      else {
        this.Status = 0
      }
      var postData = {
        UserList: [{
          UserId: this.UserForm.value.UserId,
          Title: this.UserForm.value.Title,
          IdentityType:"2",
          FirstName: this.UserForm.value.FirstName,
          LastName: this.UserForm.value.LastName,
          Email: this.UserForm.value.Email,
          Status: this.Status,
          ProfilePhoto: this.uploadedpath || this.ProfilePhoto,
          DepartmentId: this.UserForm.value.DepartmentId,
          Username: this.UserForm.value.Username,
        }]
      }

      this.commonService.putHttpService(postData, "UpdateUserProfile").subscribe(response => {
        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'User Updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'User could not be updated!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else{
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });
    }
  }


  // image process
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.preview();
    this.commonService.postHttpImageService(formData, "getUserimageupload").subscribe(response => {
      this.uploadedpath = response.responseData.location;
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.UserForm.value.ProfilePhoto = reader.result;
      this.ProfilePhoto = reader.result;

    }
  }
}
