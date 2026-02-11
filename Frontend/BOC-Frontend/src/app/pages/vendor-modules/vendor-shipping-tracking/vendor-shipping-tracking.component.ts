
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-vendor-shipping-tracking',
  templateUrl: './vendor-shipping-tracking.component.html',
  styleUrls: ['./vendor-shipping-tracking.component.scss']
})
export class VendorShippingTrackingComponent implements OnInit {

    Form : FormGroup;
    submitted = false;
    upsTrackingData:any=[]
    constructor(
      private fb: FormBuilder,
      public router: Router,
      public navCtrl: NgxNavigationWithDataComponent,
      
      private commonService: CommonService,
      private cd_ref: ChangeDetectorRef,
     ) { }
    ngOnInit(): void {
      this.Form = this.fb.group({
        TrackingNo: ['', [Validators.required]],
  
      })
    }
  
  
     //get Form validation control
     get FormControl() {
      return this.Form.controls;
    }


    getDateTime(date: string, time: string) {
      //var date = moment(`${dateNumber}${timeNumber}`, 'YYYYMMDDHHMMSS');
      //var dt = '20191225';
      //var time = '140400';
      var y = Number(date.substring(0, 4));
      var m = Number(date.substring(4, 6));
      var d = Number(date.substring(6, 8));
  
      var h = Number(time.substring(0, 2));
      var mn = Number(time.substring(2, 4));
      var s = Number(time.substring(4, 6));
  
      var datetime = new Date(y, m - 1, d, h, mn, s);
  
      return datetime;
    }
  
  
    onSubmit(){
      this.submitted = true;
      var postData = {
        transId: '',
        transactionSrc: "AHOms",
        inquiryNumber: this.Form.value.TrackingNo
      }
      this.commonService.postHttpUPSService(postData, "getUPSTracking").subscribe(response => {
        this.upsTrackingData = response; 
      });
    }
  
  
  
}
