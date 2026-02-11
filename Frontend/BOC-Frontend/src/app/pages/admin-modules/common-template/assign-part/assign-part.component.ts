import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-assign-part',
  templateUrl: './assign-part.component.html',
  styleUrls: ['./assign-part.component.scss']
})
export class AssignPartComponent implements OnInit {
  index;
  item;
  CustomerId;
  CustomerPartNo1;
  CustomerPartNo2;
  model: any = [];
  responseMessage;
  submitted = false;
  public event: EventEmitter<any> = new EventEmitter();
  CustomerCurrencyCode
  ExchangeRate
  CurrencySymbol
  BaseCurrencySymbol
  constructor(public modalRef: BsModalRef, private cd_ref: ChangeDetectorRef,
    private fb: FormBuilder, @Inject(BsModalRef) public data: any,
    private commonService: CommonService, ) { }
  ngOnInit(): void {
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")
    this.item = this.data.item;
    this.CustomerId=this.data.CustomerId
    this.CustomerCurrencyCode = this.data.CustomerCurrencyCode
    this.CurrencySymbol = this.data.CurrencySymbol
    this.getExchangeRate();
    this.index = this.data.i;
  }

  onSubmit(f: NgForm) {
    this.submitted = true;
    if(f.valid){
  var postData = {
    "PartId":this.item.PartId,
    "CustomerId":this.CustomerId,
    "NewPrice":this.model.NewPrice,
    "CustomerPartNo1":this.model.CustomerPartNo1,
    "CustomerPartNo2":this.model.CustomerPartNo2,
    "LPP":"0",
    "Price":this.item.LPP,
    "PartNo":this.item.PartNo,

    "LocalCurrencyCode":this.CustomerCurrencyCode,
    "ExchangeRate":this.ExchangeRate,
    "BaseCurrencyCode":localStorage.getItem('BaseCurrencyCode'),
    "BaseNewPrice":this.model.BaseNewPrice
  }
  this.commonService.postHttpService(postData, "getAddCustomerPart").subscribe(response => {
    if (response.status == true) {
      this.triggerEvent(response.responseData);
      this.modalRef.hide();
      Swal.fire({
              title: 'Success!',
              text: 'Parts saved Successfully!',
              type: 'success',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
    } 
    else(response.status == false)
     {
    this.responseMessage=response.message;

    }
   this.cd_ref.detectChanges();
  }, error => console.log(error),
);
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
triggerEvent(item: string) {
this.event.emit({ data: item, res: 200 });
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
}
