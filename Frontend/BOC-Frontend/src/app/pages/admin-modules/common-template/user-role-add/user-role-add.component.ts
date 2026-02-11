import { Component, OnInit, ChangeDetectorRef, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Const_Alert_pop_message, Const_Alert_pop_title } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-user-role-add',
  templateUrl: './user-role-add.component.html',
  styleUrls: ['./user-role-add.component.scss']
})
export class UserRoleAddComponent implements OnInit {
    countryList;
  AddForm: FormGroup;
  submitted = false;
  RoleDescription;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any, ) { }

  ngOnInit(): void {
    this.AddForm = this.fb.group({
      RoleName: ['', Validators.required],
      RoleDescription: [''],
    })
  }


  //get AddForm validation control
  get AddControl() {
    return this.AddForm.controls;
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onSubmit() {
    this.submitted = true;
    if (this.AddForm.valid) {
      var postData = {
        RoleName: this.AddForm.value.RoleName,
        RoleDescription: this.AddForm.value.RoleDescription,
      }
      this.commonService.postHttpService(postData, "UserRoleAdd").subscribe(response => {
        if (response.status == true) {
          this.triggerEvent(response.responseData);
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'User Role added Successfully!',
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

}