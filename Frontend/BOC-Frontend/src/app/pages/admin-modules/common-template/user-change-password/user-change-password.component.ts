import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfirmedValidator } from 'src/app/core/services/confirmed.validator';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss']
})
export class UserChangePasswordComponent implements OnInit {
  index;
  result;
  public event: EventEmitter<any> = new EventEmitter();
  //Changepwd
  UserForm: FormGroup;
  submitted = false;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    private customValidator: CustomvalidationService,
    @Inject(BsModalRef) public data: any,) { }
  ngOnInit(): void {
    this.result = this.data.result;
    console.log(this.result)
    this.index = this.data.index;

    this.UserForm = this.fb.group({
      UserId: this.result.UserId,
      NewPassword: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      ConfirmPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmedValidator('NewPassword', 'ConfirmPassword')
      })
  }


  //get UserForm validation control
  get UserFormControl() {
    return this.UserForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.UserForm.valid) {

      var postData = {
        "UserId": this.result.UserId,
        "NewPassword": this.UserForm.value.NewPassword
      }

      this.commonService.putHttpService(postData, "changePasswordByAdmin").subscribe(response => {
        if (response.status == true) {
          this.modalRef.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Password Changed Successfully!',
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
    else {
      Swal.fire({
        type: 'error',
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: 'btn btn-confirm mt-2',
      });

    }
  }
}
