import { Component, OnInit, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {
  result;
  index;
  AddressForm: FormGroup;
  submitted = false;
  IdentityType;
  IdentityId;
  StateList;
  countryList;
  CountryId;
  CountryName;
  StateName;
  StateId;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    // console.log(this.data.Addressdata);
    this.result = this.data.Addressdata;
    this.index = this.data.i
    this.IdentityType = this.data.IdentityType;
    this.IdentityId = this.data.IdentityId
    this.AddressForm = this.fb.group({
      AddressId: ['', Validators.required],
      IdentityType: this.IdentityType,
      StreetAddress: ['', Validators.required],
      SuiteOrApt: [''],
      CountryId: ['', Validators.required],
      StateId: ['', Validators.required],
      City: ['', Validators.required],
      Zip: ['', Validators.required],
      PhoneNoPrimary: ['', Validators.required],
      PhoneNoSecondary: [''],
      Fax: [''],
      StateName: [''],
      CountryName: [''],
      IsContactAddress: [''],
      IsShippingAddress: [''],
      IsBillingAddress: [''],
    })

    this.getCountryList();




    this.CountryId = this.result.CountryId;
    this.StateId = this.result.StateId
    this.getStateList(this.CountryId);
    this.AddressForm.setValue({
      AddressId: this.result.AddressId,
      IdentityType: this.IdentityType,
      StreetAddress: this.result.StreetAddress,
      SuiteOrApt: this.result.SuiteOrApt,
      CountryId: this.CountryId,
      StateId: this.result.StateId,
      City: this.result.City,
      Zip: this.result.Zip,
      StateName: this.result.StateName,
      CountryName: this.result.CountryName,
      PhoneNoPrimary: this.result.PhoneNoPrimary,
      PhoneNoSecondary: this.result.PhoneNoSecondary,
      Fax: this.result.Fax,
      IsContactAddress: this.result.IsContactAddress ? this.result.IsContactAddress : 0,
      IsShippingAddress: this.result.IsShippingAddress ? this.result.IsShippingAddress : 0,
      IsBillingAddress: this.result.IsBillingAddress ? this.result.IsBillingAddress : 0,
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
    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
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
    this.CountryName = this.filterAndGetValue(this.countryList, "CountryName", "CountryId", this.CountryId)

    this.commonService.getHttpServiceStateId(postData, "getStateListDropdown").subscribe(response => {
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

  onSubmit() {

    this.submitted = true;
    if (this.AddressForm.valid) {
      var postData = {
        IdentityId: this.IdentityId,
        AddressList: [{
          AddressId: this.AddressForm.value.AddressId,
          IdentityType: this.IdentityType,
          StreetAddress: this.AddressForm.value.StreetAddress,
          SuiteOrApt: this.AddressForm.value.SuiteOrApt,
          CountryId: this.CountryId,
          StateId: this.StateId,
          City: this.AddressForm.value.City,
          Zip: this.AddressForm.value.Zip,
          StateName: this.StateName || this.result.StateName,
          CountryName: this.CountryName || this.result.CountryName,
          PhoneNoPrimary: this.AddressForm.value.PhoneNoPrimary,
          PhoneNoSecondary: this.AddressForm.value.PhoneNoSecondary,
          Fax: this.AddressForm.value.Fax,
          IsContactAddress: this.result.IsContactAddress ? this.result.IsContactAddress : 0,
          IsShippingAddress: this.result.IsShippingAddress ? this.result.IsShippingAddress : 0,
          IsBillingAddress: this.result.IsBillingAddress ? this.result.IsBillingAddress : 0,
        }]
      }
      this.commonService.putHttpService(postData, "getAddressEdit").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData.AddressList[0]);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Address updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Address could not be updated!',
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


  //get AddressForm validation control
  get AddressFormControl() {
    return this.AddressForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

}
