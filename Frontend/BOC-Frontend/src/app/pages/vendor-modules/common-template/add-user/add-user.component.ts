import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { ConfirmedValidator } from 'src/app/core/services/confirmed.validator';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  IdentityType;
  IdentityId;
  countryList;
  UserForm: FormGroup;
  submitted = false;
  StateList;
  fileData;
  uploadedpath
  ProfilePhoto;
  DepartmentList;
  Status;
  CountryId;
  StateId;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {

    this.UserForm = this.fb.group({
      Title: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Address1: [''],
      Address2: [''],
      CountryId: [''],
      StateId: [''],
      City: [''],
      Zip: [''],
      ProfilePhoto: [''],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNo: ['', Validators.required],
      DepartmentId: [''],
      Status: [true],
      Fax: [''],
      Password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      ConfirmPassword: ['', [Validators.required]],
      Username: ['', [Validators.required]],

    },
      {
        validator: ConfirmedValidator('Password', 'ConfirmPassword')
      }
    )
    this.getCountryList();
    this.getDepartmentList();

  }


  getCountryList() {
    this.commonService.getconutryList().subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData;
        

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
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


  getState(event, CountryId) {
    var postData = {
      CountryId: CountryId
    }

    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
      if (response.status == true) {
        this.StateList = response.responseData
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

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
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
          Title: this.UserForm.value.Title,
          FirstName: this.UserForm.value.FirstName,
          LastName: this.UserForm.value.LastName,
          Address1: this.UserForm.value.Address1,
          Address2: this.UserForm.value.Address2,
          CountryId: this.UserForm.value.CountryId,
          StateId: this.UserForm.value.StateId,
          City: this.UserForm.value.City,
          Zip: this.UserForm.value.Zip,
          PhoneNo: this.UserForm.value.PhoneNo,
          Email: this.UserForm.value.Email,
          Fax: this.UserForm.value.Fax,
          Password: this.UserForm.value.Password,
          ConfirmPassword: this.UserForm.value.ConfirmPassword,
          DepartmentId: this.UserForm.value.DepartmentId,
          Status: this.Status,
          Username: this.UserForm.value.Username,
          ProfilePhoto: this.uploadedpath
        }]
      }
      this.commonService.postHttpService(postData, "CreateUserVendor").subscribe(response => {
        if (response.status == true) {
          this.modalRef.hide();

          this.triggerEvent(response.responseData.UserList[0]);
          Swal.fire({
            title: 'Success!',
            text: 'User saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'User could not be saved!',
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
}
