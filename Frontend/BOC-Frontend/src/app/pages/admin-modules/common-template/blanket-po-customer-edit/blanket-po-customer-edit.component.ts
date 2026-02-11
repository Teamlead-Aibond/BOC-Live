import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message, custompooptions, booleanValues } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blanket-po-customer-edit',
  templateUrl: './blanket-po-customer-edit.component.html',
  styleUrls: ['./blanket-po-customer-edit.component.scss'],
  providers: [NgxSpinnerService]
})
export class BlanketPoCustomerEditComponent implements OnInit {

  submitted = false;
  model: any = {}
  btnDisabled: boolean = false;
  public event: EventEmitter<any> = new EventEmitter();
  BlanketList: any = []
  BlanketddlList: any = [];
  custompooptions: any = custompooptions;
  CustomerPONoIsReadOnly: boolean = false;
  booleanValues = booleanValues
  RRId;
  CustomerId;
  QuoteId;
  GrandTotal;
  BlanketPO: boolean = false;
  CustomPO: boolean = false;
  POValidationError = ''
  POValidationErrorMessage
  CustomerPONo;
  showBlanketPO: boolean = false;
  showSpinner: boolean = true;
  BlanketPOLowerLimitPercent
  CurrencySymbol
  ExchangeRate
  LocalCurrencyCode
  ShipAddressList: any;
  CustomerShipIdLocked: any;
  IsMoveToStore: any;
  Status: any;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.RRId = this.data.RRId;
    this.QuoteId = this.data.QuoteId;
    this.CustomerId = this.data.CustomerId;
    this.GrandTotal = this.data.GrandTotal;
    this.CurrencySymbol = this.data.CurrencySymbol
    this.model.Type = this.data.ApproveType;
    this.model.CustomerBlanketPOId = this.data.CustomerBlanketPOId
    this.model.CustomerPONo = this.data.CustomerPONo
    this.ExchangeRate = this.data.ExchangeRate;
    this.LocalCurrencyCode = this.data.LocalCurrencyCode
    for (var i = 0; i < this.custompooptions.length; i++) {
      if (this.custompooptions[i].value == this.data.CustomerPONo) {
        this.custompooptions[i].checked = true;
        this.CustomerPONoIsReadOnly = true;
      }
    }

    if (this.data.ApproveType == 1) {
      this.BlanketPO = true
      this.CustomPO = false
    } else {
      this.model.CustomerBlanketPOId = null
      this.BlanketPO = false
      this.CustomPO = true
    }
    this.getShipAddressList();
    this.getBlanketList();


  }
  getBlanketList() {
    // this.showSpinner=true;
    var postData = {
      "CustomerId": this.CustomerId,
    }
    this.commonService.postHttpService(postData, 'ByCustomerBlanketPOList').subscribe(response => {
      if (response.status == true) {
        let CurrencySymbol = this.CurrencySymbol
        this.BlanketList = response.responseData
        this.BlanketddlList = response.responseData.map(function (value) {
          return { title: "PO #: " + value.CustomerPONo + " - " + "Current Balance: " + value.LocalCurrencySymbol + ' ' + value.CurrentBalance, "CustomerBlanketPOId": value.CustomerBlanketPOId }
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
    if (this.data.ApproveType == 1) {
      this.model.CustomerPONo = ''
    }
    if (value == 0) {
      this.BlanketPO = false
      this.CustomPO = true
    }
  }


  onPOValidation(CustomerBlanketPOId) {
    var CurrentBalance = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CurrentBalance
    this.CustomerPONo = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).CustomerPONo
    this.LocalCurrencyCode = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).LocalCurrencyCode
    this.ExchangeRate = this.BlanketList.find(a => a.CustomerBlanketPOId == CustomerBlanketPOId).ExchangeRate
    //   if(this.BlanketPOLowerLimitPercent != 0){
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
  onSubmit(f: NgForm) {
    if (f.valid && (this.POValidationError == '')) {
      if (this.data.Consolidated != 1) {
        this.btnDisabled = true;
        if (this.model.Type == 1) {
          var postData = {
            RRId: this.RRId,
            QuoteId: this.QuoteId,
            CustomerPONo: this.CustomerPONo,
            CustomerBlanketPOId: this.model.CustomerBlanketPOId,
            QuoteAmount: this.GrandTotal,
            Comments: this.model.Comments,
            LocalCurrencyCode: this.LocalCurrencyCode,
            ExchangeRate: this.ExchangeRate,
            BaseCurrencyCode: localStorage.getItem("BaseCurrencyCode"),
            // CustomerShipIdLocked:this.model.CustomerShipIdLocked,
            // IsMoveToStore:this.model.IsMoveToStore
          }
          this.commonService.postHttpService(postData, 'UpdateCustomerPONoInRR').subscribe(response => {
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
            QuoteId: this.QuoteId,
            CustomerPONo: this.model.CustomerPONo.trim(),
            QuoteAmount: this.GrandTotal,
            Comments: this.model.Comments,
            LocalCurrencyCode: this.LocalCurrencyCode,
            ExchangeRate: this.ExchangeRate,
            BaseCurrencyCode: localStorage.getItem("BaseCurrencyCode"),
            // CustomerShipIdLocked:this.model.CustomerShipIdLocked,
            // IsMoveToStore:this.model.IsMoveToStore

          }
          this.commonService.postHttpService(postData1, 'UpdateCustomerPONoInRR').subscribe(response => {
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
      }
      else {
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
  updateCheckedCustomPOOptions(option, event) {
    for (var i = 0; i < this.custompooptions.length; i++) {
      if (this.custompooptions[i].value != option.value) {
        this.custompooptions[i].checked = false;
      }
    }
    if (option.checked == true) {
      this.model.CustomerPONo = option.value;
      this.CustomerPONoIsReadOnly = true;
    } else {
      this.model.CustomerPONo = '';
      this.CustomerPONoIsReadOnly = false;
    }
  }

  getShipAddressList() {
    var postData = {
      "IdentityId": this.CustomerId,
      "IdentityType": 1,
      // "Type":CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.ShipAddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
    });

  }


}
