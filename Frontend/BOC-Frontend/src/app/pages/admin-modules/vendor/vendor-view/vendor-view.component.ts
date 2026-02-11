/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

// import { Project,ChartType } from './profile.model';
// import { RepairRequestData, PartsData, PerformanceData, projectData , UsersData, revenueAreaChart,
//   VendorContact,CapabilitiesData, ContractData,VendorCostData} from './data';
// import { img } from '../vendor-edit/data';
// import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
// import { HttpClient } from '@angular/common/http';
// import { Router, ActivatedRoute } from '@angular/router';
// import { CommonService } from 'src/app/core/services/common.service';
// import { DatePipe } from '@angular/common';

// import { attachment_thumb_images } from 'src/assets/data/dropdown';

import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
  Input,
} from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
import Swal from "sweetalert2";

import { Project, ChartType } from "./profile.model";
import {
  RepairRequestData,
  PartsData,
  PerformanceData,
  projectData,
  UsersData,
  revenueAreaChart,
  VendorContact,
  CapabilitiesData,
  ContractData,
  VendorCostData,
} from "./data";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "src/app/core/services/common.service";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { AppConfig } from "config";
import {
  attachment_thumb_images,
  CONST_MODIFY_ACCESS,
} from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { img } from "../vendor-edit/data";
import { array_rr_status } from "src/assets/data/dropdown";

@Component({
  selector: "app-vendor-view",
  templateUrl: "./vendor-view.component.html",
  styleUrls: ["./vendor-view.component.scss"],
})
export class VendorViewComponent implements OnInit {
  //date picker
  datalen: boolean = false;
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 15 Days": [moment().subtract(14, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
      moment().subtract(1, "month").startOf("month"),
      moment().subtract(1, "month").endOf("month"),
    ],
  };

  invalidDates: moment.Moment[] = [
    moment().add(2, "days"),
    moment().add(3, "days"),
    moment().add(5, "days"),
  ];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some((d) => d.isSame(m, "day"));
  };
  dateFilter;
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtOptions2: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dataTable2: any;
  showPassword: boolean = false;
  @Input() dateFilterField;
  @ViewChild("dataTable", { static: true }) table;
  draw: string;
  start: string;
  length: string;

  // Card Data
  cardData: any;
  tableData: any = [];

  projectData: Project[];
  breadCrumbItems: Array<{}>;
  revenueAreaChart: ChartType;
  UsersData;
  VendorContact;
  CapabilitiesData;
  ContractData;
  VendorCostData;
  PerformanceData;
  PartsData;
  RepairRequestData;
  array_rr_status;
  img;
  // Card Data
  data: any = [];
  VendorId;
  ProfilePhoto: string;
  Website: string;

  statData: any;
  attachmentThumb;
  basicData: any = [];
  IsEditEnabled: boolean = false;
  constructor(
    public service: CommonService,
    private httpClient: HttpClient,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private http: HttpClient,
    private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }

  ngOnInit() {
    document.title = "Vendor View";
    this.VendorId = this.navCtrl.get("VendorId");
    this.array_rr_status = array_rr_status;
    // Redirect to the List page if the View Id is not available
    if (
      this.VendorId == "" ||
      this.VendorId == "undefined" ||
      this.VendorId == null
    ) {
      this.navCtrl.navigate("/admin/vendor/list/");
      return false;
    }

    this.dateFilter = {
      VendorId: this.VendorId,
      startDate: moment().subtract(29, "days"),
      endDate: moment(),
    };
    this.IsEditEnabled = this.service.permissionCheck(
      "ManageVendor",
      CONST_MODIFY_ACCESS
    );

    //dropdown
    this.attachmentThumb = attachment_thumb_images;

    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Vendors", path: "/" },
      { label: "View", path: "/", active: true },
    ];
    this.projectData = projectData;
    this.revenueAreaChart = revenueAreaChart;
    this.VendorContact = VendorContact;
    this.UsersData = UsersData;
    this.CapabilitiesData = CapabilitiesData;
    this.VendorCostData = VendorCostData;
    this.PerformanceData = PerformanceData;
    this.PartsData = PartsData;
    this.RepairRequestData = RepairRequestData;

    var postData = {
      VendorId: this.VendorId,
    };
    this.service.postHttpService(postData, "getVendorView").subscribe(
      (response) => {
        if (response.status == true) {
          this.data = response.responseData;

          // Get the basic data
          this.basicData = this.data.BasicInfo[0];

          // Set the profile photo
          this.ProfilePhoto = "assets/images/icons/Vendor.png";
          if (
            this.data.BasicInfo[0].ProfilePhoto != null &&
            this.data.BasicInfo[0].ProfilePhoto != ""
          ) {
            this.ProfilePhoto = this.data.BasicInfo[0].ProfilePhoto;
          }

          if (this.data.Attachment != null && this.data.Attachment != "") {
            //this.Attachment = "http://ec2-15-207-18-193.ap-south-1.compute.amazonaws.com:3000/" + this.data.Attachment;
          }
          this.Website = "http://" + this.data.Website;
        } else {
        }
        if (!(this.cd_ref as any).destroyed) {
          this.cd_ref.detectChanges();
        }
      },
      (error) => console.log(error)
    );

    this.onStat();
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url = this.baseUrl + "/api/v1.0/vendor/VendorRRListByServerSide";
    var url2 = this.baseUrl + "/api/v1.0/vendor/VendorPOListByServerSide";

    const that = this;
    var filterData = { VendorId: this.VendorId };

    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      that.api_check ? that.api_check.unsubscribe() : (that.api_check = null);

      that.api_check = that.http
        .post<any>(
          url,
          Object.assign(dataTablesParameters, filterData),
          httpOptions
        )
        .subscribe((resp) => {
          if (resp.responseData == "No record") {
            this.datalen = true;
          }
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data,
          });
        });
    };

    this.dtOptions["createdRow"] = function (row, data, index) {
      var cstyle1 = "";
      switch (data.StatusName) {
        case "Repair In Progress": {
          cstyle1 = "badge-info";
          break;
        }
        // case 6: { cstyle1 = 'badge-purple'; break; }
      }
      var html =
        '<span class="badge ' +
        cstyle1 +
        ' btn-xs">' +
        data.StatusName +
        "</span>";
      $("td", row).eq(6).html(html);
    };

    this.dtOptions["columns"] = [
      // { data: 'RRId', name: 'RRId', defaultContent: '', orderable: true, searchable: true,
      //    render: (data: any, type: any, row: any, meta) => {
      //      return '<a href="#" class="actionView5" ngbTooltip="RRId">' + row.RRId + '</a>';
      //  }
      // },
      {
        data: "RRNo",
        name: "RRNo",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "PartNo",
        name: "PartNo",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "RRDescription",
        name: "RRDescription",
        orderable: true,
        searchable: true,
      },
      { data: "SerialNo", name: "SerialNo", orderable: true, searchable: true },
      {
        data: "VendorName",
        name: "VendorName",
        orderable: true,
        searchable: true,
      },
      {
        data: "StatusName",
        name: "StatusName",
        orderable: true,
        searchable: true,
      },
    ];

    this.dtOptions2 = this.getdtOption();
    this.dtOptions2["ajax"] = (dataTablesParameters: any, callback) => {
      that.api_check ? that.api_check.unsubscribe() : (that.api_check = null);

      that.api_check = that.http
        .post<any>(
          url2,
          Object.assign(dataTablesParameters, filterData),
          httpOptions
        )
        .subscribe((resp) => {
          if (resp.responseData == "No record") {
            this.datalen = true;
          }
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data,
          });
        });
    };

    this.dtOptions2["createdRow"] = function (row, data, index) {
      var cstyle2 = "";
      switch (data.StatusName) {
        case "Open": {
          cstyle2 = "badge-info";
          break;
        }
        case "Cancelled": {
          cstyle2 = "badge-purple";
          break;
        }
      }
      var html =
        '<span class="badge ' +
        cstyle2 +
        ' btn-xs">' +
        data.StatusName +
        "</span>";
      $("td", row).eq(6).html(html);
    };

    this.dtOptions2["columns"] = [
      {
        data: "POId",
        name: "POId",
        defaultContent: "",
        orderable: true,
        searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          return (
            '<a href="#" class="actionView6" ngbTooltip="POId">' +
            row.POId +
            "</a>"
          );
        },
      },
      {
        data: "PONo",
        name: "PONo",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "DateRequested",
        name: "DateRequested",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "DueDate",
        name: "DueDate",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "GrandTotal",
        name: "GrandTotal",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "UserName",
        name: "UserName",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "StatusName",
        name: "StatusName",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
    ];

    this.dataTable = $("#datatable-angular-repairrequest");
    this.dataTable.DataTable(this.dtOptions);

    this.dataTable2 = $("#datatable-angular-purchaseorder");
    this.dataTable2.DataTable(this.dtOptions2);
  }

  getdtOption() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: "full_numbers",
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "All"],
      ],
      processing: false,
      serverSide: true,
      retrieve: true,
      order: [[0, "desc"]],
      serverMethod: "post",
      buttons: {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [],
      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView5", row).unbind("click");
        $(".actionView5", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate("/admin/repair-request/edit", {
            RRId: data.RRId,
          });
        });

        $(".actionView6", row).unbind("click");
        $(".actionView6", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate("/admin/sales-order/edit", { RRId: data.RRId });
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
  }
  onStat() {
    var postData = {
      startDate: moment(this.dateFilter.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.dateFilter.endDate).format("YYYY-MM-DD"),
      VendorId: this.VendorId,
    };
    this.service
      .postHttpService(postData, "getVendorViewStatistics")
      .subscribe((response) => {
        this.statData = response.responseData;
        for (let i = 0; i < array_rr_status.length; i++) {
          let index = array_rr_status[i].id;
          if (index > 1) {
            if (this.checkStatusAvailableinStats(index)) {
            } else {
              this.statData.push({
                Count: 0,
                Status: array_rr_status[i].title,
                StatusId: index,
              });
            }
          }
        }
        this.statData.sort(this.GetSortOrder("StatusId"));
      });
  }
  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }
  checkStatusAvailableinStats($id) {
    for (let i = 0; i < this.statData.length; i++) {
      if (this.statData[i]["StatusId"] == $id) {
        return this.statData[i]["StatusId"];
      }
    }
    return "";
  }
  editVendor() {
    this.navCtrl.navigate("/admin/vendor/edit/", { VendorId: this.VendorId });
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // open(index: number) {
  //   this._lightbox.open(this.img, index);
  // }
}
