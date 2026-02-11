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
  templateUrl: './ups-cancel.component.html',
  styleUrls: ['./ups-cancel.component.scss']
})
export class UpsCancelComponent implements OnInit {
  access = "0D90D48B4B528035";
  userid = "ahdshipping1";
  passwd = "American@2020";
  endpointurl = "https://wwwcie.ups.com/ups.app/xml/Void";
  endpointurlStatus = "https://wwwcie.ups.com/ups.app/xml/Track";
  shipperNumber = "425597";
  Form:FormGroup;
  submitted=false;
  success: any;
  error: any;
  AddressValidationResult: any;
  xml: any;
  ShipmentIN: any;
  credentials: any;
  constructor(private fb: FormBuilder, private soapserviceService: SoapserviceService, private http : HttpClient, private commonService: CommonService) {   }

  ngOnInit() {
    document.title='UPS Tracking Cancel'

    this.Form = this.fb.group({
      ShipmentIdentificationNumber: ['1Z12345E0390817264', Validators.required],
      CustomerContext: ['No need!', Validators.required]
    })
  }
    
  //get Form validation control
  get FormControl() {
    return this.Form.controls;
  }
  onSubmit(pass){
    this.submitted = true;
      var url = '';
    if(pass == 'Void'){
      // this.soapserviceService.postHttpService(this.Form.value, url, '').subscribe(
      //   (response: any) => {
        this.commonService.postHttpService(this.Form.value, "UPSCancelLabel").subscribe(response => {
          const parser = new xml2js.Parser({ strict: true, trim: true });
          parser.parseString(response.responseData, (err, result) => {
            this.xml = result;
          });
          this.getResult(this.xml, pass)
          console.log(this.xml);
        },
        (error: any) => {
          console.log(error)
        })
    }else{
      // this.soapserviceService.postHttpService(this.Form.value, url, '').subscribe(
      //   (response: any) => {
        this.commonService.postHttpService(this.Form.value, "UPSTrackLabel").subscribe(response => {
          const parser = new xml2js.Parser({ strict: true, trim: true });
          parser.parseString(response.responseData, (err, result) => {
            this.xml = result;
          });
          this.getResult(this.xml, pass)
          console.log(this.xml);
        },
        (error: any) => {
          console.log(error)
        })
    }
    
    
  }
  post(val, pass){
    console.log(pass);
    let postData ='<?xml version="1.0" encoding="UTF-8"?>';
    if(pass == 'Void'){
      postData +='<AccessRequest xml:lang="en-US">';
      postData +='<AccessLicenseNumber>'+this.access+'</AccessLicenseNumber>';
      postData +='<UserId>'+this.userid+'</UserId>';
      postData +='<Password>'+this.passwd+'</Password>';
      postData +='</AccessRequest>';
      postData +='<?xml version="1.0" encoding="UTF-8"?>';
      postData +='<VoidShipmentRequest>';
      postData +='<Request>';
      postData +='<TransactionReference>';
      postData +='<CustomerContext>'+val.CustomerContext+'</CustomerContext>';
      postData +='<XpciVersion>1.0</XpciVersion>';
      postData +='</TransactionReference>';
      postData +='<RequestAction>1</RequestAction>';
      postData +='<RequestOption>1</RequestOption>';
      postData +='</Request>';
      postData +='<ShipmentIdentificationNumber>'+val.ShipmentIdentificationNumber+'</ShipmentIdentificationNumber>';
      postData +='</VoidShipmentRequest>';
    }else{
      postData +='<AccessRequest xml:lang="en-US">';
      postData +='<AccessLicenseNumber>'+this.access+'</AccessLicenseNumber>';
      postData +='<UserId>'+this.userid+'</UserId>';
      postData +='<Password>'+this.passwd+'</Password>';
      postData +='</AccessRequest>';
      postData +='<?xml version="1.0"?>';
      postData +='<TrackRequest xml:lang="en-US">';
      postData +='<Request>';
      postData +='<TransactionReference>';
      postData +='<CustomerContext>'+val.CustomerContext+'</CustomerContext>';
      postData +='</TransactionReference>';
      postData +='<RequestAction>Track</RequestAction>';
      postData +='<RequestOption>activity</RequestOption>';
      postData +='</Request>';
      postData +='<TrackingNumber>'+val.ShipmentIdentificationNumber+'</TrackingNumber>';
      postData +='</TrackRequest>';
    }
    console.log(postData);
    return postData;
  }
  getResult(val, pass){
    this.ShipmentIN = this.Form.value.ShipmentIdentificationNumber;
    if(pass == 'Void'){
      if(val['VoidShipmentResponse']['Response'][0]['ResponseStatusDescription'] == 'Success'){
        this.error = '';
        this.success = "Successfully canceld!";
      }else{
        this.success = '';
        this.error = val['VoidShipmentResponse']['Response'][0]['Error'][0]['ErrorDescription'];
      }
    }else{
      if(val['TrackResponse']['Response'][0]['ResponseStatusDescription'] == 'Success'){
        this.error = '';
        this.success = val['TrackResponse']['Shipment'][0]['Package'];
      }else{
        this.success = '';
        this.error = val['TrackResponse']['Response'][0]['Error'][0]['ErrorDescription'];
      }
    }
  }
}
