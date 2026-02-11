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
  templateUrl: './ups-soap.component.html',
  styleUrls: ['./ups-soap.component.scss']
})
export class UpsSoapComponent implements OnInit {
  access = "0D90D48B4B528035";
  userid = "ahdshipping1";
  passwd = "American@2020";
  // wsdl = "http://localhost/Shipping_Pkg/ShippingPACKAGE/PACKAGEWebServices/SCHEMA-WSDLs/Ship.wsdl";
  wsdl = "assets/xml/Ship-copy.wsdl";
  operation = "ProcessShipment";
  endpointurl = "https://wwwcie.ups.com/webservices/Ship";
  outputFileName = "XOLTResult.xml";
  outputFileNameJson = "XOLTResult.json";
  shipperNumber = "425597";
  shipRequestOption = "nonvalidate";
  shipDescription = "This is sample description";
  shipperName = 'ShipperName';
  shipperAttentionName = 'ShipperZs Attn Name';
  shipperTaxIdentificationNumber = '123456';
  shipperAddressLine = '2311 York Rd';
  shipperCity = 'Timonium';
  shipperStateProvinceCode = 'MD';
  shipperPostalCode = '21093';
  shipperCountryCode = 'US';
  shipperPhoneNumber = '1115554758';
  shipperPhoneExtension = '1';

  usernameToken: any = [];
  serviceAccessLicense: any = [];
  upss: any = [];
  requestoption: any = [];
  request: any = [];
  shipment: any = [];
  ProcessShipment: any = "ProcessShipment";
  shipper: any = [];
  address: any = [];
  phone: any = [];
  shipto: any = [];
  addressTo: any = [];
  phone2: any = [];
  shipfrom: any = [];
  addressFrom: any = [];

  phone3: any = [];
  shipmentcharge: any = [];
  creditcard: any = [];
  creditCardAddress: any = [];
  billshipper: any = [];
  paymentinformation: any = [];
  service: any = [];

  internationalForm: any = [];
  soldTo: any = [];
  soldToPhone: any = [];
  soldToAddress: any = [];
  contact: any = [];
  product: any = [];
  unitProduct: any = [];

  uom: any = [];
  productWeight: any = [];
  uomForWeight: any = [];
  discount: any = [];
  freight: any = [];
  insurance: any = [];

  otherCharges: any = [];
  shpServiceOptions: any = [];
  package: any = [];
  packaging: any = [];
  unit: any = [];
  dimensions: any = [];
  unit2: any = [];
  packageweight: any = [];
  labelimageformat: any = [];
  labelspecification: any = [];
  resp: any = [];
  responsess: any;
  xml: any;

  ups_gif_image: any;
  ups_html_image: any;
  ups_html_image_decode: any;
  ups_status: any;
  ups_tracking_number: any;
  ups_trans_code: any;
  ups_trans_value: any;
  ups_service_value: any;
  ups_service_code: any;
  ups_total_value: any;
  ups_total_code: any;
  ups_unit_code: any;
  ups_unit_des: any;
  ups_unit_weight: any;
  error: any;
  // gifImage: any;
  Form:FormGroup
  submitted=false
  constructor(private fb: FormBuilder, private soapserviceService: SoapserviceService, private http : HttpClient,private commonService: CommonService) {   }

  ngOnInit() {
    document.title='UPS Label Generate'

    this.Form = this.fb.group({
      ShipToName: ['Smartpoint Test To', Validators.required],
      ShipToAttentionName: ['SP Test', Validators.required],
      ShipToAddressLine: ['GOERLITZER STR.1', Validators.required],
      ShipToCity: ['hamburg', Validators.required],
      ShipToStateCode: ['HH', Validators.required],
      ShipToPostalCode: ['20095', Validators.required],
      ShipToCountryCode: ['DE', Validators.required],
      ShipToNumber: ['9225377171', Validators.required],

      ShipFromName: ['Smartpoint Test From', Validators.required],
      ShipFromAttentionName: ['SP Test', Validators.required],
      ShipFromAddressLine: ['2311 York Rd', Validators.required],
      ShipFromCity: ['Timonium', Validators.required],
      ShipFromStateCode: ['MD', Validators.required],
      ShipFromPostalCode: ['21093', Validators.required],
      ShipFromCountryCode: ['US', Validators.required],
      ShipFromNumber: ['1234567890', Validators.required],
      Weight: ['10', Validators.required],
    })
  }
    


  //get Form validation control
  get FormControl() {
    return this.Form.controls;
  }
  onSubmit() {
    this.submitted = true;
    // this.soapserviceService.postHttpService(this.post(this.Form.value), this.endpointurl, '').subscribe(
    //   (response: any) => {
      this.commonService.postHttpService(this.Form.value, "UPSGenerateLabel").subscribe(response => {
        const parser = new xml2js.Parser({ strict: true, trim: true });
        parser.parseString(response.responseData, (err, result) => {
          this.xml = result;
        });
        this.getResult(this.xml)
      },
      (error: any) => {
        console.log(error)
      })
  }
  post(val) {
    let postData = '<?xml version="1.0" encoding="UTF-8"?>';
    postData += '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://www.ups.com/XMLSchema/XOLTWS/Common/v1.0" xmlns:ns2="http://www.ups.com/XMLSchema/XOLTWS/Ship/v1.0" xmlns:ns3="http://www.ups.com/XMLSchema/XOLTWS/UPSS/v1.0">';
    postData += '<SOAP-ENV:Header>';
    postData += '<ns3:UPSSecurity>';
    postData += '<ns3:UsernameToken>';
    postData += '<ns3:Username>'+this.userid+'</ns3:Username>';
    postData += '<ns3:Password>'+this.passwd+'</ns3:Password>';
    postData += '</ns3:UsernameToken>';
    postData += '<ns3:ServiceAccessToken>';
    postData += '<ns3:AccessLicenseNumber>'+this.access+'</ns3:AccessLicenseNumber>';
    postData += '</ns3:ServiceAccessToken>';
    postData += '</ns3:UPSSecurity>';
    postData += '</SOAP-ENV:Header>';
    postData += '<SOAP-ENV:Body>';
    postData += '<ns2:ShipmentRequest>';
    postData += '<ns1:Request>';
    postData += '<ns1:RequestOption>'+this.shipRequestOption+'</ns1:RequestOption>';
    postData += '</ns1:Request>';
    postData += '<ns2:Shipment>';
    postData += '<ns2:Description>'+this.shipDescription+'</ns2:Description>';
    postData += '<ns2:Shipper>';
    postData += '<ns2:Name>'+this.shipperName+'</ns2:Name>';
    postData += '<ns2:AttentionName>'+this.shipperAttentionName+'</ns2:AttentionName>';
    postData += '<ns2:TaxIdentificationNumber>'+this.shipperTaxIdentificationNumber+'</ns2:TaxIdentificationNumber>';
    postData += '<ns2:Phone>';
    postData += '<ns2:Number>'+this.shipperPhoneNumber+'</ns2:Number>';
    postData += '<ns2:Extension>'+this.shipperPhoneExtension+'</ns2:Extension>';
    postData += '</ns2:Phone>';
    postData += '<ns2:ShipperNumber>'+this.shipperNumber+'</ns2:ShipperNumber>';
    postData += '<ns2:Address>';
    postData += '<ns2:AddressLine>'+this.shipperAddressLine+'</ns2:AddressLine>';
    postData += '<ns2:City>'+this.shipperCity+'</ns2:City>';
    postData += '<ns2:StateProvinceCode>'+this.shipperStateProvinceCode+'</ns2:StateProvinceCode>';
    postData += '<ns2:PostalCode>'+this.shipperPostalCode+'</ns2:PostalCode>';
    postData += '<ns2:CountryCode>'+this.shipperCountryCode+'</ns2:CountryCode>';
    postData += '</ns2:Address>';
    postData += '</ns2:Shipper>';
    postData += '<ns2:ShipTo>';
    postData += '<ns2:Name>' + val.ShipToName + '</ns2:Name>';
    postData += '<ns2:AttentionName>' + val.ShipToAttentionName + '</ns2:AttentionName>';
    postData += '<ns2:Phone>';
    postData += '<ns2:Number>' + val.ShipToNumber + '</ns2:Number>';
    postData += '</ns2:Phone>';
    postData += '<ns2:Address>';
    postData += '<ns2:AddressLine>' + val.ShipToAddressLine + '</ns2:AddressLine>';
    postData += '<ns2:City>' + val.ShipToCity + '</ns2:City>';
    postData += '<ns2:StateProvinceCode>' + val.ShipToStateCode + '</ns2:StateProvinceCode>';
    postData += '<ns2:PostalCode>' + val.ShipToPostalCode + '</ns2:PostalCode>';
    postData += '<ns2:CountryCode>' + val.ShipToCountryCode + '</ns2:CountryCode>';
    postData += '</ns2:Address>';
    postData += '</ns2:ShipTo>';
    postData += '<ns2:ShipFrom>';
    postData += '<ns2:Name>' + val.ShipFromName + '</ns2:Name>';
    postData += '<ns2:AttentionName>' + val.ShipFromAttentionName + '</ns2:AttentionName>';
    postData += '<ns2:Phone>';
    postData += '<ns2:Number>' + val.ShipFromNumber + '</ns2:Number>';
    postData += '</ns2:Phone>';
    postData += '<ns2:Address>';
    postData += '<ns2:AddressLine>' + val.ShipFromAddressLine + '</ns2:AddressLine>';
    postData += '<ns2:City>' + val.ShipFromCity + '</ns2:City>';
    postData += '<ns2:StateProvinceCode>' + val.ShipFromStateCode + '</ns2:StateProvinceCode>';
    postData += '<ns2:PostalCode>' + val.ShipFromPostalCode + '</ns2:PostalCode>';
    postData += '<ns2:CountryCode>' + val.ShipFromCountryCode + '</ns2:CountryCode>';
    postData += '</ns2:Address>';
    postData += '</ns2:ShipFrom>';
    postData += '<ns2:PaymentInformation>';
    postData += '<ns2:ShipmentCharge>';
    postData += '<ns2:Type>01</ns2:Type>';
    postData += '<ns2:BillShipper>';
    postData += '<ns2:AccountNumber>425597</ns2:AccountNumber>';
    postData += '</ns2:BillShipper>';
    postData += '</ns2:ShipmentCharge>';
    postData += '</ns2:PaymentInformation>';
    postData += '<ns2:Service>';
    postData += '<ns2:Code>08</ns2:Code>';
    postData += '<ns2:Description>Expedited</ns2:Description>';
    postData += '</ns2:Service>';
    postData += '<ns2:Package>';
    postData += '<ns2:Description></ns2:Description>';
    postData += '<ns2:Packaging>';
    postData += '<ns2:Code>02</ns2:Code>';
    postData += '<ns2:Description>Nails</ns2:Description>';
    postData += '</ns2:Packaging>';
    // postData += '<ns2:Dimensions>';
    // postData += '<ns2:UnitOfMeasurement>';
    // postData += '<ns2:Code>IN</ns2:Code>';
    // postData += '<ns2:Description>Inches</ns2:Description>';
    // postData += '</ns2:UnitOfMeasurement>';
    // postData += '<ns2:Length>7</ns2:Length>';
    // postData += '<ns2:Width>5</ns2:Width>';
    // postData += '<ns2:Height>2</ns2:Height>';
    // postData += '</ns2:Dimensions>';
    postData += '<ns2:PackageWeight>';
    postData += '<ns2:UnitOfMeasurement>';
    postData += '<ns2:Code>LBS</ns2:Code>';
    postData += '<ns2:Description>Pounds</ns2:Description>';
    postData += '</ns2:UnitOfMeasurement>';
    postData += '<ns2:Weight>' + val.Weight + '</ns2:Weight>';
    postData += '</ns2:PackageWeight>';
    postData += '</ns2:Package>';
    postData += '</ns2:Shipment>';
    postData += '</ns2:ShipmentRequest>';
    postData += '</SOAP-ENV:Body>';
    postData += '</SOAP-ENV:Envelope>';
    console.log(postData);
    return postData;
  }
  getResult(val) {
    if (val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse']) {
      this.error = '';
      this.ups_status = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['common:Response'][0]['common:ResponseStatus'][0]['common:Description'][0];
      this.ups_tracking_number = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentIdentificationNumber'][0];

      this.ups_gif_image = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:PackageResults'][0]['ship:ShippingLabel'][0]['ship:GraphicImage'][0];
      this.ups_html_image = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:PackageResults'][0]['ship:ShippingLabel'][0]['ship:HTMLImage'][0];
      // this.ups_html_image_decode = atob(this.ups_html_image); 
      this.ups_trans_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TransportationCharges'][0]['ship:CurrencyCode'][0];
      this.ups_trans_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TransportationCharges'][0]['ship:MonetaryValue'][0];

      this.ups_service_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:ServiceOptionsCharges'][0]['ship:CurrencyCode'][0];
      this.ups_service_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:ServiceOptionsCharges'][0]['ship:MonetaryValue'][0];

      this.ups_total_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TotalCharges'][0]['ship:CurrencyCode'][0];
      this.ups_total_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TotalCharges'][0]['ship:MonetaryValue'][0];

      this.ups_unit_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:UnitOfMeasurement'][0]['ship:Code'][0];
      this.ups_unit_des = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:UnitOfMeasurement'][0]['ship:Description'][0];
      this.ups_unit_weight = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:Weight'][0];
    } else {
      this.ups_status = 'fail';
      this.ups_gif_image = '';
      this.error = val['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault'][0]['detail'][0]['err:Errors'][0]['err:ErrorDetail'][0]['err:PrimaryErrorCode'][0]['err:Description'][0];
    }
  }

}
