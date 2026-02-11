import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, Vendor_Bill_Status, Vendor_Bill_Status_creare } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rr-vendor-invoice',
  templateUrl: './rr-vendor-invoice.component.html',
  styleUrls: ['./rr-vendor-invoice.component.scss']
})
export class RrVendorInvoiceComponent implements OnInit {


  AddForm: FormGroup;
  submitted = false;
  QuoteId;
  RRId;
  CustomerId;
  SOId;
  POId;
  Invoice_Status;
  POAmount
  IsInvoiceApproved
  CurrencySymbol
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.RRId = this.data.RRId;
    this.QuoteId = this.data.QuoteId;
    this.CustomerId = this.data.CustomerId;
    this.POId = this.data.POId;
    this.SOId = this.data.SOId;
    this.IsInvoiceApproved = this.data.IsInvoiceApproved
    this.CurrencySymbol = this.data.CurrencySymbol

    if(this.IsInvoiceApproved==1){
      this.Invoice_Status = Vendor_Bill_Status;
    } 
    else{
      this.Invoice_Status = Vendor_Bill_Status_creare;
    } 
    this.POAmount = this.data.POAmount;

    this.AddForm = this.fb.group({
      Shipping: ['0', Validators.required],
      VendorInvNo: ['', Validators.required],
      Status: [1, Validators.required],
      Created: ['', Validators.required],
      Verify: [false, Validators.requiredTrue],
    })
  }


  onSubmit() {
    this.submitted = true;
    if (this.AddForm.valid) {
      //DateRequested
      const reqYears = this.AddForm.value.Created.year
      const reqDates = this.AddForm.value.Created.day;
      const reqmonths = this.AddForm.value.Created.month;
      let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
      let CreatedDate = moment(requestDates).format('YYYY-MM-DD');

      var postData = {
        "RRId": this.RRId,
        "QuoteId": this.QuoteId,
        "CustomerId": this.CustomerId,
        "POId": this.POId,
        "SOId": this.SOId,
        "Shipping": this.AddForm.value.Shipping,
        "VendorInvNo": this.AddForm.value.VendorInvNo,
        "Status": this.AddForm.value.Status,
        "Created": CreatedDate
      }
      this.commonService.postHttpService(postData, "RRCreateVendorInvoice").subscribe(response => {
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
