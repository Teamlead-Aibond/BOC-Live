import { Component, OnDestroy, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { Subject } from "rxjs";
import { RFIDCheckResolver } from "src/app/core/resolvers/rfid.check.resolver";
import { CommonService } from "src/app/core/services/common.service";
import { BarcodePrintComponent } from "../../common-template/barcode-print/barcode-print.component";
import { InventoryData } from "./data";
import { Router } from "@angular/router";
@Component({
  selector: "app-inventory-view",
  templateUrl: "./inventory-view.component.html",
  styleUrls: ["./inventory-view.component.scss"],
})
export class InventoryViewComponent implements OnInit, OnDestroy {
  breadCrumbItems: Array<{}>;
  InventoryData;
  PartId: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  rfidEnabled: boolean = false;

  constructor(
    private service: CommonService,
    public navCtrl: NgxNavigationWithDataComponent,
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    private rFIDCheckResolver: RFIDCheckResolver,
    private router: Router
  ) {
    this.dtOptions = {
      columnDefs: [
        {
          targets: [1],
          visible: true,
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  ngOnInit() {
    this.rFIDCheckResolver.isEnabled$.subscribe(
      (enabled) => (this.rfidEnabled = enabled)
    );
    this.PartId = history.state.PartId;
    if (!this.PartId) {
      this.navCtrl.navigate("admin/inventory/list");
    } else {
      this.breadCrumbItems = [
        { label: "Aibond", path: "/" },
        { label: "Inventory", path: "/" },
        { label: "View", path: "/", active: true },
      ];
      // this.InventoryData = InventoryData;

      this.loadInventoryView(this.PartId);
    }
  }

  onBarcodeClick(PartNo, SerialNo) {
    if (PartNo) {
      this.modalRef = this.modalService.show(BarcodePrintComponent, {
        backdrop: "static",
        ignoreBackdropClick: false,
        initialState: {
          data: [{ PartNo, SerialNo }],
          class: "modal-lg",
        },
        class: "gray modal-lg",
      });

      this.modalRef.content.closeBtnName = "Close";
    }
  }

  onSaleQuoteClick(partId, partItemId, partNo) {
    var Type = "MRO";
    //  this.router.navigate(['admin/sales-quote/list'], { state: { PartId: partId, PartItemId: partItemId, Type: Type, PartNo: partNo } });
    this.router.navigate(["/admin/mro/add"], {
      state: {
        PartId: partId,
        PartItemId: partItemId,
        Type: Type,
        PartNo: partNo,
      },
    });
  }

  loadInventoryView(PartId: any) {
    this.service
      .postHttpService({ PartId }, "getInventoryView")
      .subscribe((response) => {
        this.InventoryData = response.responseData;

        if (response.responseData.dataItems.length > 0) {
          this.InventoryData.dataItems = response.responseData.dataItems.map(
            (a) => {
              return {
                ...a,
                selected: true,
              };
            }
          );
          this.dtTrigger.next();
        }
      });
  }

  checkChange(e, i) {
    this.InventoryData.dataItems[i].selected = e.target.checked;
  }

  isSame(el, index, arr) {
    if (index === 0) {
      return true;
    } else {
      return el.selected === arr[index - 1].selected;
    }
  }

  isAllChecked() {
    try {
      if (this.InventoryData.dataItems.length > 0)
        return this.InventoryData.dataItems.every(this.isSame);
      else return false;
    } catch (error) {
      return false;
    }
  }

  checkList(e) {
    this.InventoryData.dataItems.map((a) => (a.selected = e.target.checked));
  }

  printSelected() {
    this.modalRef = this.modalService.show(BarcodePrintComponent, {
      backdrop: "static",
      ignoreBackdropClick: false,
      initialState: {
        data: this.InventoryData.dataItems
          .filter((a) => a.selected)
          .map((d) => {
            return { PartNo: d.PartNo, SerialNo: d.SerialNo };
          }),
        class: "modal-lg",
      },
      class: "gray modal-lg",
    });

    this.modalRef.content.closeBtnName = "Close";
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
