import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-mro-po',
  templateUrl: './create-mro-po.component.html',
  styleUrls: ['./create-mro-po.component.scss']
})
export class CreateMroPoComponent implements OnInit {


  showQtyerror: boolean = false;
  btnDisabled: boolean = false;
  AddForm: FormGroup;
  submitted = false;
  QuoteId;
  MROId;
  CustomerId;
  SOId;
  POId;
  Invoice_Status;
  POAmount
  IsInvoiceApproved
  arrayvalue
  viewResult: any = []
  public event: EventEmitter<any> = new EventEmitter();
  PurchaseOrderItem: any = []
  MaxQtyerror: boolean = false;
  LocalCurrencyCode
  ExchangeRate
  BaseCurrencyCode
  BaseGrandTotal
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.SOId = this.data.SOId;


    // this.AddForm = this.fb.group({
    //   VendorId: ['', Validators.required],
    //   Qty: ['', Validators.required]
    // })
    this.getViewContent()
  }

  getViewContent() {
    var postData = {
      MROId: this.MROId,
      SOId: this.SOId
    }
    this.commonService.postHttpService(postData, "VendorQuoteBySO").subscribe(response => {
      if (response.status == true) {
        this.viewResult = response.responseData.sqlVendorQuoteInfos.map(a => {
          a.checked = false;
          a.AvaliableQuantity = '';
          a.showQtyerror = false;
          a.MaxQtyerror = false;

          ; return a;
        });
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  onSubmit() {
    this.submitted = true;
    this.PurchaseOrderItem = this.viewResult.filter(a => a.checked);
    if (this.PurchaseOrderItem.length > 0) {
      this.PurchaseOrderItem.map(a => {
        if (a.AvaliableQuantity == '') {
          a.showQtyerror = true

        }
        else {
          a.showQtyerror = false
          if (!a.showQtyerror && !a.MaxQtyerror) {
            a.overallQuantity = a.Quantity
            a.Quantity = a.AvaliableQuantity;
            this.LocalCurrencyCode = a.ItemLocalCurrencyCode
            this.ExchangeRate = a.ItemExchangeRate
            this.BaseGrandTotal = a.BaseGrandTotal
            // a.Price = a.AvaliableQuantity*a.Rate
            var VatTax = a.ItemTaxPercent / 100
            let VatTaxPrice = a.Rate * VatTax;
            var singleShippingCharge = a.ShippingCharge / a.overallQuantity;
            a.ShippingCharge = (singleShippingCharge * a.AvaliableQuantity).toFixed(2);
            // Calculate the price
            var price=(parseFloat(a.AvaliableQuantity) * (parseFloat(a.Rate)+ VatTaxPrice))+parseFloat(a.ShippingCharge)
           a.Price = price.toFixed(2)
           a.Tax=(a.Rate * VatTax).toFixed(2)
           let BaseShippingCharge = a.ShippingCharge*this.ExchangeRate
           a.BaseShippingCharge =BaseShippingCharge.toFixed(2)
           let priceUSD = a.Price*this.ExchangeRate
           a.BasePrice =priceUSD.toFixed(2)
           var TaxLocal=(a.Rate * VatTax)
           a.BaseTax=(TaxLocal* this.ExchangeRate).toFixed(2)
           let RateUSD = a.Rate* this.ExchangeRate
           a.BaseRate=RateUSD.toFixed(2)
            this.btnDisabled = true;
           
          }

        }
        var firstdata = a.Description.replace(/\'/g, "'");
        var data = firstdata.replace("\\","")
        a.Description = data

        return a;
      });
      var postData = {
        "MROId": this.MROId,
        "LocalCurrencyCode":this.LocalCurrencyCode,
        "ExchangeRate":this.ExchangeRate,
        "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
        "BaseGrandTotal":this.BaseGrandTotal,
        "PurchaseOrderItem": this.PurchaseOrderItem,
      }
      this.commonService.postHttpService(postData, "CreatePOByMRO").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'PO Created Successfully!',
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
          this.btnDisabled = false;

        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
    else {

      Swal.fire({
        type: 'info',
        title: 'Message',
        text: 'Please checked the Vendor Item',
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }

  }
  onWebLink(WebLink){
    window.open(WebLink, "_blank");

  }
  MaxQuantity(i) {
    var item = this.viewResult[i]
    var AvaliableQuantityNumber: number = item.AvaliableQuantity;
    var QuantityNumber: number = item.Quantity;
    if (AvaliableQuantityNumber > QuantityNumber) {
      item.MaxQtyerror = true

    }
    else {
      item.MaxQtyerror = false


    }

    if (item.AvaliableQuantity != '') {
      item.showQtyerror = false
    }
  }
  isAvaliableshow(event, i, VendorId) {
    let allowSelection = false;
    let selectedResult = this.viewResult.filter(a => a.checked);

    if (event.target.checked) {
      if (selectedResult.length > 0) {
        if (selectedResult.find(a => a.VendorId == VendorId)) {
          allowSelection = true;
        } else {
          allowSelection = false;
        }
      } else {
        allowSelection = true;
      }

      event.target.checked = this.viewResult[i].checked = allowSelection;

      if (!allowSelection) {
        Swal.fire({
          type: 'info',
          title: 'Message',
          text: 'Cannot select two different Vendors',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });
        
      }
    } else {
      this.viewResult[i].checked = false;
    }

    // if (this.viewResult[i].checked == true) {
    //   this.viewResult[i].isshowQty = true
    // }
    // else {
    //   this.viewResult[i].isshowQty = false
    // }


  }
  //get AddressForm validation control
  get AddFormControl() {
    return this.AddForm.controls;
  }


  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }





}
