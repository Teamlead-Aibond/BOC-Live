/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomvalidationService } from 'src/app/core/services/customvalidation.service';
import Swal from 'sweetalert2';
import { ConfirmedValidator } from 'src/app/core/services/confirmed.validator';
import { Const_Alert_pop_title, Const_Alert_pop_message } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  UserForm : FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    
    private commonService: CommonService,
    private cd_ref: ChangeDetectorRef,
    private customValidator: CustomvalidationService) { }

    
  ngOnInit(): void {
    this.UserForm = this.fb.group({
      UserId: '',
      NewPassword: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      ConfirmPassword: ['', [Validators.required]],
      CurrentPassword: ['', [Validators.required]],
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
        "UserId":localStorage.getItem("UserId"),
        "CurrentPassword":this.UserForm.value.CurrentPassword,
        "NewPassword":this.UserForm.value.NewPassword
      }

      this.commonService.putHttpService(postData, "ChangePwdVendor").subscribe(response => {
        if (response.status == true) {
          Swal.fire({
            title: 'Success!',
            text: 'User Password Changed Successfully!',
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
