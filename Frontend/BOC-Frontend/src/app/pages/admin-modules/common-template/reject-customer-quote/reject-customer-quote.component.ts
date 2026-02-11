import { Component, OnInit, Inject, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Const_Alert_pop_message, Const_Alert_pop_title, customer_quote_reject_reasons_admin } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reject-customer-quote',
  templateUrl: './reject-customer-quote.component.html',
  styleUrls: ['./reject-customer-quote.component.scss']
})
export class RejectCustomerQuoteComponent implements OnInit {
  RRId;
  MROId;
  model: any = {}
  submitted = false;
  QuoteId;
  RRVendorId;
  reason;
  customer_quote_reject_reasons;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  EditForm = this.fb.group({
    reason: ['', [Validators.required]]
  })

  ngOnInit(): void {
    this.RRId = this.data.RRId;
    this.QuoteId = this.data.QuoteId;
    this.RRVendorId = this.data.RRVendorId;
    this.MROId = this.data.MROId
    console.log(this.RRId, this.MROId)

    this.customer_quote_reject_reasons = customer_quote_reject_reasons_admin;
  }

  //get Form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.EditForm.valid) {
      if (this.MROId == undefined) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, reject it!',
          cancelButtonText: 'No, cancel!',
          confirmButtonClass: 'btn btn-success mt-2',
          cancelButtonClass: 'btn btn-danger ml-2 mt-2',
          buttonsStyling: false
        }).then((result) => {
          if (result.value) {
            var postData = {
              RRId: this.RRId,
              RRVendorId: this.RRVendorId,
              QuoteId: this.QuoteId,
              QuoteRejectedType: this.EditForm.value.reason,
              //QuoteRejectedType:2, 
              //RejectedStatusType : 1
            }

            this.commonService.postHttpService(postData, "RRCustomerQuoteReject").subscribe(response => {
              if (response.status == true) {
                this.triggerEvent(response.responseData);
                this.modalRef.hide();
                Swal.fire({
                  title: 'Rejected!',
                  text: 'Customer Quote has been rejected.',
                  type: 'success'
                });
              } else {
                Swal.fire({
                  title: 'Cancelled',
                  text: 'Customer Quote has not rejected.',
                  type: 'error'
                });
              }
              this.cd_ref.detectChanges();
            }, error => console.log(error));
          }
        })
      } else {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, reject it!',
          cancelButtonText: 'No, cancel!',
          confirmButtonClass: 'btn btn-success mt-2',
          cancelButtonClass: 'btn btn-danger ml-2 mt-2',
          buttonsStyling: false
        }).then((result) => {
          if (result.value) {
            var postData = {
              MROId: this.MROId,
              RRVendorId: this.RRVendorId,
              QuoteId: this.QuoteId,
              QuoteRejectedType: this.EditForm.value.reason,
              //QuoteRejectedType:2, 
              //RejectedStatusType : 1
            }

            this.commonService.postHttpService(postData, "RejectMROCustomerQuote").subscribe(response => {
              if (response.status == true) {
                this.triggerEvent(response.responseData);
                this.modalRef.hide();
                Swal.fire({
                  title: 'Rejected!',
                  text: 'Customer Quote has been rejected.',
                  type: 'success'
                });
              } else {
                Swal.fire({
                  title: 'Cancelled',
                  text: 'Customer Quote has not rejected.',
                  type: 'error'
                });
              }
              this.cd_ref.detectChanges();
            }, error => console.log(error));
          }
        })
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
