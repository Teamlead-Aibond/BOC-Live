/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
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
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "src/app/core/services/common.service";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { AppConfig } from "config";
import {
  attachment_thumb_images,
  CONST_MODIFY_ACCESS,
} from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";
import { array_rr_status } from "src/assets/data/dropdown";

@Component({
  selector: "app-customer-view",
  templateUrl: "./customer-view.component.html",
  styleUrls: ["./customer-view.component.scss"],
})
export class CustomerViewComponent implements OnInit {
  //date picker
  datalen: boolean = false;
  selected: any;
  ProfilePhoto;
  Website;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  showPassword: boolean = false;
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

  //dateFilter = { startDate: moment().subtract(29, 'days'), endDate: moment() };
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

  @Input() dateFilterField;
  @ViewChild("dataTable", { static: true }) table;
  draw: string;
  start: string;
  length: string;

  // Card Data
  cardData: any;
  tableData: any = [];

  img;
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
  attachmentThumb;
  array_rr_status;

  PaidInvoiceAmount;
  UnPaidInvoiceAmount;

  data: any = [];
  CustomerId;
  IsEditEnabled: boolean = false;

  statData: any = [];
  basicData: any = [];
  AHUserName: any;
  AHDepartmentName: any;
  AHEmail: any;
  AHPhoneNo: any;
  DirectedVendorList: any = [];
  constructor(
    public service: CommonService,
    private httpClient: HttpClient,
    public router: Router,
    public navCtrl: NgxNavigationWithDataComponent,
    private http: HttpClient,
    private cd_ref: ChangeDetectorRef
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }

  ngOnInit() {
    document.title = "Customer View";
    this.CustomerId = "";
    this.draw = "";
    this.start = "";
    this.length = "";
    this.array_rr_status = array_rr_status;

    this.CustomerId = this.navCtrl.get("CustomerId");
    this.IsEditEnabled = this.service.permissionCheck(
      "ManageCustomer",
      CONST_MODIFY_ACCESS
    );

    // Redirect to the List page if the View Id is not available
    if (
      this.CustomerId == "" ||
      this.CustomerId == "undefined" ||
      this.CustomerId == null
    ) {
      this.navCtrl.navigate("/admin/customer/list/");
      return false;
    }

    this.dateFilter = {
      CustomerId: this.CustomerId,
      startDate: moment().subtract(29, "days"),
      endDate: moment(),
    };

    this.img = [
      {
        src: "../../../../../assets/images/users/avatar-1.jpg",
        thumb: "../../../../../assets/images/users/avatar-1.jpg",
        date: "10-15-2020 05:00PM",
        name: "Craig Creek",
      },

      {
        src: "../assets/images/pdf_logo.jpg",
        thumb: "../assets/images/pdf_logo.jpg",
        date: "10-16-2020 05:00PM",
        name: "customer details",
        imagelink:
          "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf",
        //id: 'webdesign',
        //userimage: 'assets/images/amp2.png'
      },
      {
        src: "../assets/images/word.jpg",
        thumb: "../assets/images/word.jpg",
        date: "10-14-2020 05:00PM",
        name: "customer details",
        imagelink:
          "https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc",
        //id: 'webdesign',
        //userimage: 'assets/images/amp2.png'
      },
    ];
    this.attachmentThumb = attachment_thumb_images;

    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Customers", path: "/" },
      { label: "View", path: "/", active: true },
    ];
    this.projectData = projectData;
    this.revenueAreaChart = revenueAreaChart;
    this.VendorContact = VendorContact;
    this.UsersData = UsersData;
    this.CapabilitiesData = CapabilitiesData;
    this.ContractData = ContractData;
    this.VendorCostData = VendorCostData;
    this.PerformanceData = PerformanceData;
    this.PartsData = PartsData;
    this.RepairRequestData = RepairRequestData;

    var postData = {
      CustomerId: this.CustomerId,
    };
    this.service.postHttpService(postData, "getCustomerView").subscribe(
      (response) => {
        if (response.status == true) {
          this.data = response.responseData;

          // Get the basic data
          this.basicData = this.data.BasicInfo[0];
          this.DirectedVendorList = this.data.DirectedVendorList;

          // Get AH Manager details
          if (this.data.CustomerUsers.length > 0) {
            this.AHUserName = this.data.CustomerUsers[0].UserName;
            this.AHDepartmentName = this.data.CustomerUsers[0].DepartmentName;
            this.AHEmail = this.data.CustomerUsers[0].Email;
            this.AHPhoneNo = this.data.CustomerUsers[0].PhoneNo;
          }

          // Set the profile photo
          this.ProfilePhoto = "assets/images/icons/Customer.png";
          if (
            this.data.BasicInfo[0].ProfilePhoto != null &&
            this.data.BasicInfo[0].ProfilePhoto != ""
          ) {
            this.ProfilePhoto = this.data.BasicInfo[0].ProfilePhoto;
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

    var url = this.baseUrl + "/api/v1.0/customers/CustomerRRListByServerSide";
    var url2 = this.baseUrl + "/api/v1.0/customers/CustomerSOListByServerSide";

    const that = this;
    var filterData = { CustomerId: this.CustomerId };

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
            // recordsTotal: resp.responseData.recordsTotal,
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
      {
        data: "RRNo",
        name: "RRNo",
        defaultContent: "",
        orderable: true,
        searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          return (
            '<a href="#" class="actionView5" ngbTooltip="RRNo">' +
            row.RRNo +
            "</a>"
          );
        },
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
        defaultContent: "",
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
      { data: "Date", name: "Date", orderable: true, searchable: true },
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
      switch (data.Status) {
        case 1: {
          cstyle2 = "badge-info";
          break;
        }
        //case "Cancelled": { cstyle2 = 'badge-purple'; break; }
      }
      var html =
        '<span class="badge ' + cstyle2 + ' btn-xs">' + data.Status + "</span>";
      $("td", row).eq(5).html(html);
    };

    this.dtOptions2["columns"] = [
      {
        data: "SONo",
        name: "SONo",
        defaultContent: "",
        orderable: true,
        searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          return (
            '<a href="#" class="actionView6" ngbTooltip="SONo">' +
            row.SONo +
            "</a>"
          );
        },
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
        data: "InvoiceNo",
        name: "InvoiceNo",
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
      {
        data: "Status",
        name: "Status",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
    ];

    this.dataTable = $("#datatable-angular-rrparts");
    this.dataTable.DataTable(this.dtOptions);

    this.dataTable2 = $("#datatable-angular-salesorder");
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

      createdRow: function (row, data, index) {
        // Set the Customer Type
        //  var cstyle1 = '';
        //  switch (data.Status) {
        //    case "Completed": { cstyle1 = 'badge-info'; break; }
        //    case "Repair In Progress": { cstyle1 = 'badge-pink'; break; }
        //    default: { cstyle1 = ''; break; }
        //  }
        //  var html = '<span class="badge ' + cstyle1 + ' btn-xs">' + data.Status + '</span>';
        //  $('#td', row).eq(6).html(html);

        var cstyle1 = "";
        switch (data.Status) {
          // case "1": { cstyle1 = 'badge-info'; break; }
          // case "2": { cstyle1 = 'badge-info'; break; }
          // case "3": { cstyle1 = 'badge-info'; break; }
          // case "4": { cstyle1 = 'badge-info'; break; }
          case "5": {
            cstyle1 = "badge-pink";
            break;
          }
          default: {
            cstyle1 = "";
            break;
          }
        }
        var html =
          '<span class="badge ' +
          cstyle1 +
          ' btn-xs">' +
          data.Status +
          "</span>";
        $("td", row).eq(6).html(html);
      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView5", row).unbind("click");
        $(".actionView5", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(["/admin/repair-request/edit"], {
            state: { RRId: data.RRId },
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

  // open(index: number) {
  //   this._lightbox.open(this.img, index);
  // }

  onStat() {
    var postData = {
      startDate: moment(this.dateFilter.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.dateFilter.endDate).format("YYYY-MM-DD"),
      CustomerId: this.CustomerId,
    };
    this.service
      .postHttpService(postData, "getCustomerViewStatistics")
      .subscribe((response) => {
        this.PaidInvoiceAmount = response.responseData.Paid
          ? response.responseData.Paid
          : 0;
        this.UnPaidInvoiceAmount = response.responseData.Unpaid
          ? response.responseData.Unpaid
          : 0;
        this.statData = response.responseData.statsData;
        for (let i = 0; i < array_rr_status.length; i++) {
          let index = array_rr_status[i].id;
          if (this.checkStatusAvailableinStats(index)) {
          } else {
            this.statData.push({
              Count: 0,
              StatusName: array_rr_status[i].title,
              Status: index,
            });
          }
        }
        this.statData.sort(this.GetSortOrder("Status"));
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
      if (this.statData[i]["Status"] == $id) {
        return this.statData[i]["Status"];
      }
    }
    return "";
  }

  editCustomer() {
    this.navCtrl.navigate("/admin/customer/edit/", {
      CustomerId: this.CustomerId,
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
