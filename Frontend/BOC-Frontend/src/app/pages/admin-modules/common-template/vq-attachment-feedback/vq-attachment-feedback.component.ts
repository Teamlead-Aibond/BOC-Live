import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vq-attachment-feedback',
  templateUrl: './vq-attachment-feedback.component.html',
  styleUrls: ['./vq-attachment-feedback.component.scss']
})
export class VQAttachmentFeedbackComponent implements OnInit {
  Form: FormGroup;
  submitted = false;
  adminList: any = []
  subStatusList: any = [];
  model: any = {};
  RRId: any;
  VQId: any;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.Form = this.fb.group({
      ApproverFeedback: ['', Validators.required]
    })
    console.log(this.data);
    this.RRId = this.data.RRId;
    this.VQId = this.data.Id;
    this.model.ApproverFeedback = this.data.ApproverFeedback;
    this.patchValue();
    // this.getAdminList()
    // this.getSubStatusList()
  }

  patchValue(){
    console.log(this.data.ApproverFeedback);
    this.Form.patchValue({ "ApproverFeedback": this.data.ApproverFeedback })
  }
  
  get FormControl() {
    return this.Form.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      var postData = {
        VQAttachmentId: this.VQId,
        ApproverFeedback: this.Form.value.ApproverFeedback
      }
      console.log(postData)
      this.commonService.postHttpService(postData, "VendorQuoteAttachmentFeedbackUpdate").subscribe((res: any) => {
        if (res.status == true) {
          this.triggerEvent(res.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Record Updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {

        }
        this.cd_ref.detectChanges();
      }, error => console.log(error));
    }
  }
}
