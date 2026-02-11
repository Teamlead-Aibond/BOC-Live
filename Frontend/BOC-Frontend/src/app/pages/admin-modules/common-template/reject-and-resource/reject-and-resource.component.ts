import { Component, OnInit, Inject, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  vendor_reject_reasons, 
  CONST_RRS_GENERATED, CONST_RRS_NEED_SOURCED, CONST_RRS_AWAIT_VQUOTE, CONST_RRS_NEED_RESOURCED, CONST_RRS_QUOTE_SUBMITTED,CONST_RRS_IN_PROGRESS,
  CONST_RRS_QUOTE_REJECTED, CONST_RRS_COMPLETED, CONST_RRS_NOT_REPAIRABLE, Const_Alert_pop_message, Const_Alert_pop_title,
 } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reject-and-resource',
  templateUrl: './reject-and-resource.component.html',
  styleUrls: ['./reject-and-resource.component.scss']
})
export class RejectAndResourceComponent implements OnInit {
  RRId;
  MROId;
  model: any = {}
  submitted = false;
  RRVendorId;
  VendorId;
  RRInfoStatus;
  reason;
  RRInfoVendorId;

  vendor_reject_reasons;

  // RR Status
  RRS_GENERATED       = CONST_RRS_GENERATED;       //0
  RRS_NEED_SOURCED    = CONST_RRS_NEED_SOURCED;    //1
  RRS_AWAIT_VQUOTE    = CONST_RRS_AWAIT_VQUOTE;    //2
  RRS_NEED_RESOURCED  = CONST_RRS_NEED_RESOURCED;  //3
  RRS_QUOTE_SUBMITTED = CONST_RRS_QUOTE_SUBMITTED; //4
  RRS_IN_PROGRESS     = CONST_RRS_IN_PROGRESS;     //5
  RRS_QUOTE_REJECTED  = CONST_RRS_QUOTE_REJECTED;  //6
  RRS_COMPLETED       = CONST_RRS_COMPLETED;       //7
  RRS_NOT_REPAIRABLE  = CONST_RRS_NOT_REPAIRABLE;  //8
    
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any, ) { }

  EditForm = this.fb.group({
    reason: ['', [Validators.required]]
  })

  ngOnInit(): void { 
    this.RRId = this.data.RRId;
    this.MROId = this.data.MROId
    this.RRVendorId = this.data.RRVendorId;
    this.VendorId = this.data.VendorId;
    this.RRInfoStatus = this.data.RRInfoStatus;
    this.RRInfoVendorId = this.data.RRInfoVendorId;

    this.vendor_reject_reasons = vendor_reject_reasons;
  }

  //get Form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    var reason = this.EditForm.value.reason; 
    // If the RRInfo Status is approved and the part is not repairable
    if(reason == 3 && this.RRInfoStatus == CONST_RRS_IN_PROGRESS && this.VendorId == this.RRInfoVendorId) {
      reason = 4;
    }

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
            RejectedStatus: reason
          }
          this.commonService.putHttpService(postData, "RRVendorQuoteReject").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: 'Rejected!',
                text: 'Vendor has been rejected.',
                type: 'success'
              });
            } else {
              Swal.fire({
                title: 'Cancelled',
                text: 'Vendor has not rejected.',
                type: 'error'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        }
      })
    }
    else{
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
            RejectedStatus: reason
          }
          this.commonService.putHttpService(postData, "MROVendorQuoteReject").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: 'Rejected!',
                text: 'Vendor has been rejected.',
                type: 'success'
              });
            } else {
              Swal.fire({
                title: 'Cancelled',
                text: 'Vendor has not rejected.',
                type: 'error'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        }
      })
    }
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
