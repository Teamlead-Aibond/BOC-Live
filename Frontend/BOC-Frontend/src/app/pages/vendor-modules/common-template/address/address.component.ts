import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  AddressForm: FormGroup;
  submitted = false;

  StateList;
  countryList;
  StateName;
  CountryName;
  CountryId;
  StateId;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {

    this.AddressForm = this.fb.group({
      StreetAddress: ['', Validators.required],
      SuiteOrApt: [''],
      CountryId: ['', Validators.required],
      StateId: ['', Validators.required],
      City: ['', Validators.required],
      Zip: ['', Validators.required],
      PhoneNoPrimary: ['', Validators.required],
      PhoneNoSecondary: [''],
      Fax: [''],
      /* IsContactAddress: [false],
      IsShippingAddress: [false],
      IsBillingAddress: [false], */
    })

    this.getCountryList();
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
  getState(event, CountryId) {
    var postData = {
      CountryId: CountryId
    }

    this.CountryName = this.filterAndGetValue(this.countryList, "CountryName", "CountryId", CountryId)
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
        AddressList: [{
          StreetAddress: this.AddressForm.value.StreetAddress,
          SuiteOrApt: this.AddressForm.value.SuiteOrApt,
          CountryId: this.AddressForm.value.CountryId,
          StateId: this.AddressForm.value.StateId,
          City: this.AddressForm.value.City,
          Zip: this.AddressForm.value.Zip,
          StateName: this.StateName,
          CountryName: this.CountryName,
          PhoneNoPrimary: this.AddressForm.value.PhoneNoPrimary,
          PhoneNoSecondary: this.AddressForm.value.PhoneNoSecondary,
          Fax: this.AddressForm.value.Fax,
          // IsContactAddress:this.AddressForm.value.IsContactAddress,
          // IsShippingAddress:this.AddressForm.value.IsShippingAddress,
          // IsBillingAddress: this.AddressForm.value.IsBillingAddress,
        }]
      }

      this.commonService.postHttpService(postData, "CreateAddressVendor").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData.AddressList[0]);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Address saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Address could not be saved!',
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
