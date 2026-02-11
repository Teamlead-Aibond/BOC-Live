/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject } from 'rxjs';
import { RFIDCheckResolver } from 'src/app/core/resolvers/rfid.check.resolver';
import { CommonService } from 'src/app/core/services/common.service';
import { InventoryData } from './data';
import { Router } from '@angular/router';
import { BarcodePrintComponent } from '../common-template/barcode-print/barcode-print.component';
import { CUSTOMER_GROUP_ID_FORD } from 'src/assets/data/dropdown';

@Component({
  selector: 'app-part-view',
  templateUrl: './part-view.component.html',
  styleUrls: ['./part-view.component.scss'],
  providers: [
    BsModalRef,
    BsModalService
  ]
})
export class PartViewComponent implements OnInit {
  // AddForm: FormGroup;
  vendorList: any[];
  manufacturerList: any[];
  partList: any[];
  submitted = false;
  warehouseList: any[];
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  ImagesList: any = [];
  Attachment;
  spinner: boolean = false;
  editMode: boolean = false;

  selectedRfid: string = "";
  PartId: any;
  statusFilterId: any;
  fileData: any;
  imageresult: any;
  rfidEnabled: boolean = false;

  viewResult;
  breadCrumbItems: Array<{}>;
  InventoryData;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  cd_ref: any;
  AddForm: any;
  IsNewOrRefurbished
  CurrencyList
  CurrencySymbol
  BaseCurrencySymbol
  IsEcommerceProduct: any;
  CustomerGroupId
  constructor(
    private service: CommonService,
    public navCtrl: NgxNavigationWithDataComponent,
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    private rFIDCheckResolver: RFIDCheckResolver,
    private router: Router,
  ) {
    this.dtOptions = {
      columnDefs: [
        {
          "targets": [1],
          "visible": true,
          "searchable": false,
          "orderable": false
        }]
    }
  }

  ngOnInit() {
    this.BaseCurrencySymbol =localStorage.getItem("BaseCurrencySymbol")

    this.PartId = history.state.PartId;
    this.viewResult = ""
    if (!this.PartId) {
      this.navCtrl.navigate('admin/total-PartsList');
    } else {
      this.loadInventoryView(this.PartId);
    }
  }
 
 


  onBarcodeClick(PartNo, SerialNo) {
    if (PartNo) {
      this.modalRef = this.modalService.show(BarcodePrintComponent,
        {
          backdrop: 'static',
          ignoreBackdropClick:false,
          initialState: {
            data: [{ PartNo, SerialNo }],
            class: 'modal-lg'
          }, class: 'gray modal-lg'
        });

      this.modalRef.content.closeBtnName = 'Close';
    }
  }

  
  loadInventoryView(PartId: any) {
    this.service.postHttpService({ PartId }, 'getInventoryView').subscribe(response => {
      this.viewResult = response.responseData.data;
      this.CustomerGroupId=this.viewResult.data.CustomerGroupId
      if(this.viewResult.IsNewOrRefurbished==2){
        this.IsNewOrRefurbished = "Yes"
      }else{
        this.IsNewOrRefurbished = "No"
      }
      this.IsEcommerceProduct = this.viewResult.IsEcommerceProduct;

      this.getCurrencyList();

      });
  }

  getCurrencyList() {
    this.service.getHttpService('Currencyddl').subscribe(response => {
      if (response.status == true) {
        this.CurrencyList = response.responseData;
        this.CurrencySymbol=this.CurrencyList.find(a=>a.CurrencyCode==this.viewResult.LocalCurrencyCode).CurrencySymbol

      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  
  printSelected() {
    this.modalRef = this.modalService.show(BarcodePrintComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick:false,
        initialState: {
          data: this.InventoryData.dataItems.filter(a => a.selected).map(d => { return { PartNo: d.PartNo, SerialNo: d.SerialNo } }),
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  onback() {
    if(this.IsEcommerceProduct == 1){
      if(this.CustomerGroupId==CUSTOMER_GROUP_ID_FORD){
        this.navCtrl.navigate('/admin/PartsList-fordstore');
      }else{
        this.navCtrl.navigate('/admin/PartsList-amazonstore');
      }
    }else{
      this.navCtrl.navigate('/admin/total-PartsList');
    }
  }
}
