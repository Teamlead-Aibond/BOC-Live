/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { AppConfig } from 'config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';
  loading = false;
  responseMessage: any;
  logo;
  appName;
  year;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authenticationService: AuthenticationService,
    private cd_ref: ChangeDetectorRef,
    public service: UserProfileService) { }

  ngOnInit() {
    this.logo = AppConfig.image_base_path + 'full_logo.png';
    this.appName = AppConfig.app_name;
    this.year = (new Date()).getFullYear();
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // console.log(this.returnUrl)
  }

  ngAfterViewInit() {
    // document.body.classList.add('authentication-bg');
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * On submit form
   */
  // onSubmit() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //     return;
  //   }

  //   this.loading = true;
  //   this.authenticationService.login(this.f.email.value, this.f.password.value)
  //     .pipe(first())
  //     .subscribe(
  //       data => {
  //         this.router.navigate([this.returnUrl]);
  //       },
  //       error => {
  //         this.error = error;
  //         this.loading = false;
  //       });
  // }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    var postData = {
      username: this.f.username.value,
      password: this.f.password.value,
    }
    this.service.postSignin(postData).subscribe(response => {
      // console.log("user sign in response : ", response);
      if (response.status == true) {
        this.loading = false;
        localStorage.setItem('workchainAlert', '0'); 
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Login Success!',
          showConfirmButton: false,
          timer: 1400
        });
        switch (response.responseData.login.IdentityType) {
          case 0: // admin            
            this.router.navigate([AppConfig.dashboardLink]);
            break;
          case 1: // customer              
            this.router.navigate(["/customer/dashboard"]);
            break;
          case 2: // vendor              
            this.router.navigate(["/vendor/dashboard"]);
            break;
        }
      } else {
        this.loading = false;
        this.responseMessage = response.message;
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
}
