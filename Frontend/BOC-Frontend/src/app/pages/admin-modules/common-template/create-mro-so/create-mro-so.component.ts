import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-mro-so',
  templateUrl: './create-mro-so.component.html',
  styleUrls: ['./create-mro-so.component.scss']
})
export class CreateMroSoComponent implements OnInit {



  AddForm: FormGroup;
  submitted = false;


  //parent variable
  QuoteId;
  MROId;
  CustomerId;
  SOType;
  CustomerBillToId;
  CustomerShipToId;
  SalesOrderItem: any = []
  Notes; TotalValue; ProcessFee; TotalTax; TaxPercent; Discount; ShippingFee; GrandTotal; Status

  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.QuoteId = this.data.QuoteId;
    this.CustomerId = this.data.CustomerId;
    this.SalesOrderItem = this.data.SalesOrderItem;
    // console.log(this.SalesOrderItem)
   
    this.CustomerBillToId = this.data.CustomerBillToId;
    this.CustomerShipToId = this.data.CustomerShipToId;
 
    this.AddForm = this.fb.group({
      CustomerPONo: ['', Validators.required],
      DueDate: ['', Validators.required],

    })
  }


  onSubmit() {
    this.submitted = true;
    if (this.AddForm.valid) {
      //quoteDate
      const DueDateYears = this.AddForm.value.DueDate.year
      const DueDateDates = this.AddForm.value.DueDate.day;
      const DueDatemonths = this.AddForm.value.DueDate.month;
      let dueDates = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
      let DueDate = moment(dueDates).format('YYYY-MM-DD');


      var postData = {
        "MROId": this.MROId,
        "QuoteId": this.QuoteId,
        "CustomerId": this.CustomerId,
        "DueDate": DueDate,
        "CustomerPONo": this.AddForm.value.CustomerPONo,
        "ShipAddressBookId": this.CustomerShipToId,
        "BillAddressBookId": this.CustomerBillToId,
        "SalesOrderItem": this.SalesOrderItem
      }
      this.commonService.postHttpService(postData, "MROSOCreate").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'SO Created Successfully!',
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
