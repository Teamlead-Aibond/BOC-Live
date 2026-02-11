import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { Const_Alert_pop_message, Const_Alert_pop_title, mro_rejected_reason, } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rejected-mro',
  templateUrl: './rejected-mro.component.html',
  styleUrls: ['./rejected-mro.component.scss']
})
export class RejectedMroComponent implements OnInit {
  MROId;
  model: any = {}
  submitted = false;

  mro_rejected_reason;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  EditForm = this.fb.group({
    reason: ['', [Validators.required]],
    comments: ['']
  })
  ngOnInit(): void {

    this.MROId = this.data.MROId;
    this.mro_rejected_reason = mro_rejected_reason;
  }


  //get Form validation control
  get EditFormControl() {
    return this.EditForm.controls;
  }


  onSubmit() {
    this.submitted = true;


    if (this.EditForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, this MRO is Rejected!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success mt-2',
        cancelButtonClass: 'btn btn-danger ml-2 mt-2',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          var postData = {
            MROId: this.MROId,
            RejectedStatus: this.EditForm.value.reason,
            Comments: this.EditForm.value.comments
          }
          this.commonService.putHttpService(postData, "MRORejected").subscribe(response => {
            if (response.status == true) {
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
              Swal.fire({
                title: 'Rejected!',
                text: 'MRO is Rejected!',
                type: 'success'
              });
            } else {
              Swal.fire({
                title: 'Cancelled',
                text: 'MRO is Not Rejected!',
                type: 'error'
              });
            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        }
      })
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
