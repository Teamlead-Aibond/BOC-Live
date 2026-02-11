import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rr-assignee-edit',
  templateUrl: './rr-assignee-edit.component.html',
  styleUrls: ['./rr-assignee-edit.component.scss']
})
export class RrAssigneeEditComponent implements OnInit {

  Form: FormGroup;
  AssigneeUserId;
  submitted = false;
  adminList: any = []
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.AssigneeUserId = this.data.AssigneeUserId
    this.Form = this.fb.group({
      RRId: this.data.RRId,
      AssigneeUserId: ['', Validators.required],
      SubStatusId:this.data.SubStatusId
    })
    this.getAdminList()
    this.Form.patchValue({
      AssigneeUserId: this.AssigneeUserId
    })
  }
  //get CountriesAddForm validation control
  get FormControl() {
    return this.Form.controls;
  }
  getAdminList() {
    this.commonService.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName , "UserId": value.UserId }
      });;;
    });
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.valid) {
      let body = { ...this.Form.value };
      this.commonService.postHttpService(body, "RRAssigneeEdit").subscribe((res: any) => {
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
