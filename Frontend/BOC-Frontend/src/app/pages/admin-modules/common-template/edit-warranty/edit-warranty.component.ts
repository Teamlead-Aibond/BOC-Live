import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Const_Alert_pop_message, Const_Alert_pop_title, warranty_list } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-edit-warranty',
  templateUrl: './edit-warranty.component.html',
  styleUrls: ['./edit-warranty.component.scss']
})
export class EditWarrantyComponent implements OnInit {

  submitted = false;
  RRId;
  index;
  warranty;
  WarrantyPeriodValue;
  warrantyList;
  model: any = {}
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder, private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.RRId = this.data.RRId;
    this.warrantyList = warranty_list;

    this.index = this.data.i;
    this.warranty = this.data.warranty;

    const years = Number(this.datePipe.transform(this.warranty.WarrantyStartDate, 'yyyy'));
    const Month = Number(this.datePipe.transform(this.warranty.WarrantyStartDate, 'MM'));
    const Day = Number(this.datePipe.transform(this.warranty.WarrantyStartDate, 'dd'));
    this.model.WarrantyStartDate = {
      year: years,
      month: Month,
      day: Day
    }
    /* const Endyears = Number(this.datePipe.transform(this.warranty.WarrantyEndDate, 'yyyy'));
    const EndMonth = Number(this.datePipe.transform(this.warranty.WarrantyEndDate, 'MM'));
    const EndDay = Number(this.datePipe.transform(this.warranty.WarrantyEndDate, 'dd'));
    this.model.WarrantyEndDate = {
      year: Endyears,
      month: EndMonth,
      day: EndDay
    } */

    this.model.WarrantyPeriod = this.warranty.WarrantyPeriod; 
    var statusObj = warranty_list.find(a=>a.WarrantyPeriodId == this.warranty.WarrantyPeriod); 
    this.WarrantyPeriodValue = statusObj ? statusObj.WarrantyPeriodValue : '';
  }

  onSubmit(f: NgForm) {
    this.submitted = true;
    //WarrantyStartDate
    const reqYears = this.model.WarrantyStartDate.year
    const reqDates = this.model.WarrantyStartDate.day;
    const reqmonths = this.model.WarrantyStartDate.month;
    let WarrantyDates = new Date(reqYears, reqmonths - 1, reqDates);
    let WarrantyStartDates = moment(WarrantyDates).format('YYYY-MM-DD');

    /* //WarrantyEndDate
    const WarrantyEndDateYears = this.model.WarrantyEndDate.year
    const WarrantyEndDateDates = this.model.WarrantyEndDate.day;
    const WarrantyEndDatemonths = this.model.WarrantyEndDate.month;
    let WarrantyEDates = new Date(WarrantyEndDateYears, WarrantyEndDatemonths - 1, WarrantyEndDateDates);
    let WarrantyEndDates = moment(WarrantyEDates).format('YYYY-MM-DD'); */
if(f.valid){
    var postData = {
      "WarrantyId": this.warranty.WarrantyId,
      "RRId": this.RRId,
      "WarrantyStartDate": WarrantyStartDates,
      "WarrantyPeriod":this.model.WarrantyPeriod,
      //"WarrantyEndDate": WarrantyEndDates

    }
    this.commonService.postHttpService(postData, "UpdateWarranty").subscribe(response => {
      if (response.status == true) {
        this.triggerEvent(response.responseData);
        this.modalRef.hide();
        Swal.fire({
          title: 'Success!',
          text: 'Warranty Updated Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        Swal.fire({
          title: 'Error!',
          text: 'Warranty could not be Updated!',
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
