import { Component, OnInit, Inject } from '@angular/core';
import { Tracking } from './ups-integration.metadata';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SoapserviceService } from 'src/app/core/services/soapservice.service';
import * as xml2js from 'xml2js';
@Component({
  selector: 'app-ups-integration',
  templateUrl: './ups-integration.component.html',
  styleUrls: ['./ups-integration.component.scss']
})
export class UpsIntegrationComponent implements OnInit {
  baseUrl = `${environment.api.apiURL}`;

  upsTrackingData: Tracking;
  transactionId: any;
  transactionSource: any;
  trackingNumber: any;


   //UPS Track varaible
   access = "0D90D48B4B528035";
   userid = "ahdshipping1";
   passwd = "American@2020";
   endpointurl = "https://wwwcie.ups.com/ups.app/xml/Void";
   endpointurlStatus = "https://wwwcie.ups.com/ups.app/xml/Track";
   shipperNumber = "425597";
   success: any;
   error: any;
   AddressValidationResult: any;
   xml: any;
   ShipmentIN: any;
   credentials: any;
  constructor( public modalRef: BsModalRef,
    private commonService: CommonService, private http: HttpClient,
    @Inject(BsModalRef) public data: any,private soapserviceService: SoapserviceService,
  ) { }

  ngOnInit(): void {
    // this.transactionId = this.data.PartId;
    // this.transactionSource = 'AHOms';
    // this.trackingNumber = this.data.trackingNumber;

    // this.trackConsignment();
    this.trackingNumber = this.data.trackingNumber;
    this.getTrackinfo(this.trackingNumber)

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

  trackConsignment() {
    var postData = {
      transId: this.transactionId,
      transactionSrc: this.transactionSource,
      inquiryNumber: this.trackingNumber
    }
    this.commonService.postHttpUPSService(postData, "getUPSTracking").subscribe(response => {
      this.upsTrackingData = response; 
    });

     /*this.upsIntegrationService.trackConsignment(this.transactionId, this.transactionSource, this.trackingNumber).subscribe(trackingData => {
      this.upsTrackingData = trackingData;
    }); */
  }


  getTrackinfo(trackingNumber){
    var postData={
      ShipmentIdentificationNumber: trackingNumber,
      CustomerContext: 'No need!'
    }
   
    const data = this.post(postData, 'Status');
    // this.soapserviceService.postHttpService(data, this.endpointurlStatus, '').subscribe(
    //     (response: any) => {
      this.commonService.postHttpService(postData, "UPSTrackLabel").subscribe(response => {
          const parser = new xml2js.Parser({ strict: true, trim: true });
          parser.parseString(response.responseData, (err, result) => {
            this.xml = result;
            this.getResult(this.xml, 'Status')
          });
          
        },
        (error: any) => {
          console.log(error)
        })
      
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
    // this.ShipmentIN = this.Form.value.ShipmentIdentificationNumber;
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
