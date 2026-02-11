import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-edit-assign-parts',
  templateUrl: './edit-assign-parts.component.html',
  styleUrls: ['./edit-assign-parts.component.scss']
})
export class EditAssignPartsComponent implements OnInit {

  index;
  item;
  CustomerId;
  model: any = [];
  responseMessage;
  submitted = false;
  PartNo;
  CustomerPartNo1;
  CustomerPartNo2;
  NewPrice;
  LPP;
  CustomerCurrencyCode
  ExchangeRate
  CurrencySymbol
  BaseCurrencySymbol
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef, private cd_ref: ChangeDetectorRef,
    private fb: FormBuilder, @Inject(BsModalRef) public data: any,
    private commonService: CommonService, ) { }
  ngOnInit(): void {
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.item = this.data.item;
    this.CustomerId = this.data.CustomerId
    this.index = this.data.i;
    this.model.PartNo = this.item.PartNo;
    this.model.CustomerPartNo1 = this.item.CustomerPartNo1;
    this.model.CustomerPartNo2 = this.item.CustomerPartNo2;
    this.model.NewPrice = this.item.NewPrice;
    this.model.BaseNewPrice = this.item.BaseNewPrice
    this.LPP = this.item.LastPricePaid
    this.CustomerCurrencyCode = this.data.CustomerCurrencyCode
    this.CurrencySymbol = this.data.CurrencySymbol
    this.getExchangeRate();
  }


  onSubmit(f :NgForm) {
    if(f.valid){
    var postData = {
      "CustomerPartId": this.item.CustomerPartId,
      "CustomerId": this.CustomerId,
      "PartId": this.item.PartId,
      "PartNo": this.model.PartNo,
      "CustomerPartNo1": this.model.CustomerPartNo1,
      "CustomerPartNo2": this.model.CustomerPartNo2,
      "NewPrice": this.model.NewPrice,
      "LPP": this.model.LPP,

      "LocalCurrencyCode":this.CustomerCurrencyCode,
      "ExchangeRate":this.ExchangeRate,
      "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
      "BaseNewPrice":this.model.BaseNewPrice
    }
    this.commonService.postHttpService(postData, "getCustomerPartEdit").subscribe(response => {
      if (response.status == true) {
        this.triggerEvent(response.responseData);
        this.modalRef.hide();
        Swal.fire({
          title: 'Success!',
          text: 'Customer Part updated Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: 'Customer Part could not be updated!',
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
  getExchangeRate() {
    var postData={
    "LocalCurrencyCode" :this.CustomerCurrencyCode,
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
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}
