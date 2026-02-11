/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from "config";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { UserProfileService } from "src/app/core/services/user.service";
import { environment } from "src/environments/environment";
import { DOMAINS } from "src/app/core/consts/domain.consts";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-common-login",
  templateUrl: "./common-login.component.html",
  styleUrls: ["./common-login.component.scss"],
})
export class CommonLoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = "";
  loading = false;
  responseMessage: any;
  //logo;
  junologo;
  appName;
  year;
  juno: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private cd_ref: ChangeDetectorRef,
    public service: UserProfileService
  ) {}

  ngOnInit() {
    // this.logo = AppConfig.image_base_path + 'full_logo.png';
    this.juno = AppConfig.image_base_path + "juno_logo.png";
    this.appName = AppConfig.app_name;
    this.year = new Date().getFullYear();
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required],
      domain: ["", Validators.required],
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
  get f() {
    return this.loginForm.controls;
  }

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
    let domain = DOMAINS.find(
      (a) => a.domainName == this.f.domain.value.trim()
    );

    if (domain) {
      var postData = {
        username: this.f.username.value,
        password: this.f.password.value,
        domainId: this.f.domain.value.trim(),
      };

      //return window.location.href =  `${domain.frontEnd}/admin/dashboard/ah-dashboard`;

      this.service.commonSignin(domain.loginUrl, postData).subscribe(
        (response) => {
          // console.log("user sign in response : ", response);
          if (response.status == true) {
            window.location.href = decodeURIComponent(
              `${domain.frontEnd}/account/autologin?token=${response.responseData.login.accessToken}`
            );
            this.loading = false;
            // Swal.fire({
            //   position: 'top-end',
            //   type: 'success',
            //   title: 'Login Success!',
            //   showConfirmButton: false,
            //   timer: 1400
            // });
            // switch (response.responseData.login.IdentityType) {
            //   case 0: // admin
            //     //this.router.navigate([`${domain.frontEnd}/admin/dashboard/ah-dashboard`]);?Access-Token=${response.responseData.login.accessToken}
            //     window.location.href = `${domain.frontEnd}/admin/dashboard/ah-dashboard`
            //     return true;
            //     break;
            //   case 1: // customer
            //     this.router.navigate([`${domain.frontEnd}/customer/dashboard`]);
            //     break;
            //   case 2: // vendor
            //     this.router.navigate([`${domain.frontEnd}/vendor/dashboard`]);
            //     break;
            // }
          } else {
            this.loading = false;
            this.responseMessage = response.message;
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    } else {
      Swal.fire({
        title: "Error!",
        text: "Domain not found",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
      this.loading = false;
    }
  }
}
