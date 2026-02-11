import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-state-add',
  templateUrl: './state-add.component.html',
  styleUrls: ['./state-add.component.scss']
})
export class StateAddComponent implements OnInit {

  countryName;
  StateAddForm: FormGroup;
  submitted = false;
  StateList;
  fileData;
  uploadedpath
  ProfilePhoto;
  DepartmentList;
  CountryId;
  StateCode;
  Status;
  StateName;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.StateAddForm = this.fb.group({
      CountryId: ['', Validators.required],
      StateCode: ['', Validators.required],
      StateName: ['', Validators.required],
      Status: ['', Validators.required],
    })
    this.getCountryList();
  }

  // get DepartmentFormControl() {
  //   return this.DepartmentForm.controls;
  // }

  getCountryList() {
    this.commonService.getHttpService("getCountryList").subscribe(response => {
      if (response.status == true) {
        this.countryName = response.responseData
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

    this.commonService.getHttpServiceStateId(postData, "StateAdd").subscribe(response => {
      if (response.status == true) {
        this.StateList = response.responseData
      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }


  //get StateAddForm validation control
  get StateAddControl() {
    return this.StateAddForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.StateAddForm.valid) {
      if (this.StateAddForm.value.Status == true) {
        this.Status = 1
      }
      else {
        this.Status = 0
      }
      var postData = {
        StateName: this.StateAddForm.value.StateName,
        CountryId: this.StateAddForm.value.CountryId,
        StateCode: this.StateAddForm.value.StateCode,
        Status: this.Status,
      }
       this.commonService.postHttpService(postData, "StateAdd").subscribe(response => {
        if (response.status == true) {
         this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'States add saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'States add could not be saved!',
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
