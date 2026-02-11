import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blanket-po-invoice-edit',
  templateUrl: './blanket-po-invoice-edit.component.html',
  styleUrls: ['./blanket-po-invoice-edit.component.scss']
})
export class BlanketPoInvoiceEditComponent implements OnInit {


    submitted = false;
    model: any = {}
    btnDisabled: boolean = false;
    public event: EventEmitter<any> = new EventEmitter();
    BlanketList: any = []
    BlanketddlList: any = [];
  
  
    RRId;
    CustomerId;
    MROId;
    InvoiceId;
    GrandTotal;
    BlanketPO: boolean = false;
    CustomPO: boolean = false;
    POValidationError = ''
    POValidationErrorMessage
    CustomerPONo;
    showBlanketPO: boolean = false;
    showSpinner: boolean = true;
    BlanketPOLowerLimitPercent
    BlanketPOExcludeAmount
    BlanketPONetAmount
    CurrencySymbol
    LocalCurrencyCode
    ExchangeRate
    constructor(public modalRef: BsModalRef,
      private fb: FormBuilder,
      private CommonmodalService: BsModalService,
      private datePipe: DatePipe,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any,) { }
  
    ngOnInit(): void {
      this.RRId = this.data.RRId;
      this.MROId = this.data.MROId;
      this.InvoiceId = this.data.InvoiceId;
      this.CustomerId = this.data.CustomerId;
      this.GrandTotal = this.data.GrandTotal;
      this.BlanketPOExcludeAmount = this.data.BlanketPOExcludeAmount;
      this.BlanketPONetAmount = this.data.BlanketPONetAmount
      this.CurrencySymbol = this.data.CurrencySymbol
      this.ExchangeRate = this.data.ExchangeRate;
      this.LocalCurrencyCode =  this.data.LocalCurrencyCode
      this.model.CustomerBlanketPOId = this.data.CustomerBlanketPOId
      this.model.CustomerPONo = this.data.CustomerPONo
  
      if((this.data.ExcludedPartLength <= 0)){
        this.model.Type = this.data.ApproveType;
        if (this.data.ApproveType == 1) {
          this.BlanketPO = true
          this.CustomPO = false
        } else {
          this.model.CustomerBlanketPOId = null
          this.BlanketPO = false
          this.CustomPO = true
        }
      }else{
        this.model.Type =  "1"
        this.BlanketPO = true
        this.CustomPO = false
      }
  
      this.getBlanketList();
  
  
    }
    getBlanketList() {
      // this.showSpinner=true;
      var postData = {
        "CustomerId": this.CustomerId,
      }
      this.commonService.postHttpService(postData, 'ByCustomerBlanketPOList').subscribe(response => {
        if (response.status == true) {
          let CurrencySymbol=this.CurrencySymbol

          this.BlanketList = response.responseData
          this.BlanketddlList = response.responseData.map(function (value) {
            return { title: "PO #: " + value.CustomerPONo + " - " + "Current Balance: "+value.LocalCurrencySymbol  +' '+ value.CurrentBalance, "CustomerBlanketPOId": value.CustomerBlanketPOId }
          });
         // this.BlanketPOLowerLimitPercent = response.responseData.BlanketPOLowerLimitPercent

          if (this.BlanketList.length > 0) {
            this.showBlanketPO = true
            if(this.model.CustomerBlanketPOId){
              this.CustomerPONo = this.BlanketList.find(a => a.CustomerBlanketPOId == this.model.CustomerBlanketPOId).CustomerPONo
            }
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
    setCustomerPO(value,e) {
      if((this.data.ExcludedPartLength <= 0)){
      if (this.data.ApproveType == 1) {
        this.model.CustomerPONo = ''
        }
      if (value == 0) {
        this.BlanketPO = false
        this.CustomPO = true
      }
    }else{
      $('#rdoblankpo').prop('checked',true)
      e.target.checked = false
      this.BlanketPO = true
      this.CustomPO = false
      Swal.fire({
        title: 'Message',
        text: 'Excluded parts will not be allowed in custom PO. Please delete it or move into part details section to proceed',
        type: 'info',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
       this.model.Type = "1";
  
  }
    }
  
   
  
  
    onPOValidation(CustomerBlanketPOId) {
      var CurrentBalance = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CurrentBalance
      this.CustomerPONo = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CustomerPONo
      this.LocalCurrencyCode = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).LocalCurrencyCode
      this.ExchangeRate = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).ExchangeRate
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
  
      if (this.BlanketPONetAmount > CurrentBalance) {
        this.POValidationError = 'Error';
        this.POValidationErrorMessage = `Cann't Approve due to insufficient balance`
      }
      else {
        this.POValidationError = '';
        this.POValidationErrorMessage = ''
      }
    }
    onSubmit(f: NgForm) {
      if (f.valid && (this.POValidationError == '')) {
        if(this.data.Consolidated!=1){
        this.btnDisabled = true;
        if (this.model.Type == 1) {
          var postData = {
            RRId: this.RRId,
            InvoiceId: this.InvoiceId,
            CustomerPONo: this.CustomerPONo,
            CustomerBlanketPOId: this.model.CustomerBlanketPOId,
            QuoteAmount:  this.GrandTotal,
            Comments: this.model.Comments,
            MROId:this.MROId,
            LocalCurrencyCode:this.LocalCurrencyCode,
            ExchangeRate:this.ExchangeRate,
            BaseCurrencyCode:localStorage.getItem("BaseCurrencyCode")
          }
          this.commonService.putHttpService(postData, 'InvoiceBlanketPOUpdate').subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: 'Success!',
                text: 'Customer PO # Updated Successfully!',
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
          })
        } else {
          var postData1 = {
            RRId: this.RRId,
            InvoiceId: this.InvoiceId,
            CustomerPONo: this.model.CustomerPONo.trim(),
            QuoteAmount:  this.GrandTotal,
            Comments: this.model.Comments,
            MROId:this.MROId,
            LocalCurrencyCode:this.LocalCurrencyCode,
            ExchangeRate:this.ExchangeRate,
            BaseCurrencyCode:localStorage.getItem("BaseCurrencyCode")
          }
          this.commonService.putHttpService(postData1, 'InvoiceBlanketPOUpdate').subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: 'Success!',
                text: 'Customer PO # Updated Successfully!',
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
          })
        }
      } else {
        Swal.fire({
          type: 'info',
          text: 'The Invoice is added into Consolidated. Please remove from consolidate to change the Customer PO No.',
          title: 'Message',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
      }
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
  
    triggerEvent(item: string) {
      this.event.emit({ data: item, res: 200 });
    }
  
  
  
  
  
  
  }
  


