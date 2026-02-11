import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { LineChart } from "@carbon/charts";
import { ScaleTypes } from "@carbon/charts/interfaces";
import { DataTableDirective } from "angular-datatables";
import * as moment from "moment";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { NgxSpinnerService } from "ngx-spinner";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { CommonService } from "src/app/core/services/common.service";
import { array_rr_status } from "src/assets/data/dropdown";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-ah-new-dashboard",
  templateUrl: "./ah-new-dashboard.component.html",
  styleUrls: ["./ah-new-dashboard.component.scss"],
  providers: [NgxSpinnerService],
})
export class AhNewDashboardComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  Customer = [];
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
  dateTodayFilter = { FromDate: moment(), ToDate: moment() };

  dateYesterdayFilter = {
    FromDate: moment().subtract(1, "days"),
    ToDate: moment().subtract(1, "days"),
  };
  LoggedFilter = { FromDate: moment().subtract(14, "days"), ToDate: moment() };

  breadCrumbItems: Array<{}>;
  @Input() dateFilterField;
  TodayStatus;
  YesterdayStatus;

  //serverSide
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  //dtElement: DataTableDirective;
  dtOptions: any = {};
  dtOptions2: any = {};
  dtOptionsPO: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dataTable2: any;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dtTriggerPO: Subject<any> = new Subject();
  dtElement: DataTableDirective;

  SubmittedYesterDayCount;
  SubmittedTodayCount;

  basicColumChart: ChartType;
  chartOptions;
  loggedInStatus;
  dates: any = [];
  Completed: any = [];
  Sourced: any = [];
  Quoted: any = [];
  Approved: any = [];
  arrLength: any = [];
  dataSeries: any = [];
  timelineChartData = [];
  timelineChartOption;
  isTimelineChartShow = true;
  dateFilterFieldForChart;
  RRStatus;
  public isOpen = false;

  _toggleWindow() {
    this.isOpen = !this.isOpen;
  }
  POList: any = [];

  StatusCount;
  AwaitingVendorSelectionCount;
  AwaitingVendorQuoteCount;
  QuotedToCustomerCount;
  RepairInProgressCount;
  ApprovedButNotRepairableCount;
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  IsViewEnabled: boolean = false;
  countryList: any = [];
  Location = "";
  constructor(
    private datepipe: DatePipe,
    public commonService: CommonService,
    private http: HttpClient,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent,
    private spinner: NgxSpinnerService
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }
  onChartDateChange(event) {
    let date =
      (event.day < 10 ? "0" + event.day : event.day) +
      "/" +
      (event.month < 10 ? "0" + event.month : event.month) +
      "/" +
      event.year;
    this.getChartStatusByDate(date);
  }
  ngOnInit() {
    document.title = "BOC Dashboard";

    if (localStorage.getItem("IdentityType") == "0") {
      this.IsViewEnabled = true;
      this.breadCrumbItems = [
        { label: "Aibond", path: "/" },
        { label: "BOC Dashboard", path: "/", active: true },
      ];
      this.StatusCount = "";
      this.AwaitingVendorSelectionCount = "";
      this.AwaitingVendorQuoteCount = "";
      this.QuotedToCustomerCount = "";
      this.RepairInProgressCount = "";
      this.ApprovedButNotRepairableCount = "";
      this.RRStatus = array_rr_status;
      this.onStatusSummary();
      this.onPOWithoutPartsList();
      this.loadCustomers();
      this.getCountryList();
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("Access-Token")}`,
        }),
      };
      var url = this.baseUrl + "/api/v1.0/invoice/getDueListOfInvoice";
      const that = this;
      var filterData = {};
      var filterData2 = {};
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
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data || [],
            });
          });
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
              '<a href="#" class="actionView" ngbTooltip="View">' +
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
          data: "CompanyName",
          name: "CompanyName",
          defaultContent: "",
          orderable: true,
          searchable: true,
        },
        {
          data: "InvoiceDate",
          name: "InvoiceDate",
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
          data: "DueDateDiff",
          name: "DueDateDiff",
          defaultContent: "",
          orderable: true,
          searchable: true,
        },
      ];

      this.dataTable = $("#datatable-angular-invoiceDue");
      this.dataTable.DataTable(this.dtOptions);

      this.onRushWarrantyRRList();
    } else {
      this.IsViewEnabled = false;
    }
  }
  getCountryList() {
    this.commonService.getHttpService("getCountryList").subscribe(
      (response) => {
        if (response.status == true) {
          this.countryList = response.responseData;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  onRushWarrantyRRList() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };
    var url2 =
      this.baseUrl + "/api/v1.0/repairrequest/getRushandWarrantyListOfRR";
    const that = this;
    var filterData2 = {};
    this.dtOptions2 = this.getdtOption2();
    this.dtOptions2["ajax"] = (dataTablesParameters: any, callback) => {
      that.http
        .post<any>(
          url2,
          Object.assign(dataTablesParameters, filterData2),
          httpOptions
        )
        .subscribe((resp) => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || [],
          });
        });
    };
    this.dtOptions2["columns"] = [
      {
        data: "RRNo",
        name: "RRNo",
        width: "10%",
        defaultContent: "",
        orderable: true,
        searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          //RepairMessage show condition
          var repairMessage = "";
          var repairMessage1 = "";

          if (row.IsRushRepair == 1) {
            var repairMessage = "Rush Repair";
          }
          if (row.IsWarrantyRecovery == 1) {
            var repairMessage = "Warranty Repair";
          }
          if (row.IsWarrantyRecovery == 2) {
            var repairMessage = "Warranty New";
          }
          if (row.IsRushRepair == 1 && row.IsWarrantyRecovery == 1) {
            var repairMessage = "Rush Repair";
            var repairMessage1 = "Warranty Repair";
          }
          return (
            '<a href="#" class="actionView1" ngbTooltip="View">' +
            row.RRNo +
            "</a>" +
            "<br>" +
            '<span style="font-weight: bold;padding: 0px;color: red">' +
            repairMessage +
            "<br>" +
            repairMessage1 +
            "</span>"
          );
        },
      },
      {
        data: "PartNo",
        name: "PartNo",
        width: "10%",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "CompanyName",
        name: "CompanyName",
        width: "30%",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "Created",
        name: "Created",
        width: "10%",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
      {
        data: "Status",
        name: "Status",
        width: "25%",
        defaultContent: "",
        orderable: true,
        searchable: true,
      },
    ];
    this.dataTable2 = $("#datatable-angular-rushWarrantyRR");
    this.dataTable2.DataTable(this.dtOptions2);
  }
  ngAfterViewInit() {
    let date = new Date();
    this.dateFilterFieldForChart = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
    // Grab chart holder HTML element and initialize the chart
    const chartHolder = document.getElementById("timelineChartData");
    const data = [];
    const options = {
      // title: '',
      axes: {
        left: {
          mapsTo: "key",
          scaleType: ScaleTypes.LINEAR,
          title: "Date",
        },
        bottom: {
          scaleType: ScaleTypes.TIME,
          mapsTo: "date",
          title: "Date",
        },
      },
      curve: "curveMonotoneX",
      height: "400px",
      color: {
        scale: {
          Sourced: "#f58091",
          Quoted: "#8c83d9",
          Approved: "#f9ca78",
          Completed: "#53cdb5",
        },
      },
    };
    this.timelineChartOption = new LineChart(chartHolder, {
      data,
      options,
    });
    this.onChartDateChange(this.dateFilterFieldForChart);
    this.getChartStatusByDate(this.dateFilterFieldForChart);
  }
  getdtOption() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-3 col-sm-3 col-md-3 col-xl-3"l><"col-4 col-sm-4 col-md-4 col-xl-4"i><"col-5 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: "full_numbers",
      pageLength: 10,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "All"],
      ],
      processing: true,
      autoWidth: false,
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

      //columnDefs: [{width: '10%', targets:0}],

      createdRow: function (row, data, index) {
        var Difference_In_Days = "Days";

        var html =
          '<span class="badge badge-danger">' +
          data.DueDateDiff +
          " " +
          Difference_In_Days +
          "</span>";
        $("td", row).eq(5).html(html);
      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView", row).unbind("click");
        $(".actionView", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(["/admin/repair-request/edit"], {
            state: { RRId: data.RRId },
          });
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

  getdtOption2() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-6 col-md-6 col-xl-6"l><"col-12 col-sm-6 col-md-6 col-xl-6"i><"col-12 col-sm-12 col-md-12 col-xl-12"p>>',
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
      buttons: {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [],
      },
      createdRow: function (row, data, index) {
        var statusObj = array_rr_status.find((a) => a.id == data.Status);
        var html =
          '<span class="badge ' +
          (statusObj ? statusObj.cstyle : "") +
          ' btn-xs">' +
          (statusObj ? statusObj.title : "") +
          "</span>";
        $("td", row).eq(4).html(html);
      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $(".actionView3", row).unbind("click");
        $(".actionView3", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
        });

        $(".actionView1", row).unbind("click");
        $(".actionView1", row).bind("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.router.navigate(["/admin/repair-request/edit"], {
            state: { RRId: data.RRId },
          });
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

  getChartStatusByDate(date = "24/02/2021") {
    let obj = this;
    obj.timelineChartData = [];
    obj.isTimelineChartShow = false;
    this.commonService
      .postHttpService(
        {
          Date: date,
        },
        "ChartStatusByDate"
      )
      .subscribe(
        (response) => {
          if (response.status == true) {
            ["Approved", "Completed", "Quoted", "Sourced"].forEach(function (
              key
            ) {
              if (response.responseData[key].length > 0) {
                obj.isTimelineChartShow = true;
                response.responseData[key].forEach(function (value) {
                  obj.timelineChartData.push({
                    group: key,
                    date: value.Date,
                    key: value.Count,
                  });
                });
              }
            });
            obj.timelineChartOption.model.setData(obj.timelineChartData);
          } else {
            obj.timelineChartOption.model.setData(obj.timelineChartData);
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  todayStatus() {
    var postData = {
      FromDate: moment(this.dateTodayFilter.FromDate).format("YYYY-MM-DD"),
      ToDate: moment(this.dateTodayFilter.ToDate).format("YYYY-MM-DD"),
    };
    this.commonService
      .postHttpService(postData, "DashboardStatisticsCount")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.TodayStatus = response.responseData.ExceptSubmittedCount;
            this.SubmittedTodayCount = response.responseData.SubmittedCount;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  onStatus() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var postData = {
      FromDate: this.datePipe.transform(firstDay, "yyyy-MM-dd"),
      ToDate: this.datePipe.transform(date, "yyyy-MM-dd"),
    };
    this.commonService
      .postHttpService(postData, "DashboardStatisticsCount")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.YesterdayStatus = response.responseData.ExceptSubmittedCount;
            this.SubmittedYesterDayCount = response.responseData.SubmittedCount;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  onStatusSummary() {
    this.spinner.show();
    var postData = {
      CustomerId: this.Customer,
      Location: this.Location.toString(),
    };
    this.commonService
      .postHttpService(postData, "DashboardStatusCount")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.StatusCount = response.responseData.StatusCount;
            this.AwaitingVendorSelectionCount =
              response.responseData.AwaitingVendorSelection;
            this.AwaitingVendorQuoteCount =
              response.responseData.AwaitingVendorQuote;
            this.QuotedToCustomerCount = response.responseData.QuotedToCustomer;
            this.RepairInProgressCount = response.responseData.RepairInProgress;
            this.ApprovedButNotRepairableCount =
              response.responseData.ApprovedButNotRepairable;

            this.spinner.hide();
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }
  LoggedInStatus() {
    var postData = {
      FromDate: moment(this.LoggedFilter.FromDate).format("YYYY-MM-DD"),
      ToDate: moment(this.LoggedFilter.ToDate).format("YYYY-MM-DD"),
    };
    this.dates = [];
    this.Sourced = [];
    this.Approved = [];
    this.Quoted = [];
    this.Completed = [];
    this.commonService.postHttpService(postData, "LoggedInStatus").subscribe(
      (response) => {
        if (response.status == true) {
          this.loggedInStatus = response.responseData;

          for (var i = 0; i < this.loggedInStatus.length; i++) {
            this.dates.push(this.loggedInStatus[i].Date);
            this.Sourced.push(this.loggedInStatus[i].Sourced);
            this.Quoted.push(this.loggedInStatus[i].Quoted);
            this.Approved.push(this.loggedInStatus[i].Approved);
            this.Completed.push(this.loggedInStatus[i].Completed);

            this.dataSeries = [
              {
                name: "Sourced",
                data: this.Sourced,
              },

              {
                name: "Quoted",
                data: this.Quoted,
              },
              {
                name: "Approved",
                data: this.Approved,
              },
              {
                name: "Completed",
                data: this.Completed,
              },
            ];
          }
          this.arrLength = this.dates;
          const basicColumChart: ChartType = {
            series: this.dataSeries,
            chart: {
              id: "barChart",
              type: "bar",
              height: 350,
              width: "100%",
              stacked: true,
            },
            colors: ["#f37f90", "#8c83d9", "#69daec", "#53cdb5"],
            stroke: {
              width: 1,
              colors: ["#fff"],
            },
            xaxis: {
              categories: this.dates,
              labels: {
                formatter: function (val) {
                  return val;
                },
              },
            },
            yaxis: {
              title: {
                text: undefined,
              },
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val + "";
                },
              },
              x: {
                formatter: function (val) {
                  return val + "";
                },
              },
              theme: "light",
            },
            /* theme: {
            palette: "palette1"
          }, */
            fill: {
              opacity: 1,
            },
            legend: {
              position: "bottom",
              horizontalAlign: "center",
            },
          };

          this.basicColumChart = basicColumChart;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }
  onTableContentRefresh() {}
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }
  onStatusLink(value, Number) {
    var Status = value;
    var StatusName = array_rr_status.find((a) => a.id == value);
    var Number1 = Number;
    this.router.navigate(["/admin/repair-request/list"], {
      state: {
        StatusName: StatusName,
        Status: Status,
        Number1: Number1,
        Customer: this.Customer,
        Location: this.Location.toString(),
      },
    });
  }
  onStatusInBetweenLink(value, Number1, Number2) {
    var Status = value;
    var StatusName = array_rr_status.find((a) => a.id == value);
    this.router.navigate(["/admin/repair-request/list"], {
      state: {
        StatusName: StatusName,
        Status: Status,
        Number1: Number1,
        Number2: Number2,
        Customer: this.Customer,
        Location: this.Location.toString(),
      },
    });
  }
  onStatusMainLink(value) {
    var Status = value;
    var StatusName = array_rr_status.find((a) => a.id == value);
    var FromStatictisDate = "";
    var ToStatictisDate = "";
    this.router.navigate(["/admin/repair-request/list"], {
      state: {
        StatusName: StatusName,
        Status: Status,
        FromDate: FromStatictisDate,
        ToDate: ToStatictisDate,
        DateType: 1,
        Customer: this.Customer,
        Location: this.Location.toString(),
      },
    });
  }
  onStatusCurrentLink(value, Current) {
    var Status = value;
    var StatusName = array_rr_status.find((a) => a.id == value);
    this.router.navigate(["/admin/repair-request/list"], {
      state: {
        StatusName: StatusName,
        Status: Status,
        Current: Current,
        Customer: this.Customer,
        Location: this.Location.toString(),
      },
    });
  }
  onPOWithoutPartsList() {
    this.dtOptionsPO = {
      dom: '<"row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: "full_numbers",
      pageLength: 10,
      retrieve: true,
      buttons: {
        dom: {
          button: {
            className: "",
          },
        },
        buttons: [],
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
    this.commonService
      .getHttpService("POListWithOutPartId")
      .subscribe((response: any) => {
        if (response.status == true) {
          this.POList = response.responseData;
          // Calling the DT trigger to manually render the table
          this.dtTriggerPO.next();
        }
      });
  }
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.onPOWithoutPartsList();
    });
  }

  _fetchPOData() {
    this.commonService
      .getHttpService("POListWithOutPartId")
      .subscribe((response: any) => {
        if (response.status == true) {
          this.POList = response.responseData;
          // Calling the DT trigger to manually render the table
          this.dtTriggerPO.next();
        }
      });
  }
  onUpdateMissingPartIdInPO(RRId) {
    var postData = {
      RRId: RRId,
    };
    this.commonService
      .postHttpService(postData, "UpdateMissingPartIdInPO")
      .subscribe((response) => {
        if (response.status == true) {
          Swal.fire({
            title: "Success!",
            text: "PartId has been Updated.",
            type: "success",
          });
          this._fetchPOData();
        } else {
          Swal.fire({
            title: "Cancelled",
            text: response.message,
            type: "error",
          });
        }
      });
  }

  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe(
        // default items
        catchError(() => of([])) // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap((term) => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])) // empty list on error
            );
          else return of([]);
        })
      )
    );
  }

  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      Customer: term,
    };
    return this.commonService
      .postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map((response) => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

  selectAll() {
    let customerIds = this.CustomersList.map((a) => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.Customer])];
    this.Customer = cMerge;
    this.onStatusSummary();
  }
}

// Chart data
export interface ChartType {
  chart?: any;
  plotOptions?: any;
  colors?: any;
  series?: any;
  stroke?: any;
  fill?: any;
  labels?: any;
  markers?: any;
  legend?: any;
  xaxis?: any;
  yaxis?: any;
  tooltip?: any;
  grid?: any;
  type?: any;
  sparkline?: any;
  dataLabels?: any;
  height?: any;
  option?: any;
  toolbar?: any;
  stacked?: any;
  color?: any;
  width?: any;
  padding?: any;
  fixed?: any;
  marker?: any;
  responsive?: any;
  events?: any;
}
