/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { SoapserviceService } from "../../../../core/services/soapservice.service";
 import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { toArray } from 'rxjs/operators';
import * as xml2js from 'xml2js';
import { CommonService } from 'src/app/core/services/common.service';
@Component({
  selector: 'app-ups-soap',
  templateUrl: './ups-address.component.html',
  styleUrls: ['./ups-address.component.scss']
})
export class UpsAddressComponent implements OnInit {
  access = "0D90D48B4B528035";
  userid = "ahdshipping1";
  passwd = "American@2020";
  endpointurl = "https://wwwcie.ups.com/rest/AV";
  shipperNumber = "425597";
  Form:FormGroup;
  submitted=false;
  success: any;
  error: any;
  AddressValidationResult: any;

  constructor(private fb: FormBuilder, private soapserviceService: SoapserviceService, private http : HttpClient,private commonService: CommonService) {   }

  ngOnInit() {
    document.title='UPS Address Validation'

    this.Form = this.fb.group({
      ShipToName: ['Smartpoint Test To', Validators.required],
      ShipToAttentionName:['SP Test', Validators.required],
      ShipToAddressLine: ['GOERLITZER STR.1', Validators.required],
      ShipToCity: ['hamburg', Validators.required],
      ShipToStateCode: ['HH', Validators.required],
      ShipToPostalCode: ['20095', Validators.required],
      ShipToCountryCode: ['DE', Validators.required],
      ShipToNumber: ['9225377171', Validators.required]
    })
  }
    
  //get Form validation control
  get FormControl() {
    return this.Form.controls;
  }
  onSubmit(){
    this.submitted = true;
    // this.soapserviceService.postHttpServiceJson(this.post(this.Form.value),this.endpointurl,'').subscribe(
    //   (response: any) => {
      this.commonService.postHttpService(this.Form.value, "UPSAddressValidate").subscribe(response => {
        this.getResult(response.responseData);
        console.log(response.responseData);
      }, 
      (error: any) => {
          console.log(error)
      })
  }
  post(val){
    let postData ={
      "AccessRequest": {
          "AccessLicenseNumber": this.access,
          "UserId": this.userid,
          "Password": this.passwd
      },
      "AddressValidationRequest": {
          "Request": {
              "TransactionReference": {
                  "CustomerContext": "Address 1"
              },
              "RequestAction": "AV"
          },
          "Address": {
              "City": val.ShipToCity,
              "StateProvinceCode": val.ShipToStateCode,
              "PostalCode": val.ShipToPostalCode
          }
      }
  };
    console.log(postData);
    return postData;
  }
  getResult(val){
    if(!val.AddressValidationResponse.Response.Error){
      this.error = '';
      this.success = "Address is valid";
      this.AddressValidationResult = val.AddressValidationResponse.AddressValidationResult;
      console.log(this.AddressValidationResult);
    }else{
      this.success = '';
      this.error = val.AddressValidationResponse.Response.Error.ErrorDescription;
    }
  }
}
