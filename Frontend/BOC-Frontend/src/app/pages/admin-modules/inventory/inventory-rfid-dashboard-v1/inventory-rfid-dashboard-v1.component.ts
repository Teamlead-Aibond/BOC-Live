import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import { ReaderAction, ReaderId, ReaderZone, RfReader } from '../../rfid-integration/rfid-integration.metadata';
import { RfIdIntegrationService } from '../../rfid-integration/rfid-integration.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CheckInComponent } from '../check-in/check-in.component';
import { HttpClient } from '@angular/common/http';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-inventory-rfid-dashboard-v1',
  templateUrl: './inventory-rfid-dashboard-v1.component.html',
  styleUrls: ['./inventory-rfid-dashboard-v1.component.scss'],
  providers: [DatePipe]
})
export class InventoryRfidDashboardV1Component implements OnInit {

  today: any = new Date();

  breadCrumbItems: Array<{}>;
  defaultLocationImage = "assets\\images\\part-item-location\\00.jpg";
  partLocationImage: string = "";
  partLocationImageRFID: string = "";
  subscription: Subscription;
  intervalSubscription: Subscription;
  public intervalTimer = interval(6000);
  inProcess: boolean = false;
  PendingInventory: 0;
  TotalInventory: 0;
  CurrentInventory: 0;
  StockIn: 0;
  StockOut: 0;
  StartingInventory: any;

  lossPreventionResult: any[] = [];
  RFIDs: any;
  rfidExitGateReaderData: RfReader[] = [];

  rfidStockInReaderData: RfReader[] = [];
  rfidStockOutReaderData: RfReader[] = [];

  stockInReaderData: RfReader;
  stockOutReaderData: RfReader;
  updatedItems: Array<any>;

  // CheckIn State 
  subscriptionCheckInReady: Subscription;
  subscriptionCheckInConfirm: Subscription;
  epcLoadCheckInReady: RfReader[] = [];
  epcLoadCheckInConfirm: any[] = [];
  jsonDataCheckInReady;
  jsonDataCheckInConfirm;
  epcLoadCheckInList: any[] = []; // Hardik list to be compared

  // CheckOut State
  subscriptionCheckOutReady: Subscription;
  subscriptionCheckOutConfirm: Subscription;
  epcLoadCheckOutReady: RfReader[] = [];
  epcLoadCheckOutList: any[] = []; // Hardik list to be compared
  epcLoadCheckOutConfirm: string[] = [];
  epcLoadCheck: string[] = [];

  setPartImage(image, epc) {
    this.partLocationImage = image;
    this.partLocationImageRFID = epc;
  };

  constructor(
    public httpClient: HttpClient,
    public commonService: CommonService,
    public router: Router, private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe,
    public modalRef: BsModalRef, private modalService: BsModalService,
    public navCtrl: NgxNavigationWithDataComponent,
    private localStorageService: LocalStorageService
  ) {
    this.today = this.datePipe.transform(this.today, 'MM/dd/yyyy');
  }

  ngOnInit(): void {

    document.title = "RFID Dashboard";
    this.partLocationImage = this.defaultLocationImage;
    this.breadCrumbItems = [{ label: 'Aibond', path: '/' }, { label: 'Inventory', path: '/' }, { label: 'RFID Dashboard', path: '/', active: true }];
    this.getDashboardStats();
    this.getTempData();
    this.intervalSubscription = this.intervalTimer.subscribe(() => {
      if (this.inProcess) return;
      this.inProcess = true;
      this.getDashboardStats();
      this.getStockInUpdatedList();
      this.getStockOutUpdatedList(); // hardik calling for out list
    });

    /************************* CheckIn Process  *************************/
    let rfidSerIn = new RfIdIntegrationService(this.httpClient, this.commonService);
    rfidSerIn.startReaderData(ReaderId.mainStore, ReaderZone.stockIn);
    this.rfidStockInReaderData = rfidSerIn.readerManager.reader[ReaderId.mainStore].zones[ReaderZone.stockIn].readerData;
    let stockOutRecord, isPresent;

    /************************* CheckIOut Process  *************************/
    let rfidSerOut = new RfIdIntegrationService(this.httpClient, this.commonService);
    rfidSerOut.startReaderData(ReaderId.mainStore, ReaderZone.autoStockOut);
    this.rfidStockOutReaderData = rfidSerOut.readerManager.reader[ReaderId.mainStore].zones[ReaderZone.autoStockOut].readerData;

    this.subscriptionCheckInReady = rfidSerIn.readerManager.reader[ReaderId.mainStore].zones[ReaderZone.stockIn].readerActionStatus
      .subscribe(status => {
        if (status.action == ReaderAction.entry || status.action == ReaderAction.retain) { // Check the status
          let stockInRecord;
          status.actionTags.forEach((tag, i, arr) => {
            this.CheckRFIDTagExists(tag.tagInventoryEvent.epc).subscribe(async response => {
              if (response.responseData.status == false) {
                stockInRecord = JSON.parse(JSON.stringify(this.rfidStockInReaderData.find(a => a && a.tagInventoryEvent.epc === tag.tagInventoryEvent.epc)));
                stockInRecord.stockedIn = true;
                stockInRecord.locationStatus = response.responseData.inventoryLocationAvailable; //console.log('epcLoadCheckInReady', this.epcLoadCheckInReady)
                //stockInRecord.inventory.RFIDTagNo = tag.tagInventoryEvent.epc;
                // Check if tag exists
                if (!this.epcLoadCheckInReady.find(a => a.tagInventoryEvent.epc === tag.tagInventoryEvent.epc)) {
                  // Hardik check for outList Rentry
                  if (this.epcLoadCheckOutList.find(a => a.RFIDTagNo === tag.tagInventoryEvent.epc)) {
                    let existingRecord = JSON.parse(JSON.stringify(this.epcLoadCheckOutList.find(a => a.RFIDTagNo === tag.tagInventoryEvent.epc)));

                    stockInRecord.stockedInStatus = true;
                    stockInRecord.inventory = {
                      PartItemId: existingRecord.PartItemId,
                      PartId: existingRecord.PartId,
                      PartNo: existingRecord.PartNo,
                      SerialNo: existingRecord.SerialNo,
                      RRId: existingRecord.RRId,
                      RRNo: existingRecord.RRNo,
                      IsNew: existingRecord.IsNew,
                      StockOutId: existingRecord.StockOutId,
                      RFIDTagNo: existingRecord.RFIDTagNo,
                      RFIDEmployeeNo: existingRecord.RFIDEmployeeNo,
                      InventoryId: existingRecord.InventoryId, //mano
                      Status: "IN",
                      WarehouseId: 0,
                      WarehouseName: null,
                      WarehouseSub1Id: 0,
                      WarehouseSub1Name: null,
                      WarehouseSub2Id: 0,
                      WarehouseSub2Name: null,
                      WarehouseSub3Id: 0,
                      WarehouseSub3Name: null,
                      WarehouseSub4Id: 0,
                      WarehouseSub4Name: null
                    };
                    stockInRecord.locationStatus = 0;
                    stockInRecord.stockedOutStatus = false;

                    if (!stockInRecord.SerialNo) {
                      stockInRecord = await this.getPartSerialNo(stockInRecord);
                    }
                    if (!stockInRecord.PartNo) {
                      stockInRecord = await this.getPartNo(stockInRecord);
                    }

                    // todo save in stockin
                    // this.epcLoadCheckInReady.push(stockInRecord);


                    this.commonService.postHttpService(
                      stockInRecord.inventory,
                      "CreateInventoryQuery").subscribe(response1 => {
                        if (response1.status == true) {
                          const InventoryID = response1.responseData.InventoryId || null; //mano
                          if (InventoryID) stockInRecord.inventory.InventoryId = InventoryID; //mano
                          this.epcLoadCheckInReady.push(stockInRecord);
                          console.log('CreateInventoryQuery', stockInRecord)
                        } else {
                          console.log("Temp Table Error:", response1);
                        }
                        //this.inProcess = false;
                        //this.cd_ref.detectChanges();
                      }, error => {
                        //this.inProcess = false;
                        console.log(error);
                      });
                    return;
                  }
                  this.epcLoadCheckInReady.push(stockInRecord);

                  // Add the data in the temporary table
                  this.commonService.postHttpService(
                    [{
                      "RFIDTagNo": tag.tagInventoryEvent.epc,
                      "ReadyAntennaTime": stockInRecord.readyAntennaTime,
                      "AcceptAntennaTime": stockInRecord.acceptAntennaTime,
                      "StockInRecord": stockInRecord,
                      "StockOutRecord": stockOutRecord,
                      // "RRNo": stockInRecord.RRNo,
                      // "RRId": stockInRecord.RRId,
                      // "PartNo": stockInRecord.PartNo,
                      // "SerialNo": stockInRecord.SerialNo,
                      "RFIDEmployeeNo": tag.RFIDEmployeeNo
                    }],
                    "RFIDTempCreate").subscribe(response1 => {
                      if (response1.status == true) {
                        console.log('RFIDTempCreate', stockInRecord)
                      } else {
                        console.log("Temp Table Error:", response1);
                      }
                      //this.inProcess = false;
                      //this.cd_ref.detectChanges();
                    }, error => {
                      //this.inProcess = false;
                      console.log(error);
                    });
                  // }
                  // this.cd_ref.detectChanges();
                }
              }
            });
          })
        } else if (status.action == ReaderAction.exit) {
          if (status.actionTags.find(a => a.tagInventoryEvent.epc == this.partLocationImageRFID)) { // Need to update this
            this.partLocationImage = this.defaultLocationImage;
            this.partLocationImageRFID = "";
          }
        }
      });

    this.subscriptionCheckOutReady = rfidSerOut.readerManager.reader[ReaderId.mainStore].zones[ReaderZone.autoStockOut].readerActionStatus
      .subscribe(status1 => {
        if (status1.action == ReaderAction.entry || status1.action == ReaderAction.retain) {  // Check the status
          status1.actionTags.forEach((tag1, i, arr) => {
            console.log("tag1.tagInventoryEvent.epc before stockout check", tag1.tagInventoryEvent.epc)
            if (this.rfidStockOutReaderData && this.rfidStockOutReaderData.length > 0 && this.rfidStockOutReaderData.find(a => a.tagInventoryEvent.epc == tag1.tagInventoryEvent.epc).stockedOut != true) {
              console.log("tag1.tagInventoryEvent.epc after stockout check", tag1.tagInventoryEvent.epc)
              // this.CheckRFIDTagExists(tag1.tagInventoryEvent.epc).subscribe(response => {
              //   if (response.responseData.status == true && response.responseData.inventoryLocationAvailable == 1) {
              stockOutRecord = this.rfidStockOutReaderData.find(a => a.tagInventoryEvent.epc === tag1.tagInventoryEvent.epc);
              if (!this.epcLoadCheckOutReady.find(a => a.tagInventoryEvent.epc === tag1.tagInventoryEvent.epc)) {
                this.epcLoadCheckOutReady.push(stockOutRecord);
              }

              // Hardik
              let existingRecord;
              if (this.epcLoadCheckInList.find(a => a.RFIDTagNo === tag1.tagInventoryEvent.epc)) {
                existingRecord = this.epcLoadCheckInList.find(a => a.RFIDTagNo === tag1.tagInventoryEvent.epc);
              }

              this.commonService.postHttpService(
                [{
                  "RFIDTagNo": tag1.tagInventoryEvent.epc,
                  "ReadyAntennaTime": stockOutRecord.readyAntennaTime,
                  "AcceptAntennaTime": stockOutRecord.acceptAntennaTime,
                  "StockOutRecord": stockOutRecord,
                  "RFIDEmployeeNo": tag1.RFIDEmployeeNo,
                  "RRNo": existingRecord.RRNo, // Hardik
                  "RRId": existingRecord.RRId,  // Hardik
                  "PartId": existingRecord.PartId,  // Hardik
                  "InventoryId": existingRecord.InventoryId,  // Hardik
                  "PartItemId": existingRecord.PartItemId  // Hardik
                }],
                "AutoCheckout").subscribe(response => {

                  if (response.status == true) {
                    //TODO: Get dashboard stats from AutoCheckout
                    this.getDashboardStats();

                    // Clear the StockedIn entry
                    let checkedInRecord = this.epcLoadCheckInReady.find(a => a.tagInventoryEvent.epc === tag1.tagInventoryEvent.epc);
                    if (checkedInRecord) {
                      checkedInRecord.stockedIn = false;
                      checkedInRecord.stockedInStatus = false;
                    }

                    // Display the StockedOut entry
                    let checkedOutRecord = this.epcLoadCheckOutReady.find(a => a.tagInventoryEvent.epc === tag1.tagInventoryEvent.epc);
                    console.log("checkedOutRecord", tag1.tagInventoryEvent.epc, true)
                    if (checkedOutRecord) {
                      checkedOutRecord.stockedOut = true;
                    }
                    //stockOutRecord.stockedOut = true;

                    console.log('AutoCheckout', stockOutRecord)
                  } else {
                    console.log("Auto checkout error:", response);

                    //alert(  `Auto checkout error in the location doesn't exist in this ${existingRecord.RRNo}`)
                    Swal.fire({
                      title: 'Warning! - Item removed without location entry',
                      text: `The location doesn't exist for this ${existingRecord.RRNo} number`,
                      type: 'warning',
                      confirmButtonClass: 'btn btn-confirm mt-2'
                    });
                  }
                  this.inProcess = false;
                  this.cd_ref.detectChanges();
                }, error => {
                  this.inProcess = false;
                  console.log(error);
                });
              //   }
              // });
            } else {
              // check for stockedOut is true
            }
          })
        } else if (status1.action == ReaderAction.exit) {
          if (status1.actionTags.find(a => a.tagInventoryEvent.epc == this.partLocationImageRFID)) {
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
        this.TotalInventory = response.responseData.TotalInventory;
        this.PendingInventory = response.responseData.PendingInventory;
        this.CurrentInventory = response.responseData.CurrentInventory;
        this.inProcess = false;
      } else {
        this.inProcess = false;
      }
    })
  }

  getStockInUpdatedList() {
    this.commonService.getHttpService('getStockInUpdatedList').subscribe(response => {
      var record; //console.log('epcLoadCheckInReady' , this.epcLoadCheckInReady)
      if (response && response.responseData && response.responseData.length > 0) {
        response.responseData.forEach(e => {
          if (!this.epcLoadCheckOutList.find(a => a.RFIDTagNo === e.RFIDTagNo && a.InventoryId === e.InventoryId) && e.inventoryLocationAvailable == 1) {
            // let stockOutRecord = this.epcLoadCheckOutList.find(a => (a.RFIDTagNo === e.RFIDTagNo && a.InventoryId === e.InventoryId));
            record = this.epcLoadCheckInReady.find(a => a && a.tagInventoryEvent.epc === e.RFIDTagNo);
            if (record) {
              record.stockedInStatus = true;
              record['inventory']['WarehouseName'] = e.WarehouseName;
              record['inventory']['InventoryId'] = e.InventoryId;
              record['locationStatus'] = e.inventoryLocationAvailable;
              record['InventoryId'] = e.InventoryId;
              this.cd_ref.detectChanges();
              //   record.PartId = e.PartId;
              //   record.PartItemId = e.PartItemId;
            }
            // if (this.epcLoadCheckInReady.find(a => a.tagInventoryEvent.epc === e.RFIDTagNo)) { //console.log(e.RFIDTagNo)
            //   this.epcLoadCheckInReady.forEach(record => {
            //     if(record && record.tagInventoryEvent.epc === e.RFIDTagNo && record.locationStatus != 0) {
            //       if (record && e.InventoryId != stockOutRecord.InventoryId) {
            //         record.stockedInStatus = true;
            //         record['inventory']['WarehouseName'] = e.WarehouseName;
            //         record['locationStatus'] = e.inventoryLocationAvailable;
            //       }
            //     }
            //   });
            // }
          }
          // else if (this.epcLoadCheckInReady.find(a => a.tagInventoryEvent.epc === e.RFIDTagNo)) { //console.log(e.RFIDTagNo)
          //   record = this.epcLoadCheckInReady.find(a => a && a.tagInventoryEvent.epc === e.RFIDTagNo);
          //   if (record) {
          //     record.stockedInStatus = true;
          //     record.inventory.WarehouseName = e.WarehouseName;
          //     record.locationStatus = e.inventoryLocationAvailable;
          //   }
          // }

          // return record;
        });
        // Hardik set list of checkin into var
        this.epcLoadCheckInList = response.responseData;
      }
    });
  }

  // Hardik for getting list of the StockOut
  getStockOutUpdatedList() {
    this.commonService.getHttpService('getStockOutUpdatedList').subscribe(response => {
      if (response && response.responseData && response.responseData.length > 0) {
        this.epcLoadCheckOutList = response.responseData;
        // response.responseData.forEach(e => {
        //   if (this.epcLoadCheckOutReady.find(a => a.tagInventoryEvent.epc === e.RFIDTagNo)) { //console.log(e.RFIDTagNo)
        //     record = this.epcLoadCheckOutReady.find(a => a && a.tagInventoryEvent.epc === e.RFIDTagNo);
        //     if (record) {
        //       record.stockedInStatus = false;
        //       record.stockedOutStatus = true;
        //       record.inventory.WarehouseName = e.WarehouseName;
        //       record.locationStatus = e.inventoryLocationAvailable;
        //     }
        //   }
        // });
      }
    });
  }

  getTempData() {
    this.commonService.getHttpService("RFIDTempList").subscribe(response => {
      if (response.status == true) {
        response.responseData.forEach(e => {
          this.epcLoadCheckInReady.push(JSON.parse(e.StockInRecord))
        });
      } else {
        //this.inProcess = false;
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
            //console.log("createLossPreventionLog");
            this.commonService.postHttpService(e, "createLossPreventionLog").subscribe(response => { console.log(response) })
          } else {
            //console.log("StockOutSuccess");
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

    // CheckIn
    if (this.subscriptionCheckInReady)
      this.subscriptionCheckInReady.unsubscribe();
    if (this.subscriptionCheckInConfirm)
      this.subscriptionCheckInConfirm.unsubscribe();

    // CheckOut
    if (this.subscriptionCheckOutReady)
      this.subscriptionCheckOutReady.unsubscribe();
    if (this.subscriptionCheckOutConfirm)
      this.subscriptionCheckOutConfirm.unsubscribe();
  }

  checkIn(RFIDTagNo, RFIDEmployeeNo) {
    this.modalRef = this.modalService.show(CheckInComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { "RFIDTagNo": RFIDTagNo, "RFIDEmployeeNo": RFIDEmployeeNo },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      //console.log(res, "checkResponseParent")
      if (res.data.status == true) {
        var stockInEpc = this.epcLoadCheckInReady.find(a => a.tagInventoryEvent.epc === RFIDTagNo); //console.log(stockInEpc, "stockInEpc")
        stockInEpc.stockedInStatus = true;
        stockInEpc.locationStatus = res.data.responseData.inventoryLocationAvailable == 1 ? true : false;

        stockInEpc.inventory = {
          PartItemId: '',
          PartId: '',
          PartNo: '',
          SerialNo: '',
          RRId: '',
          RRNo: '',
          IsNew: '',
          StockOutId: '',
          RFIDTagNo: '',
          RFIDEmployeeNo: '',
          WarehouseId: '',
          WarehouseName: '',
          WarehouseSub1Id: '',
          WarehouseSub1Name: '',
          WarehouseSub2Id: '',
          WarehouseSub2Name: '',
          WarehouseSub3Id: '',
          WarehouseSub3Name: '',
          WarehouseSub4Id: '',
          WarehouseSub4Name: ''
        }
        stockInEpc.inventory.PartItemId = res.data.responseData.PartItem.PartItemId;
        stockInEpc.inventory.RRId = res.data.responseData.RRId;
        stockInEpc.inventory.RRNo = res.data.responseData.RRNo;
        stockInEpc.inventory.PartId = res.data.responseData.PartItem.PartId;
        stockInEpc.inventory.PartNo = res.data.responseData.PartItem.PartNo;
        stockInEpc.inventory.SerialNo = res.data.responseData.PartItem.SerialNo;
        stockInEpc.inventory.IsNew = res.data.responseData.PartItem.IsNew;
        stockInEpc.inventory.RFIDTagNo = res.data.responseData.PartItem.RFIDTagNo;
        stockInEpc.inventory.RFIDEmployeeNo = stockInEpc.RFIDEmployeeNo;

        stockInEpc.inventory.WarehouseId = res.data.responseData.PartItem.WarehouseId;
        stockInEpc.inventory.WarehouseName = res.data.responseData.PartItem.WarehouseName;
        stockInEpc.inventory.WarehouseSub1Id = res.data.responseData.PartItem.WarehouseSub1Id;
        stockInEpc.inventory.WarehouseSub1Name = res.data.responseData.PartItem.WarehouseSub1Name;
        stockInEpc.inventory.WarehouseSub2Id = res.data.responseData.PartItem.WarehouseSub2Id;
        stockInEpc.inventory.WarehouseSub2Name = res.data.responseData.PartItem.WarehouseSub2Name;
        stockInEpc.inventory.WarehouseSub3Id = res.data.responseData.PartItem.WarehouseSub3Id;
        stockInEpc.inventory.WarehouseSub3Name = res.data.responseData.PartItem.WarehouseSub3Name;
        stockInEpc.inventory.WarehouseSub4Id = res.data.responseData.PartItem.WarehouseSub4Id;
        stockInEpc.inventory.WarehouseSub4Name = res.data.responseData.PartItem.WarehouseSub4Name;
      }
    });
  }

  updateCheckIn(inventory) {
    this.modalRef = this.modalService.show(CheckInComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { inventory, type: 'Update' },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

  }

  CheckRFIDTagExists(epc): Observable<any> {
    var reqBody = { "RFIDTagNo": epc };
    return this.commonService.postHttpService(reqBody, "CheckRFIDTagExists").pipe();
  }

  clearCheckOutList() {
    this.epcLoadCheckOutReady.length = 0;
  }

  // hardik
  getPartNo(stockInRecord) {
    return new Promise((resolve, reject) => {
      this.commonService.postHttpService(
        { RRNo: stockInRecord.inventory.RRNo },
        "ViewPartNoByRRNo").subscribe(response12 => {
          if (response12.status == true) {
            let RRData = response12.responseData[0];
            if (RRData.PartNo) {
              stockInRecord.inventory.PartNo = RRData.PartNo;
            }
          } else {
            console.log("ViewPartItemById Error:", response12);
          }
          resolve(stockInRecord);
          this.cd_ref.detectChanges();
          //this.inProcess = false;
          //this.cd_ref.detectChanges();
        }, error => {
          //this.inProcess = false;
          this.cd_ref.detectChanges();
          resolve(stockInRecord);
          console.log(error);
        });
    });
  }

  // hardik
  getPartSerialNo(stockInRecord) {
    return new Promise((resolve, reject) => {
      this.commonService.postHttpService(
        { PartItemId: stockInRecord.inventory.PartItemId },
        "ViewPartItemById").subscribe(response1 => {
          if (response1.status == true) {
            let partItem = response1.responseData[0];
            if (partItem.SerialNo || partItem.IsNew) {
              stockInRecord.inventory.SerialNo = partItem.SerialNo;
              stockInRecord.inventory.IsNew = partItem.IsNew;
            }
          } else {
            console.log("ViewPartItemById Error:", response1);
          }
          resolve(stockInRecord);
          this.cd_ref.detectChanges();
          //this.inProcess = false;
          //this.cd_ref.detectChanges();
        }, error => {
          //this.inProcess = false;
          resolve(stockInRecord);
          this.cd_ref.detectChanges();
          console.log(error);
        });
    });
  }

}
