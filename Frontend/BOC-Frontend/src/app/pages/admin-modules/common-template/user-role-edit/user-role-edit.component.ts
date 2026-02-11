import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-user-role-edit',
  templateUrl: './user-role-edit.component.html',
  styleUrls: ['./user-role-edit.component.scss']
})
export class UserRoleEditComponent implements OnInit {

  EditForm: FormGroup;
  submitted = false;
  index;
  result;
  RoleDescription;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.result = this.data.result;
    this.index = this.data.index;
    this.EditForm = this.fb.group({
      RoleId: ['', Validators.required],
      RoleName: ['', Validators.required],
      RoleDescription: ['']
    })

    //view content
    this.EditForm.setValue({
      RoleId: this.result.RoleId,
      RoleName: this.result.RoleName,
      RoleDescription: this.result.RoleDescription
    })
  }

  //get AddForm validation control
  get EditControl() {
    return this.EditForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.EditForm.valid) {
      var postData = {
        "RoleId": this.EditForm.value.RoleId,
        "RoleName": this.EditForm.value.RoleName,
        "RoleDescription": this.EditForm.value.RoleDescription
      }
      this.commonService.putHttpService(postData, "UserRoleEdit").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'User Role updated Successfully!',
            type: 'success',
            confirmButtonClass: 'btn btn-confirm mt-2'
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: response.message,
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

