import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vq-attachment-assign',
  templateUrl: './vq-attachment-assign.component.html',
  styleUrls: ['./vq-attachment-assign.component.scss']
})
export class VQAttachmentAssignComponent implements OnInit {
  Form: FormGroup;
  submitted = false;
  adminList: any = []
  subStatusList: any = [];
  RRId: any;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.RRId = this.data.RRId;

    this.Form = this.fb.group({
      AssigneeUserId: [null, Validators.required],
      // SubStatusId: [null, Validators.required],
    })
    this.getAdminList()
    // this.getSubStatusList()
  }
  getSubStatusList() {
    this.commonService.getHttpService('RRSubStatusDDl').subscribe(response => {
      this.subStatusList = response.responseData;
    });
  }
  get FormControl() {
    return this.Form.controls;
  }
  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName , "UserId": value.UserId }
      });;
    });
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      var postData = {
        RRIds: this.RRId+",",
        // SubStatusId: this.Form.value.SubStatusId,
        AssigneeUserId: this.Form.value.AssigneeUserId
      }
      console.log(postData)
      this.commonService.postHttpService(postData, "BulkEditSubStatusAssignee").subscribe((res: any) => {
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
