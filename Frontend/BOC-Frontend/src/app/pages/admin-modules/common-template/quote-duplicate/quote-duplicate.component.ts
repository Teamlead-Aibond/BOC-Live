import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quote-duplicate',
  templateUrl: './quote-duplicate.component.html',
  styleUrls: ['./quote-duplicate.component.scss']
})
export class QuoteDuplicateComponent implements OnInit {


  submitted = false;
  model: any = [];
  QuoteId;
  QuoteNo
  public event: EventEmitter<any> = new EventEmitter();
  customerList: any[]

  constructor(public modalRef: BsModalRef,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.QuoteId = this.data.QuoteId;
    this.QuoteNo = this.data.QuoteNo
    this.getCustomerList()

  }


  onSubmit(f: NgForm) {
    this.submitted = true;
    if (f.valid) {
      var postData = {
        "QuoteId": this.QuoteId,
        "CustomerId": this.model.CustomerId
      }
      this.commonService.postHttpService(postData, "QTDuplicate").subscribe(response => {

        if (response.status == true) {

          this.triggerEvent(response.responseData);
          this.modalRef.hide();

          Swal.fire({
            title: 'Success!',
            text: 'Duplicate saved Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Duplicate could not be saved!',
            type: 'warning',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
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


  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
    });
  }


}
