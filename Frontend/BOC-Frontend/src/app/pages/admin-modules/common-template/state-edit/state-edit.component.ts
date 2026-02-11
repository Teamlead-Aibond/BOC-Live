import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-state-edit',
  templateUrl: './state-edit.component.html',
  styleUrls: ['./state-edit.component.scss']
})
export class StateEditComponent implements OnInit {

  StateEditForm: FormGroup;
  submitted = false;
  IdentityType;
  IdentityId;
  countryList;
  StateList;
  stateList;
  DepartmentList;
  result;
  index;

  public event: EventEmitter<any> = new EventEmitter();
  CountryId;
  StateCode;
  StateName;
  StateId;
  Status;

  fileData;
  ProfilePhoto;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.result=this.data.result;
    this.index=this.data.index
    this.StateEditForm = this.fb.group({
      CountryId:['', Validators.required],
      StateCode: ['', Validators.required],
      StateName: ['', Validators.required],
      StateId: [''],
      Status: ['', Validators.required],
    })
    

   // this.StateId = this.result.StateId;
    this.CountryId = this.result.CountryId;
    this.getCountryList();
    this.StateId = this.result.StateId;
    setTimeout(() => {
      this.getStateList(this.CountryId);
    }, 500);
   
    //view content
    this.StateEditForm.setValue({
      CountryId: this.result.CountryId,
      StateCode: this.result.StateCode,
      StateName: this.result.StateName,
      StateId: this.result.StateId,
      Status: this.result.Status,
         
    })
  }

  getCountryList() {
    this.commonService.getconutryList().subscribe(response => {
      if (response.status == true) {
        this.countryList = response.responseData
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
    this.commonService.getHttpServiceStateId(postData, "getStateList").subscribe(response => {
      if (response.status == true) {
        this.StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getState(event, CountryId) {
    var postData = {
      CountryId: this.CountryId
    }

    this.commonService.getHttpServiceStateId(postData, "getStateList").subscribe(response => {
      if (response.status == true) {
        this.StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getStateName(event, StateId) {
    this.StateName = this.filterAndGetValue(this.StateList, "StateName", "StateId", StateId)
  }

  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(function (data) {
      return data[filterField] == filterValue;
    }, filterField, filterValue)
    return value[0][getField];
  }

  onFileChange($event) {
    let file = $event.target.files[0]; // <--- File Object for future use.
    this.StateEditForm.controls['ProfilePhoto'].setValue(file ? file.name : ''); // <-- Set Value for Validation
  }

  //get StateEditForm validation control
  get StateEditFormControl() {
    return this.StateEditForm.controls;
  }

  onSubmit() {

    this.submitted = true;
    if (this.StateEditForm.valid) {
      if (this.StateEditForm.value.Status == true) {
        this.Status = 1
      }
      else {
        this.Status = 0
      }

      // this.triggerEvent(AddressForm.value);
      // this.modalRef.hide();
      var postData = {
          "CountryId": this.StateEditForm.value.CountryId,
          "StateCode": this.StateEditForm.value.StateCode,
          "StateName": this.StateEditForm.value.StateName,
          "StateId": this.StateEditForm.value.StateId,
          Status: this.Status,
      }
      this.commonService.putHttpService(postData, "getStateUpdate").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'State edit updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'State edit could not be updated!',
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

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}
