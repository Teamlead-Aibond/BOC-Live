import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, interval } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { RfReader, ReaderId, ReaderZone, ReaderAction } from '../../rfid-integration/rfid-integration.metadata';
import { RfIdIntegrationService } from '../../rfid-integration/rfid-integration.service';
import { CheckInComponent } from '../check-in/check-in.component';
import { CheckOutComponent } from '../check-out/check-out.component';

@Component({
  selector: 'app-inventory-rfid-v1',
  templateUrl: './inventory-rfid-v1.component.html',
  styleUrls: ['./inventory-rfid-v1.component.scss']
})
export class InventoryRfidV1Component implements OnInit {



  today: any = new Date();

  breadCrumbItems: Array<{}>;
  defaultLocationImage = "assets\\images\\part-item-location\\00.jpg";
  partLocationImage: string = "";
  partLocationImageRFID: string = "";
  subscription: Subscription;
  intervalSubscription: Subscription;
  public intervalTimer = interval(6000);
  inProcess: boolean = false;
  StockIn: 0;
  StockOut: 0;
  StartingInventory: any;

  lossPreventionResult: any[] = [];
  RFIDs: any;
  rfidExitGateReaderData: RfReader[] = [];
  epcLoadCheck: string[] = [];
  setPartImage(image, epc) {
    this.partLocationImage = image;
    this.partLocationImageRFID = epc;
  };



  constructor(
    public commonService: CommonService,
    public router: Router, private cd_ref: ChangeDetectorRef,
    public rfIdService: RfIdIntegrationService,
    private datePipe: DatePipe,
    public modalRef: BsModalRef, private modalService: BsModalService
  ) {
    this.today = this.datePipe.transform(this.today, 'MM/dd/yyyy');
  }

  ngOnInit(): void {
    this.partLocationImage = this.defaultLocationImage;
    this.breadCrumbItems = [{ label: 'Aibond', path: '/' }, { label: 'Inventory', path: '/' }, { label: 'RFID Dashboard', path: '/', active: true }];
    this.getDashboardStats();
    this.intervalSubscription = this.intervalTimer.subscribe(() => {
      if (this.inProcess) return;
      this.inProcess = true;
      this.getDashboardStats();
    });
    this.rfIdService.startReaderData(ReaderId.mainStore, ReaderZone.autoStockOut);
    this.rfidExitGateReaderData = this.rfIdService.readerManager.reader[ReaderId.mainStore].zones[ReaderZone.autoStockOut].readerData;

    this.subscription = this.rfIdService.readerManager.reader[ReaderId.mainStore].zones[ReaderZone.autoStockOut].readerActionStatus
      .subscribe(status => {
        // console.log("Reader Status:");
        // console.log(status);

        if (status.action == ReaderAction.entry || status.action == ReaderAction.retain) {
          status.actionTags.forEach((tag, i, arr) => {

            // if (!this.partLocationImage) {
            //   console.log(this.rfidExitGateReaderData)
            //   if (this.rfidExitGateReaderData[0] && this.rfidExitGateReaderData[0].inventory && this.rfidExitGateReaderData[0].inventory.WarehouseSub3LayoutImage) {
            //     this.partLocationImage = this.rfidExitGateReaderData[0].inventory.WarehouseSub3LayoutImage;
            //     this.partLocationImageRFID = this.rfidExitGateReaderData[0].tagInventoryEvent.epc;
            //   }
            // }

            if (tag.inventory && tag.inventory.StockOutId == 0) {

              if (!this.epcLoadCheck.includes(tag.tagInventoryEvent.epc)) {
                this.epcLoadCheck.push(tag.tagInventoryEvent.epc);
                this.commonService.postHttpService({ "RFIDTagNo": tag.tagInventoryEvent.epc }, "AutoCheckout").subscribe(response => {
                  this.epcLoadCheck = this.epcLoadCheck.filter(epc => epc !== tag.tagInventoryEvent.epc);
                  if (response.status == true) {

                    //TODO: Get dashboard stats from AutoCheckout
                    this.getDashboardStats();
                    this.rfidExitGateReaderData.find(a => a.tagInventoryEvent.epc == tag.tagInventoryEvent.epc).inventory.StockOutId = -1;
                    console.log("Auto checkout:", tag.tagInventoryEvent.epc);
                  }
                  else {
                    console.log("Auto checkout error:", response.responseData);
                  }
                  this.inProcess = false;
                  this.cd_ref.detectChanges();
                }, error => {
                  this.inProcess = false;
                  console.log(error);
                });
              }
            }
          })
        } else if (status.action == ReaderAction.exit) {
          if (status.actionTags.find(a => a.tagInventoryEvent.epc == this.partLocationImageRFID)) {
            this.partLocationImage = this.defaultLocationImage;
            this.partLocationImageRFID = "";
          }
        }
      });

    //this.showSuccess();
  }

  getDashboardStats() {
    this.commonService.postHttpService({}, "RFIDDashboardV1Statistics").subscribe(response => {
      if (response.status == true) {
        this.StockIn = response.responseData.StockIn;
        this.StockOut = response.responseData.StockOut;
        this.inProcess = false;
      } else {
        this.inProcess = false;
      }
    })
  }


  getStockoutListByRFIDs(epcs) {
    if (epcs.length <= 0) { this.inProcess = false; return; };

    var postData = {
      "RFIDTagNos": epcs
    }
    this.commonService.postHttpService(postData, "getPartstrackingByRFIdTagNos").subscribe(response => {
      if (response.status == true) {

        response.responseData.Parts.forEach(e => {

          if (e.StockOutId <= 0) {
            console.log("createLossPreventionLog");
            this.commonService.postHttpService(e, "createLossPreventionLog").subscribe(response => { console.log(response) })
          } else {
            console.log("StockOutSuccess");
            this.commonService.postHttpService({ StockOutId: e.StockOutId }, "StockOutSuccess").subscribe(response => { console.log(response) })
          }
          this.lossPreventionResult.push(e);


        });
      }
      else {
        // Swal.fire({
        //   title: 'Error!',
        //   text: response.responseData,
        //   type: 'warning',
        //   confirmButtonClass: 'btn btn-confirm mt-2'
        // });
      }
      this.inProcess = false;
      this.cd_ref.detectChanges();
    }, error => {
      this.inProcess = false;
      console.log(error);
    });
  }

  ngOnDestroy() {
    if (this.intervalSubscription)
      this.intervalSubscription.unsubscribe();
  }


  Checkin(PartNo, PartId, RFIDTagNo, SerialNo) {
    this.modalRef = this.modalService.show(CheckInComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { PartNo, PartId, RFIDTagNo, SerialNo },
          class: 'modal-lg wnn'
        }, class: 'gray modal-lg wnn'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
    });
  }

  Checkout(PartNo, PartId, RFIDTagNo, SerialNo, InventoryId) {
    this.modalRef = this.modalService.show(CheckOutComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { PartNo, PartId, RFIDTagNo, SerialNo, InventoryId },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
    });
  }
}


