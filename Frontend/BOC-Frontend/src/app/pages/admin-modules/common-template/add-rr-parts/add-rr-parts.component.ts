import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { trim } from 'jquery';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-add-rr-parts',
  templateUrl: './add-rr-parts.component.html',
  styleUrls: ['./add-rr-parts.component.scss']
})
export class AddRrPartsComponent implements OnInit {
  model: any = [];
  submitted = false;
  Partsavailability: any = [];
  customerParts = false;
  newParts = false;
  item;
  CustomerId;
  responseMessage;
  manufacturers: any[];
  ManufacturerPartNo: string;
  showCheckAvailability = true;
  public event: EventEmitter<any> = new EventEmitter();
  Symbol
  BaseCurrencySymbol
  ExchangeRate
  keyword = 'PartNo';
  filteredData: any[];
  isLoading: Boolean = false;
  LocalCurrencyCode
  filteredPVData: any[];
  isPVLoading: Boolean = false;
  MROhidden:boolean = false;
  PriceSymbol
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }


  ngOnInit(): void {
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.CustomerId = this.data.CustomerId;
    this.MROhidden = this.data.MROhidden;
   
    if (this.data.PartNo) {
      this.model.PartNo = this.data.PartNo;
      // this.showCheckAvailability = false;
      this.checkAvailability();
    }
    this.loadManufacturer();
    this.newParts = false
  }
  getExchangeRate() {
    var postData={
    "LocalCurrencyCode" :this.LocalCurrencyCode,
    "BaseCurrencyCode" : localStorage.getItem('BaseCurrencyCode')
    }
    this.commonService.postHttpService(postData,'Exchange').subscribe(response => {
      if (response.status == true) {
        this.ExchangeRate = response.responseData.ExchangeRate;
        
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  
   
  }
  
  onCalculateBaseNewPrice(){
      this.model.BaseNewPrice= (this.model.NewPrice*this.ExchangeRate).toFixed(2)
  }
  onCalculatBasePrice(){
    this.model.BasePrice= (this.model.Price*1).toFixed(2)
  }
  loadManufacturer() {
    this.commonService.getHttpService("getManufacturerList").subscribe(response => {
      if (response.status == true) {
        this.manufacturers = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  selectEvent(item) {

  }

  selectPVEvent(item) {
    this.model.PreferredVendorId = item.VendorId;
  }

  onChangeSearch(val: string) {
    if (val) {
      this.isLoading = true;
      var postData = {
        "PartNo": val
      }
      this.commonService.postHttpService(postData, "getonSearchPartByPartNo").subscribe(response => {
        if (response.status == true) {
          this.filteredData = response.responseData.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase())

          )

          if(this.filteredData.length==0){
          this.Symbol = this.data.Symbol
          this.LocalCurrencyCode = this.data.LocalCurrencyCode
          this.getExchangeRate()
          }

        }
        else {

        }

        this.isLoading = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoading = false; });

    }
  }

  onPVChangeSearch(val: string) {
    this.model.PreferredVendorId = "";
    if (val) {
      this.isPVLoading = true;
      var postData = {
        "Vendor": val
      }
      this.commonService.postHttpService(postData, "getVendorsByKeyword").subscribe(response => {
        if (response.status == true) {
          this.filteredPVData = response.responseData;

        }
        else {

        }
        this.isPVLoading = false;
        this.cd_ref.detectChanges();
      }, error => {
        console.log(error);
        this.isPVLoading = false;
      });

    }
  }

  onFocused(e, i) {
    // do something when input is focused
  }

  checkAvailability() {
    this.responseMessage = "";
    var PartNo = trim(this.model.PartNo.PartNo) || trim(this.model.PartNo);
    var postData = {
      "PartNo": PartNo,
      "CustomerId":this.CustomerId
    }
    this.commonService.postHttpService(postData, "RRPartsAvailabilityCheck").subscribe(response => {
      if (response.status == true) {
        this.Partsavailability = response.responseData;
        if(this.Partsavailability != ''){
        this.item = response.responseData[0] || '';
        this.model.IsNewOrRefurbished = "2";
        this.model.TaxType = "3";
        this.model.CustomerPartNo1= response.responseData[0].CustomerPartNo1 || '';
        this.model.CustomerPartNo2=response.responseData[0].CustomerPartNo2|| '';
        this.model.NewPrice=response.responseData[0].CustomerNewPrice|| '';
        this.model.BaseNewPrice=response.responseData[0].CustomerBaseNewPrice|| '';
        this.PriceSymbol = response.responseData[0].PriceSymbol
        this.LocalCurrencyCode = response.responseData[0].LocalCurrencyCode
        this.getExchangeRate()
        }else{
        this.newParts = true
        this.model.CustomerPartNo1='';
        this.model.CustomerPartNo2= '';
        this.model.NewPrice='';
        this.model.BaseNewPrice= '';
        }
       

      } else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


  onSubmit(f: NgForm) {
    this.responseMessage = "";
    this.submitted = true;
    if (f.valid) {
      if (this.Partsavailability == "") {

        if (!this.model.ManufacturerId) {
          Swal.fire({
            title: 'Error!',
            text: 'Manufacturer is required!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
          return;
        }

        // if (!this.model.PreferredVendorId) {
        //   Swal.fire({
        //     title: 'Error!',
        //     text: 'Select Preferred Vendor!',
        //     type: 'warning',
        //     confirmButtonClass: 'btn btn-confirm mt-2'
        //   });
        //   return;
        // }


        if(this.MROhidden==true){
          var IsNewOrRefurbished=0
        }
        else{
          IsNewOrRefurbished = 2
        }
        var postData = {
          "PartNo": this.model.PartNo,
          "Description": this.model.Description ? this.model.Description : "",
          "ManufacturerId": this.model.ManufacturerId,
          "ManufacturerName": this.manufacturers.find(a => a.VendorId == this.model.ManufacturerId).VendorName,
          "ManufacturerPartNo": this.model.ManufacturerPartNo,
          "PrimaryVendorId": this.model.PreferredVendorId,
          "Quantity": this.model.Quantity ? this.model.Quantity : 1,
          "Price": this.model.Price ? this.model.Price : 0,
          "TaxType": this.model.TaxType ? this.model.TaxType : 3,
          "CustomerId": this.CustomerId,
          "IsNewOrRefurbished": IsNewOrRefurbished,
          "NewPrice": this.model.NewPrice ? this.model.NewPrice : 0,
          "LastPricePaid": this.model.LastPricePaid ? this.model.LastPricePaid : 0,
          "CustomerPartNo1":this.model.CustomerPartNo1,
          "CustomerPartNo2":this.model.CustomerPartNo2,

          "LocalCurrencyCode":this.LocalCurrencyCode,
          "ExchangeRate":this.ExchangeRate,
          "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
          "BaseNewPrice":this.model.BaseNewPrice,
          "BasePrice": this.model.BasePrice 
        }

        this.commonService.postHttpService(postData, "RRNewCustomerPartsCreate").subscribe(response => {

          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();

            Swal.fire({
              title: 'Success!',
              text: 'RR Parts saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            this.responseMessage = response.message
            Swal.fire({
              title: 'Error!',
              text: 'RR Parts could not be saved!',
              type: 'warning',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      } else {
        var postData1 = {
          "PartId": this.item.PartId,
          "CustomerId": this.CustomerId,
          "NewPrice": this.model.NewPrice ? this.model.NewPrice : 0,
          "LastPricePaid": 0,
          "Price": this.item.Price,
          "PartNo": this.item.PartNo,
          "Description": this.item.Description,
          "ManufacturerId": this.item.ManufacturerId,
          "ManufacturerName": this.manufacturers.find(a => a.VendorId == this.item.ManufacturerId) ? this.manufacturers.find(a => a.VendorId == this.item.ManufacturerId).VendorName : "",
          "ManufacturerPartNo": this.item.ManufacturerPartNo,
          "Quantity": this.item.Quantity,
          "CustomerPartNo1":this.model.CustomerPartNo1,
          "CustomerPartNo2":this.model.CustomerPartNo2,

          "LocalCurrencyCode":this.LocalCurrencyCode,
          "ExchangeRate":this.ExchangeRate,
          "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
          "BaseNewPrice":this.model.BaseNewPrice,
        }
        this.commonService.postHttpService(postData1, "RRCustomerPartscreate").subscribe(response => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();

            Swal.fire({
              title: 'Success!',
              text: 'RR Parts saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          else {
            this.responseMessage = response.message
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
