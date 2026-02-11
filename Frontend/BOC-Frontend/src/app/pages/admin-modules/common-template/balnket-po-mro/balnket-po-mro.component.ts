import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-balnket-po-mro',
  templateUrl: './balnket-po-mro.component.html',
  styleUrls: ['./balnket-po-mro.component.scss'],
  providers: [NgxSpinnerService]
})
export class BalnketPoMroComponent implements OnInit {
  submitted = false;
  model: any = {}
  btnDisabled: boolean = false;
  public event: EventEmitter<any> = new EventEmitter();
  BlanketList: any = []
  BlanketddlList: any = [];
  SalesOrderItem
  MROId;
  CustomerId;
  QuoteId;
  GrandTotal;
  CustomerShipToId
  CustomerBillToId
  BlanketPO: boolean = false;
  CustomPO: boolean = false;
  POValidationError = ''
  POValidationErrorMessage
  CustomerPONo;
  showBlanketPO: boolean = false;
  showSpinner: boolean = true
  BlanketPOLowerLimitPercent
  LocalCurrencyCode
  ExchangeRate
  BaseCurrencyCode
  BaseGrandTotal
  CurrencySymbol
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.QuoteId = this.data.QuoteId;
    this.CustomerId = this.data.CustomerId;
    this.GrandTotal = this.data.GrandTotal;
    this.CustomerShipToId = this.data.CustomerShipToId;
    this.CustomerBillToId = this.data.CustomerBillToId;
    this.SalesOrderItem = this.data.SalesOrderItem
    this.LocalCurrencyCode = this.data.LocalCurrencyCode
    this.ExchangeRate = this.data.ExchangeRate
    this.BaseCurrencyCode = this.data.BaseCurrencyCode
    this.BaseGrandTotal = this.data.BaseGrandTotal
    this.CurrencySymbol = this.data.CurrencySymbol
    this.getBlanketList();
  }
  getBlanketList() {
    // this.showSpinner=true;
    var postData = {
      "CustomerId": this.CustomerId,
    }
    this.commonService.postHttpService(postData, 'ByCustomerBlanketPOList').subscribe(response => {
      if (response.status == true) {
        var CurrencySymbol = this.CurrencySymbol
        this.BlanketList = response.responseData
        this.BlanketddlList = response.responseData.map(function (value) {
          return { title: "PO #: " + value.CustomerPONo + " - " + "Current Balance:" + value.LocalCurrencySymbol + ' ' + value.CurrentBalance, "CustomerBlanketPOId": value.CustomerBlanketPOId }
        });
        //this.BlanketPOLowerLimitPercent = response.responseData.BlanketPOLowerLimitPercent
        if (this.BlanketList.length > 0) {
          this.showBlanketPO = true
        }
      }
      else {
        this.showBlanketPO = false
        this.CustomPO = true
      }
      this.cd_ref.detectChanges();
      // this.showSpinner=false
    });
  }
  setBlanketCutomer(value) {
    if (value == 1) {
      this.BlanketPO = true
      this.CustomPO = false
    }
  }
  setCustomerPO(value) {
    if (value == 0) {
      this.BlanketPO = false
      this.CustomPO = true
    }
  }
  onPOValidation(CustomerBlanketPOId) {
    var CurrentBalance = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CurrentBalance
    this.CustomerPONo = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CustomerPONo
    // if(this.BlanketPOLowerLimitPercent != 0){
    //   var limit = (CurrentBalance * this.BlanketPOLowerLimitPercent / 100 )
    //   if (this.GrandTotal > limit) {
    //     this.POValidationError = 'Error';
    //     this.POValidationErrorMessage = `Cann't Approve due to insufficient balance`
    //   }
    //   else {
    //     this.POValidationError = '';
    //     this.POValidationErrorMessage = ''
    //   }
    // }else{
    //   if (this.GrandTotal != CurrentBalance) {
    //     this.POValidationError = 'Error';
    //     this.POValidationErrorMessage = `Cann't Approve due to insufficient balance`
    //   }
    //   else {
    //     this.POValidationError = '';
    //     this.POValidationErrorMessage = ''
    //   }
    // }
    if (this.GrandTotal > CurrentBalance) {
      this.POValidationError = 'Error';
      this.POValidationErrorMessage = `Cann't Approve due to insufficient balance`
    }
    else {
      this.POValidationError = '';
      this.POValidationErrorMessage = ''
    }
  }
  // onSubmit(f: NgForm) {
  //   if (f.valid && (this.POValidationError == '')) {
  //     this.btnDisabled = true;
  //     const DueDateYears = this.model.DueDate.year
  //     const DueDateDates = this.model.DueDate.day;
  //     const DueDatemonths = this.model.DueDate.month;
  //     let dueDates = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
  //     let DueDate = moment(dueDates).format('YYYY-MM-DD');
  //     if (this.model.Type == 1) {
  //       var postData = {
  //         "LocalCurrencyCode":this.LocalCurrencyCode,
  //         "ExchangeRate":this.ExchangeRate,
  //         "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
  //         "BaseGrandTotal":this.BaseGrandTotal,
  //         MROId: this.MROId,
  //         QuoteId: this.QuoteId,
  //         CustomerPONo: this.CustomerPONo,
  //         CustomerBlanketPOId: this.model.CustomerBlanketPOId,
  //         QuoteAmount: this.GrandTotal,
  //         CustomerShipToId: this.CustomerShipToId,
  //         CustomerBillToId: this.CustomerBillToId,
  //         SalesOrderItem: this.SalesOrderItem,
  //         Comments: this.model.Comments,
  //         "DueDate": DueDate,
  //         "CustomerId": this.CustomerId,
  //       }
  //       this.commonService.postHttpService(postData, 'MROSOCreate').subscribe(response => {
  //         if (response.status == true) {
  //           this.triggerEvent(response.responseData);
  //           this.modalRef.hide();
  //           Swal.fire({
  //             title: 'Success!',
  //             text: 'SO Created Successfully!',
  //             type: 'success',
  //             confirmButtonClass: 'btn btn-confirm mt-2'
  //           });
  //         }
  //         else {
  //           Swal.fire({
  //             title: 'Error!',
  //             text: response.message,
  //             type: 'warning',
  //             confirmButtonClass: 'btn btn-confirm mt-2'
  //           });
  //         }
  //       })
  //     } else {
  //       var postData1 = {
  //         "LocalCurrencyCode":this.LocalCurrencyCode,
  //         "ExchangeRate":this.ExchangeRate,
  //         "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
  //         "BaseGrandTotal":this.BaseGrandTotal,
  //         MROId: this.MROId,
  //         QuoteId: this.QuoteId,
  //         CustomerPONo: this.model.CustomerPONo.trim(),
  //         QuoteAmount: this.GrandTotal,
  //         CustomerShipToId: this.CustomerShipToId,
  //         CustomerBillToId: this.CustomerBillToId,
  //         SalesOrderItem: this.SalesOrderItem,
  //         Comments: this.model.Comments,
  //         "DueDate": DueDate,
  //         "CustomerId": this.CustomerId,
  //       }
  //       this.commonService.postHttpService(postData1, 'MROSOCreate').subscribe(response => {
  //         if (response.status == true) {
  //           this.triggerEvent(response.responseData);
  //           this.modalRef.hide();
  //           Swal.fire({
  //             title: 'Success!',
  //             text: 'SO Created Successfully!',
  //             type: 'success',
  //             confirmButtonClass: 'btn btn-confirm mt-2'
  //           });
  //         }
  //         else {
  //           Swal.fire({
  //             title: 'Error!',
  //             text: response.message,
  //             type: 'warning',
  //             confirmButtonClass: 'btn btn-confirm mt-2'
  //           });
  //         }
  //       })
  //     }
  //   }
  //   else {
  //     Swal.fire({
  //       type: 'error',
  //       title: Const_Alert_pop_title,
  //       text: Const_Alert_pop_message,
  //       confirmButtonClass: 'btn btn-confirm mt-2',
  //     });
  //   }
  // }
  onSubmit(f: NgForm) {
    if (f.valid && this.POValidationError === '') {
      const DueDateYears = this.model.DueDate.year;
      const DueDateDates = this.model.DueDate.day;
      const DueDatemonths = this.model.DueDate.month;
      const dueDate = new Date(DueDateYears, DueDatemonths - 1, DueDateDates);
      const currentDate = new Date();
      if (dueDate <= currentDate) {
        Swal.fire({
          type: 'error',
          title: 'Invalid Due Date',
          text: 'Today or past dates are not allowed as the Due Date.',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
        return;
      }
      const formattedDueDate = moment(dueDate).format('YYYY-MM-DD');
      this.btnDisabled = true;
      const postData = {
        "LocalCurrencyCode": this.LocalCurrencyCode,
        "ExchangeRate": this.ExchangeRate,
        "BaseCurrencyCode": localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal": this.BaseGrandTotal,
        MROId: this.MROId,
        QuoteId: this.QuoteId,
        CustomerPONo: this.model.Type === 1 ? this.CustomerPONo : this.model.CustomerPONo.trim(),
        CustomerBlanketPOId: this.model.CustomerBlanketPOId,
        QuoteAmount: this.GrandTotal,
        CustomerShipToId: this.CustomerShipToId,
        CustomerBillToId: this.CustomerBillToId,
        SalesOrderItem: this.SalesOrderItem,
        Comments: this.model.Comments,
        "DueDate": formattedDueDate,
        "CustomerId": this.CustomerId,
      };
      this.commonService.postHttpService(postData, 'MROSOCreate').subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'SO Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2',
          });
        }
      });
    } else {
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