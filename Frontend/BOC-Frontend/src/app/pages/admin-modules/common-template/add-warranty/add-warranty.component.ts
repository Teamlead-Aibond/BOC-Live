import { Component, OnInit, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import * as moment from 'moment';
import { Const_Alert_pop_message, Const_Alert_pop_title, warranty_list } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-add-warranty',
  templateUrl: './add-warranty.component.html',
  styleUrls: ['./add-warranty.component.scss']
})
export class AddWarrantyComponent implements OnInit {

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
    this.commonService.postHttpService(postData, "CreateWarranty").subscribe(response => {
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
