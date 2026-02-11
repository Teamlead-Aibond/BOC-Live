import { Component, OnInit, Inject, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  not_repairable_reasons, 
  CONST_RRS_GENERATED, CONST_RRS_NEED_SOURCED, CONST_RRS_AWAIT_VQUOTE, CONST_RRS_NEED_RESOURCED, CONST_RRS_QUOTE_SUBMITTED,CONST_RRS_IN_PROGRESS,
  CONST_RRS_QUOTE_REJECTED, CONST_RRS_COMPLETED, CONST_RRS_NOT_REPAIRABLE, Const_Alert_pop_message, Const_Alert_pop_title,
 } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rr-not-repairable',
  templateUrl: './rr-not-repairable.component.html',
  styleUrls: ['./rr-not-repairable.component.scss']
})
export class RrNotRepairableComponent implements OnInit {
  RRId;
  model: any = {}
  submitted = false;
  RRVendorId;
  VendorId;
  RRInfoStatus;
  reason;
  RRInfoVendorId;

  not_repairable_reasons;

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

    this.not_repairable_reasons = not_repairable_reasons;
  }

  //get Form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    var reason = this.EditForm.value.reason; 

    if (this.EditForm.valid) {      
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, this part is Not Repairable!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ml-2 mt-2',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          var postData = {
            RRId: this.RRId,
            RejectedStatus: this.EditForm.value.reason
          }
          this.commonService.putHttpService(postData, "RRNotRepairable").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: 'Not Repairable!',
                text: 'The Part is not Repairable!',
                type: 'success'
              });
            } else {
              Swal.fire({
                title: 'Cancelled',
                text: 'The Part is Repairable!',
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
