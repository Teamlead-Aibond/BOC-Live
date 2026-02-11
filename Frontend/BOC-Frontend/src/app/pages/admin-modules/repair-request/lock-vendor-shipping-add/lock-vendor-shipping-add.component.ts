import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { CONST_ShipAddressType } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-lock-vendor-shipping-add',
  templateUrl: './lock-vendor-shipping-add.component.html',
  styleUrls: ['./lock-vendor-shipping-add.component.scss']
})
export class LockVendorShippingAddComponent implements OnInit {
  submitted: boolean;
  addressList: any = [];

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any) { }

  public event: EventEmitter<any> = new EventEmitter();

  Form: FormGroup;

  RRVendorId;
  VendorId;
  ngOnInit(): void {
    console.log(this.data.RRVendorId);
    this.RRVendorId = this.data.RRVendorId
    this.VendorId = this.data.VendorId
    this.formGroup();
    this.getAddressList();
  }

  formGroup() {
    this.Form = this.fb.group({
      RRVendorId: this.RRVendorId,
      VendorShipIdLocked: ['']
    })
  }
  //get StateAddForm validation control
  get FormControl() {
    return this.Form.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
  getAddressList() {
    var postData = {
      "IdentityId": this.VendorId,
      "IdentityType": 2,
      // "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.addressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });

    });

  }

  onSubmit() {
    this.submitted = true;
    let body = { ...this.Form.value }
    if (this.Form.valid) {

      this.commonService.postHttpService(body, "LockVendorShipAddr").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Record saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Record could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));

    }
  }
  onClose() {
    this.triggerEvent("close");
    this.modalRef.hide();
  }
}
