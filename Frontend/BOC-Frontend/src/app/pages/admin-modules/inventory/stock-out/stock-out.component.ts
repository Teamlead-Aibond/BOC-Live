import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";

import { cardData } from "./data";
import { DataTableDirective } from "angular-datatables";
import { interval, Subject, Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";

import pdfMake from "pdfmake/build/pdfmake.min.js";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from "sweetalert2";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbCalendar,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/core/services/common.service";
import { RfIdIntegrationService } from "../../rfid-integration/rfid-integration.service";
import {
  ReaderId,
  ReaderZone,
} from "../../rfid-integration/rfid-integration.metadata";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { RFIDCheckResolver } from "src/app/core/resolvers/rfid.check.resolver";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-stock-out",
  templateUrl: "./stock-out.component.html",
  styleUrls: ["./stock-out.component.scss"],
})
export class StockOutComponent implements OnInit, OnDestroy {
  isCollapsed: boolean;
  public isOpen = false;
  subscription: Subscription;
  intervalTimer = interval(3000);
  rfidEnabled: boolean = false;

  private _toggleWindow() {
    this.isOpen = !this.isOpen;
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];
  PartNo;
  RFIDTagNo;
  SerialNo;
  result: any = [];
  responseMessage;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,
    private cd_ref: ChangeDetectorRef,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    public rfIdService: RfIdIntegrationService,
    public navCtrl: NgxNavigationWithDataComponent,
    private rFIDCheckResolver: RFIDCheckResolver
  ) {}

  ngOnInit() {
    this.rFIDCheckResolver.isEnabled$.subscribe((enabled) => {
      this.rfidEnabled = enabled;
    });

    this.isCollapsed = false;
    this.dataTableMessage = "Loading...";
    // this.breadCrumbItems = [{ label: 'Aibond', path: '/' }, { label: 'Inventory', path: '/' }, { label: 'List', path: '/', active: true }];

    // Get Card Data
    this.cardData = cardData;

    this.result = [];
    this.dataTableMessage = "No data available.";
    this.dtTrigger.next();

    this.rfIdService.startReaderData(
      ReaderId.mainStore,
      ReaderZone.autoStockOut
    );
    this.result =
      this.rfIdService.readerManager.reader[ReaderId.mainStore].zones[
        ReaderZone.autoStockOut
      ].readerData;

    this.subscription = this.rfIdService.readerManager.reader[
      ReaderId.mainStore
    ].zones[ReaderZone.autoStockOut].readerActionStatus.subscribe((status) => {
      //console.log(this.result);
    });
  }

  reset() {
    this.result = [];
    this.rfIdService.resetReaderData(
      ReaderId.mainStore,
      ReaderZone.autoStockOut
    );
  }

  rowCheckChange(e, slno) {
    // InventoryId
    if (e) {
      let checkState = e.currentTarget.checked;
      this.result.find((a) => a.inventory.SerialNo == slno).inventory.checked =
        checkState;
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.subscription.unsubscribe();
  }

  getFlag(country) {
    var flag =
      "assets/images/flags/" + country.toLowerCase().replace(" ", "_") + ".jpg";
    return flag;
  }

  delete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: "Deleted!",
          text: "Inventory has been deleted.",
          type: "success",
        });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "Inventory  is safe :)",
          type: "error",
        });
      }
    });
  }

  onSearch() {
    var postData = {
      PartNo: this.PartNo,
      SerialNo: this.SerialNo,
    };
    this.commonService.postHttpService(postData, "getPartsTracking").subscribe(
      (response) => {
        if (response.status == true) {
          if (this.result.length == 0) {
            if (response.responseData.Parts.length > 0) {
              response.responseData.Parts.forEach((part) => {
                let disabled = part.StockOutId != 0;
                this.result.push({
                  inventory: {
                    ...part,
                    checked: !disabled,
                    disabled: disabled,
                  },
                });
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Part not found!!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
          } else {
            let exist = false;
            response.responseData.Parts.forEach((part) => {
              var prevRes = this.result.find(
                (a) => a.inventory.SerialNo == part.SerialNo
              );
              if (!prevRes) {
                let disabled = part.StockOutId != 0;
                this.result.push({
                  inventory: {
                    ...part,
                    checked: !disabled,
                    disabled: disabled,
                  },
                });
              } else {
                exist = true;
              }
            });

            if (exist) {
              Swal.fire({
                title: "Error!",
                text: "Some part(s) are already added!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }
          }
        } else {
          Swal.fire({
            title: "Error!",
            text: response.responseData,
            type: "warning",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  onStockOut() {
    let stockOutList = this.result.filter((a) => a.inventory.checked);
    if (stockOutList.length > 0) {
      var postData = {
        InventoryStockOutList: stockOutList.map((a) => a.inventory),
        rfidEnabled: this.rfidEnabled,
      };
      this.commonService.postHttpService(postData, "AddStactout").subscribe(
        (response) => {
          if (response.status == true) {
            Swal.fire({
              title: "Success!",
              text: "Stockout Created Successfully!",
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });

            this.navCtrl.navigate("admin/inventory/stockout-list");
          } else {
            Swal.fire({
              title: "Error!",
              text: response.message
                ? response.message
                : "Stockout could not be Created!",
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    } else {
      Swal.fire({
        title: "Error!",
        text: "Select at least one record to stockout!",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
}
