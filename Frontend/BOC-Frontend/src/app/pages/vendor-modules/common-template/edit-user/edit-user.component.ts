import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  IdentityType;
  IdentityId;
  countryList;
  UserForm: FormGroup;
  submitted = false;
  StateList;
  uploadedpath;
  DepartmentList;
  public event: EventEmitter<any> = new EventEmitter();
  result;
  index;
  CountryId;
  StateId;
  Status;
  fileData;
  ProfilePhoto;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.result = this.data.users;
    this.index = this.data.i
   
    this.UserForm = this.fb.group({
      UserId: ['', Validators.required],
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
      Username: ['', [Validators.required]],

    })
    this.getCountryList();
    this.getDepartmentList();

    this.CountryId = this.result.CountryId;
    this.getStateList(this.CountryId);
    this.StateId = this.result.StateId;
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
      StateId: this.result.StateId,
      FirstName: this.result.FirstName,
      LastName: this.result.LastName,
      Address1: this.result.Address1,
      Address2: this.result.Address2,
      CountryId: this.CountryId,
      City: this.result.City,
      ProfilePhoto: this.result.ProfilePhoto,
      Zip: this.result.Zip,
      Email: this.result.Email,
      PhoneNo: this.result.PhoneNo,
      DepartmentId: this.result.DepartmentId,
      Status: this.Status,
      Fax: this.result.Fax,
      Username: this.result.Username,

    })
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


  getStateList(CountryId) {
    var postData = {
      CountryId: this.CountryId
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

  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.UserForm.controls['ProfilePhoto'].setValue(file ? file.name : ''); // <-- Set Value for Validation
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
          UserId: this.UserForm.value.UserId,
          Title: this.UserForm.value.Title,
          FirstName: this.UserForm.value.FirstName,
          LastName: this.UserForm.value.LastName,
          Address1: this.UserForm.value.Address1,
          Address2: this.UserForm.value.Address2,
          CountryId: this.CountryId,
          StateId: this.StateId,
          City: this.UserForm.value.City,
          Zip: this.UserForm.value.Zip,
          PhoneNo: this.UserForm.value.PhoneNo,
          Email: this.UserForm.value.Email,
          Fax: this.UserForm.value.Fax,
          DepartmentId: this.UserForm.value.DepartmentId,
          Status: this.Status,
          Username: this.UserForm.value.Username,
          ProfilePhoto: this.uploadedpath || this.ProfilePhoto
        }]
      }

      this.commonService.putHttpService(postData, "UpdateUserVendor").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData.UserList[0]);
          this.modalRef.hide();
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
}
