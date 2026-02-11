import { Component, Inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-ups-label',
  templateUrl: './ups-label.component.html',
  styleUrls: ['./ups-label.component.scss']
})
export class UpsLabelComponent implements OnInit {
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
  xml: any;
  constructor(@Inject(BsModalRef) public data: any,public modalRef: BsModalRef,public service: CommonService,
  ) { }

  ngOnInit(): void {
    this.xml = this.data.result;
    this.getResult(this.xml)

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

  openImage(url){
    var image = new Image();
    image.src = "data:image/jpg;base64," + url
    var w = window.open("");
    w.document.write(image.outerHTML);
  }

  onPrint(url){   
    var image = new Image();
    image.src = "data:image/gif;base64," + url
    var w = window.open("");
    w.document.write(image.outerHTML);
    w.print()
  
  }
}
