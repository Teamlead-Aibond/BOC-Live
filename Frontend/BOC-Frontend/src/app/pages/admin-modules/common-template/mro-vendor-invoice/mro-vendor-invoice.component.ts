import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, Vendor_Bill_Status, Vendor_Bill_Status_creare } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mro-vendor-invoice',
  templateUrl: './mro-vendor-invoice.component.html',
  styleUrls: ['./mro-vendor-invoice.component.scss']
})
export class MroVendorInvoiceComponent implements OnInit {


  AddForm: FormGroup;
  submitted = false;
  QuoteId;
  MROId;
  CustomerId;
  SOItemId;
  POId;
  Invoice_Status;
  POAmount
  IsInvoiceApproved;
  Quantity
  VendorId;
  MROShippingHistoryId
  ItemLocalCurrencySymbol
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.CustomerId = this.data.CustomerId;
    this.POId = this.data.POId;
    this.SOItemId = this.data.SOItemId;
    this.Quantity = this.data.Quantity;
    this.VendorId = this.data.VendorId;
    this.IsInvoiceApproved = this.data.IsInvoiceApproved;
    this.ItemLocalCurrencySymbol = this.data.ItemLocalCurrencySymbol
    this.MROShippingHistoryId = this.data.MROShippingHistoryId;
    if (this.IsInvoiceApproved == 1) {
      this.Invoice_Status = Vendor_Bill_Status;
    }
    else {
      this.Invoice_Status = Vendor_Bill_Status_creare;
    }
    this.POAmount = this.data.POAmount;

    this.AddForm = this.fb.group({
      Shipping: ['0', Validators.required],
      VendorInvNo: ['', Validators.required],
      Status: [1, Validators.required],
      Created: ['', Validators.required],
      Verify: ['', Validators.required],
    })
  }


  onSubmit() {
    this.submitted = true;
    if (this.AddForm.valid) {

      const CreatedDateYears = this.AddForm.value.Created.year;
      const CreatedDateDates = this.AddForm.value.Created.day;
      const CreatedDatemonths = this.AddForm.value.Created.month;
      let CreateDate = new Date(CreatedDateYears, CreatedDatemonths - 1, CreatedDateDates);
      let createDate = moment(CreateDate).format('YYYY-MM-DD');
      var postData = {
        "MROShippingHistoryId":this.MROShippingHistoryId,
        "MROId": this.MROId,
        "CustomerId": this.CustomerId,
        "POId": this.POId,
        "SOItemId": this.SOItemId,
        "Quantity": this.Quantity,
        "VendorId": this.VendorId,
        "Shipping": this.AddForm.value.Shipping,
        "VendorInvNo": this.AddForm.value.VendorInvNo,
        "Status": this.AddForm.value.Status,
        "Created": createDate


      }
      this.commonService.postHttpService(postData, "MROVendorInvoiceCreate").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Vendor Invoice Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }
  }


  //get AddressForm validation control
  get AddFormControl() {
    return this.AddForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }






}
