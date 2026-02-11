import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, warranty_list } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-add-warranty',
  templateUrl: './customer-add-warranty.component.html',
  styleUrls: ['./customer-add-warranty.component.scss']
})
export class CustomerAddWarrantyComponent implements OnInit {


    submitted = false;
    RRId;
    WarrantyPeriodValue;
    model: any = {};
    warrantyPeriod;
    warrantyList;
    public event: EventEmitter<any> = new EventEmitter();
    constructor(public modalRef: BsModalRef,
      private fb: FormBuilder,
      private cd_ref: ChangeDetectorRef,
      private commonService: CommonService,
      @Inject(BsModalRef) public data: any, ) { }
  
    ngOnInit(): void {
      this.RRId = this.data.RRId;
      this.warrantyPeriod = this.data.warrantyPeriod;
      this.warrantyList = warranty_list;
  
      var statusObj = warranty_list.find(a=>a.WarrantyPeriodId == this.warrantyPeriod); 
      this.WarrantyPeriodValue = statusObj ? statusObj.WarrantyPeriodValue : '';
    }
  
    onSubmit(f: NgForm) {
      this.submitted = true; 
      //quoteDate
      const reqYears = this.model.WarrantyStartDate.year
      const reqDates = this.model.WarrantyStartDate.day;
      const reqmonths = this.model.WarrantyStartDate.month;
      let WarrantyDates = new Date(reqYears, reqmonths - 1, reqDates);
      let WarrantyStartDates = moment(WarrantyDates).format('YYYY-MM-DD');
  if(f.valid){
      var postData = {
        "RRId": this.RRId,
        "WarrantyPeriod": this.warrantyPeriod, //this.model.WarrantyPeriod,
        "WarrantyStartDate": WarrantyStartDates
      }
      this.commonService.postHttpService(postData, "AddWarranty").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Warranty Created Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Warranty could not be Created!',
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
  
    triggerEvent(item: string) {
      this.event.emit({ data: item, res: 200 });
    }
  

}
