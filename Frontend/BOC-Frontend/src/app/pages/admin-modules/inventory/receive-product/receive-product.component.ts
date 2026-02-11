import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";

import { cardData } from "./data";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
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
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-receive-product",
  templateUrl: "./receive-product.component.html",
  styleUrls: ["./receive-product.component.scss"],
})
export class ReceiveProductComponent implements OnInit {
  isCollapsed: boolean;
  public isOpen = false;

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
  AddForm: FormGroup;
  partItems: any = [];
  warehouseList: any[];
  WarehouseId = "";
  WarehouseSub1Id = "";
  WarehouseSub2Id = "";
  WarehouseSub3Id = "";
  WarehouseSub4Id = "";
  TransferNo = "";
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  constructor(
    private service: CommonService,
    private http: HttpClient,
    private fb: FormBuilder,
    public navCtrl: NgxNavigationWithDataComponent
  ) {
    this.AddForm = this.fb.group({
      PartItems: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.isCollapsed = false;
    this.dataTableMessage = "Loading...";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Inventory", path: "/" },
      { label: "List", path: "/", active: true },
    ];

    this.getWarehouseList();
    this.getWarehouseSub1List();
    this.getWarehouseSub2List();
    this.getWarehouseSub3List();
    this.getWarehouseSub4List();
  }

  getWarehouseList() {
    this.service
      .postHttpService(
        { UserId: localStorage.getItem("UserId") },
        "getWarehouseListByUserId"
      )
      .subscribe((response) => {
        this.warehouseList = response.responseData.map(function (value) {
          return { name: value.WarehouseName, id: value.WarehouseId };
        });
      });
  }

  getWarehouseSub1List() {
    this.service
      .getHttpService("getWarehouseSub1List")
      .subscribe((response) => {
        this.warehouse1List = response.responseData.map(function (value) {
          return { name: value.WarehouseSub1Name, id: value.WarehouseSub1Id };
        });
      });
  }

  getWarehouseSub2List() {
    this.service
      .getHttpService("getWarehouseSub2List")
      .subscribe((response) => {
        this.warehouse2List = response.responseData.map(function (value) {
          return { name: value.WarehouseSub2Name, id: value.WarehouseSub2Id };
        });
      });
  }

  getWarehouseSub3List() {
    this.service
      .getHttpService("getWarehouseSub3List")
      .subscribe((response) => {
        this.warehouse3List = response.responseData.map(function (value) {
          return { name: value.WarehouseSub3Name, id: value.WarehouseSub3Id };
        });
      });
  }

  getWarehouseSub4List() {
    this.service
      .getHttpService("getWarehouseSub4List")
      .subscribe((response) => {
        this.warehouse4List = response.responseData.map(function (value) {
          return { name: value.WarehouseSub4Name, id: value.WarehouseSub4Id };
        });
      });
  }

  onSubmit() {
    this.resetPartItemsList();
    this.service
      .postHttpService(
        { TransferNo: this.TransferNo },
        "GetProductByTransferNo"
      )
      .subscribe((response) => {
        this.partItems = response.responseData;
        this.addReference(this.partItems.length);

        this.AddForm.patchValue({
          PartItems: this.partItems.map((a) => {
            return {
              PartId: a.PartId,
              PartItemId: a.PartItemId,
              TransferId: a.TransferId,
              TransferItemId: a.TransferItemId,
              PartNo: a.PartNo,
              SerialNo: a.SerialNo,
              SellingPrice: a.SellingPrice,
              WarehouseId: this.WarehouseId,
              WarehouseSub1Id: this.WarehouseSub1Id,
              WarehouseSub2Id: this.WarehouseSub2Id,
              WarehouseSub3Id: this.WarehouseSub3Id,
              WarehouseSub4Id: this.WarehouseSub4Id,
            };
          }),
        });
      });
  }

  public addReference(qty = 1): void {
    const refArray = <FormArray>this.AddForm.controls.PartItems;
    for (let index = 0; index < qty; index++) {
      refArray.push(this.initReference());
    }
  }

  public resetPartItemsList(): void {
    const refArray = <FormArray>this.AddForm.controls.PartItems;
    refArray.clear();
  }

  public initReference(): FormGroup {
    return this.fb.group({
      PartId: [""],
      PartItemId: [""],
      TransferId: [""],
      TransferItemId: [""],
      PartNo: [""],
      SerialNo: [""],
      SellingPrice: ["", Validators.required],
      WarehouseId: ["", Validators.required],
      WarehouseSub1Id: ["", Validators.required],
      WarehouseSub2Id: ["", Validators.required],
      WarehouseSub3Id: ["", Validators.required],
      WarehouseSub4Id: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {}

  getFlag(country) {
    var flag =
      "assets/images/flags/" + country.toLowerCase().replace(" ", "_") + ".jpg";
    return flag;
  }

  receiveOne(idx) {
    var partItem = this.AddForm.value.PartItems[idx];
    var arrayControl = this.AddForm.get("PartItems") as FormArray;
    var item = arrayControl.at(idx);
    if (item.invalid) {
      item.markAllAsTouched();
      return;
    }
    if (partItem) {
      this.service
        .postHttpService(
          { InventoryReceivedItem: [partItem] },
          "CreateReceivedPrductByList"
        )
        .subscribe(
          (response) => {
            console.log(response, "response");

            if (response.status == true) {
              Swal.fire({
                title: "Success!",
                text: "Record saved Successfully!",
                type: "success",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
              // this.navCtrl.navigate('/admin/inventory/stockin-list');
            } else {
              Swal.fire({
                title: "Error!",
                text: "Record could not be saved!",
                type: "warning",
                confirmButtonClass: "btn btn-confirm mt-2",
              });
            }

            // this.cd_ref.detectChanges();
          },
          (error) => console.log(error)
        );
    }
  }

  receiveAll() {
    if (this.AddForm.invalid) {
      this.AddForm.markAllAsTouched();
      // this.markFormGroupTouched(this.AddForm);
      Swal.fire({
        title: "Error!",
        text: "Record could not be saved! Fill all required (*) fields!",
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
      return;
    }

    this.service
      .postHttpService(
        { InventoryReceivedItem: this.AddForm.value },
        "CreateReceivedPrductByList"
      )
      .subscribe(
        (response) => {
          console.log(response, "response");

          if (response.status == true) {
            Swal.fire({
              title: "Success!",
              text: "Record saved Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
            // this.navCtrl.navigate('/admin/inventory/stockin-list');
          } else {
            Swal.fire({
              title: "Error!",
              text: "Record could not be saved!",
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }

          // this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
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
}
