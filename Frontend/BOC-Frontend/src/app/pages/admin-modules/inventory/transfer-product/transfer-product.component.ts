import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";

import { cardData } from "./data";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import pdfMake from "pdfmake/build/pdfmake.min.js";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from "sweetalert2";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbCalendar,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "src/app/core/services/common.service";
import { environment } from "src/environments/environment";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-transfer-product",
  templateUrl: "./transfer-product.component.html",
  styleUrls: ["./transfer-product.component.scss"],
})
export class TransferProductComponent implements OnInit {
  isCollapsed: boolean;
  public isOpen = false;
  InventoryList: any;
  AddForm: FormGroup;
  selectedList: any[] = [];
  IndentQuantity: any;
  Indent: any;

  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dtTrigger: Subject<any> = new Subject();
  apiUrl: any;

  private _toggleWindow() {
    this.isOpen = !this.isOpen;
  }

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Card Data
  cardData: any;
  tableData: any = [];
  TransferType;

  warehouseList: any[];
  warehouse1List: any[];
  warehouse2List: any[];
  warehouse3List: any[];
  warehouse4List: any[];
  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private service: CommonService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
    this.dataTableMessage = "Loading...";
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Inventory", path: "/" },
      { label: "List", path: "/", active: true },
    ];

    this.AddForm = this.fb.group({
      WarehouseId: ["", Validators.required],
      IndentRequestNo: ["", Validators.required],
      WarehouseSub1Id: [""],
      WarehouseSub2Id: [""],
      WarehouseSub3Id: [""],
      WarehouseSub4Id: [""],
      ReceiveWarehouseId: [""],
    });

    this.apiUrl =
      this.baseUrl +
      "/api/v1.0/InventoryIndent/InventoryTransferListByServerSide";
    this.TransferType = "1";
    this.onList();

    this.getWarehouseList();
    this.getWarehouseSub1List();
    this.getWarehouseSub2List();
    this.getWarehouseSub3List();
    this.getWarehouseSub4List();
    // Get Card Data
    this.cardData = cardData;
  }

  onList() {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    const that = this;
    var filterData = {
      TransferType: this.TransferType,
      WarehouseId: this.AddForm.value.WarehouseId,
      WarehouseSub1Id: this.AddForm.value.WarehouseSub1Id,
      WarehouseSub2Id: this.AddForm.value.WarehouseSub2Id,
      WarehouseSub3Id: this.AddForm.value.WarehouseSub3Id,
      WarehouseSub4Id: this.AddForm.value.WarehouseSub4Id,
      PartNo: this.AddForm.value.PartNo,
      IndentRequestNo: this.AddForm.value.IndentRequestNo,
    };

    this.dtOptions = {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: "full_numbers",
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "All"],
      ],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[0, "desc"]],
      serverMethod: "post",
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : (that.api_check = null);

        that.api_check = that.http
          .post<any>(
            this.apiUrl,
            Object.assign(dataTablesParameters, filterData),
            httpOptions
          )
          .subscribe((resp) => {
            //console.log('vendors', resp)
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data,
            });
            this.Indent = resp.responseData.indent;
            this.dtTrigger.next();
          });
      },
      buttons: {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [
          {
            extend: "colvis",
            className: "btn btn-xs btn-primary",
            text: "COLUMNS",
          },
          {
            extend: "excelHtml5",
            text: "EXCEL",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "csvHtml5",
            text: "CSV",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "pdfHtml5",
            text: "PDF",
            className: "btn btn-xs btn-secondary",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "print",
            className: "btn btn-xs btn-secondary",
            text: "PRINT",
            exportOptions: {
              columns: ":visible",
            },
          },
          {
            extend: "copy",
            className: "btn btn-xs btn-secondary",
            text: "COPY",
            exportOptions: {
              columns: ":visible",
            },
          },
        ],
      },

      createdRow: function (row, data, index) {},
      columnDefs: [
        {
          targets: [0],
          visible: true,
          searchable: true,
        },
        {
          targets: [1],
          visible: true,
          searchable: true,
        },
        {
          targets: [2],
          visible: true,
          searchable: true,
        },
        {
          targets: [3],
          visible: true,
          searchable: true,
        },
        {
          targets: [4],
          visible: true,
          searchable: true,
        },
        {
          targets: [5],
          visible: true,
          searchable: true,
        },
        {
          targets: [6],
          visible: true,
          searchable: true,
        },
        {
          targets: [7],
          visible: true,
          searchable: true,
        },
        {
          targets: [8],
          visible: false,
          searchable: true,
        },
      ],
      columns: [
        {
          data: "PartNo",
          name: "PartNo",
          orderable: true,
          searchable: true,
          render: (PartNo: any, type: any, row: any, meta) => {
            return `<input type="checkbox" class="actionView1">`;
          },
        },
        {
          data: "PartNo",
          name: "PartNo",
          defaultContent: "",
          orderable: true,
          searchable: false,
        },
        {
          data: "SerialNo",
          name: "SerialNo",
          orderable: true,
          searchable: false,
        },
        {
          data: "WarehouseName",
          name: "WarehouseName",
          orderable: true,
          searchable: true,
          render: (WarehouseName: any, type: any, row: any, meta) => {
            return `<div class="row mtm-5">
            ${row.WarehouseName} -> ${row.WarehouseSub1Name} -> ${row.WarehouseSub2Name} -> ${row.WarehouseSub3Name} -> ${row.WarehouseSub3Name}
                    </div>`;
          },
        },
        {
          data: "Created",
          name: "Created",
          orderable: true,
          searchable: false,
          visible: false,
        },
        {
          data: "WarehouseName",
          name: "WarehouseName",
          orderable: true,
          searchable: false,
          visible: false,
        },
        // { data: 'PhoneNoPrimary', name: 'PhoneNoPrimary', orderable: true, searchable: true },
        {
          data: "WarehouseSub1Name",
          name: "WarehouseSub1Name",
          orderable: true,
          searchable: false,
          visible: false,
        },
        {
          data: "WarehouseSub2Name",
          name: "WarehouseSub2Name",
          orderable: true,
          searchable: false,
          visible: false,
        },
        {
          data: "WarehouseSub3Name",
          name: "WarehouseSub3Name",
          orderable: true,
          searchable: false,
          visible: false,
        },
        {
          data: "WarehouseSub4Name",
          name: "WarehouseSub4Name",
          orderable: true,
          searchable: false,
          visible: false,
        },
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView1", row).unbind("change");
        $(".actionView1", row).bind("change", (e) => {
          e.preventDefault();
          e.stopPropagation();
          //this.editRepairRequest(data.Status);
          this.onCheckChangePartItem(e, data);
        });

        return row;
      },
      language: {
        paginate: {
          first: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          last: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          next: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          previous: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        },
      },
    };

    this.dataTable = $("#datatable-angular-tp-partlist");
    this.dataTable.DataTable(this.dtOptions);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onList();
    });
  }

  onTransferTypeChange(e) {
    this.selectedList.splice(0);
    if (e.target.value == 1) {
      this.apiUrl =
        this.baseUrl + "/api/v1.0/InventoryStockIn/StockInListServerSide";
    } else {
      this.apiUrl =
        this.baseUrl + "/api/v1.0/InventoryIndent/GetInventoryItemsByIndentNo";
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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

  getInventoryItemsByIndentNo() {
    this.onList();
    // this.service.postHttpService({ IndentRequestNo: this.AddForm.value.IndentRequestNo }, 'GetInventoryItemsByIndentNo').subscribe(response => {
    //   this.InventoryList = response.responseData.data;
    //   this.Indent = response.responseData.indent;
    // });
  }

  onCheckChangePartItem(e, item) {
    if (e.target.checked) {
      if (this.selectedList.find((a) => a.PartItemId == item.PartItemId)) {
        Swal.fire({
          title: "Error!",
          text: "Item already added!",
          type: "warning",
          confirmButtonClass: "btn btn-confirm mt-2",
        });
      } else {
        this.selectedList.unshift({ ...item, selected: true });
      }
    } else {
      this.selectedList = this.selectedList.filter(
        (a) => a.PartItemId != item.PartItemId
      );
    }
  }

  onIndentFilter() {
    this.selectedList.splice(0);
    this.rerender();
  }

  onFilter() {
    this.rerender();
    // var table = $('#datatable-angular').DataTable();
    // table.columns(1).search(this.AddForm.value.PartNo);
    // table.columns(5).search(this.AddForm.value.WarehouseId);
    // table.columns(6).search(this.AddForm.value.WarehouseSub2Id);
    // table.columns(7).search(this.AddForm.value.WarehouseSub3Id);
    // table.columns(8).search(this.AddForm.value.WarehouseSub4Id);
    // table.columns(9).search(this.AddForm.value.WarehouseSub4Id);

    // table.draw();
  }

  // onClear(event) {
  //   var table = $('#datatable-angular').DataTable();
  //   this.PartNo = '';
  //   this.WarehouseId = '';
  //   this.ManufacturerId = '';
  //   this.VendorId = '';
  //   table.columns(1).search(this.PartNo);
  //   table.columns(4).search(this.WarehouseId);
  //   table.columns(5).search(this.ManufacturerId);
  //   table.columns(6).search(this.VendorId);
  //   table.draw();

  // }

  onSelectedItemChanged(e, item) {
    this.selectedList.find((a) => a.PartItemId == item.PartItemId).selected =
      e.target.checked;
  }

  onSubmit() {
    if (
      this.TransferType == 2 &&
      this.selectedList.filter((a) => a.selected).length > this.Indent.Quantity
    ) {
      Swal.fire({
        title: "Error!",
        text: `Select only required quantity (Qty: ${this.Indent.Quantity})`,
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
      return;
    }

    if (this.TransferType == 1 && !this.AddForm.value.WarehouseId) {
      Swal.fire({
        title: "Error!",
        text: `Please select From Warehouse!`,
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
      return;
    } else if (
      this.TransferType == 1 &&
      !this.AddForm.value.ReceiveWarehouseId
    ) {
      Swal.fire({
        title: "Error!",
        text: `Please select To Warehouse!`,
        type: "warning",
        confirmButtonClass: "btn btn-confirm mt-2",
      });
      return;
    }

    var body = {
      Indent: this.Indent
        ? this.Indent
        : {
            WarehouseFromId: this.AddForm.value.WarehouseId,
            WarehouseId: this.AddForm.value.ReceiveWarehouseId,
            TransferType: "1",
            IntentId: 0,
          },
      Items: this.selectedList.filter((a) => a.selected),
    };
    this.service.postHttpService(body, "CreateMultipleTransfer").subscribe(
      (response) => {
        if (response.status == true) {
          Swal.fire({
            title: "Success!",
            text: `Record saved Successfully! Transfer No: ${response.responseData.TransferNo}`,
            type: "success",
            confirmButtonClass: "btn btn-confirm mt-2",
          });
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
