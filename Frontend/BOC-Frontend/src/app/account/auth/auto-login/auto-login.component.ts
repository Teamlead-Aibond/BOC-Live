/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'config';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auto-login',
  templateUrl: './auto-login.component.html',
  styleUrls: ['./auto-login.component.scss']
})
export class AutoLoginComponent implements OnInit {
  AccessToken
  constructor(private route: ActivatedRoute, public service: UserProfileService,
    private cd_ref: ChangeDetectorRef, public router: Router
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(
      params => {
        this.AccessToken = params['token'];
        localStorage.setItem("Access-Token", this.AccessToken)
      }
    )

    this.getUserDetails();
  }




  getUserDetails() {
    var postData = {
      AccessToken: this.AccessToken,
    }

    //return window.location.href =  `${domain.frontEnd}/admin/dashboard/ah-dashboard`;

    this.service.commonautologin(postData).subscribe(response => {
      if (response.status == true) {
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

      }
      else {
        this.router.navigate(['/account/login'])
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }


}
