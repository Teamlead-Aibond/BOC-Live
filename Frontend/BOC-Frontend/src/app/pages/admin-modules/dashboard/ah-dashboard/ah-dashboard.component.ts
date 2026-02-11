import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from "@angular/core";

import { Sellingproduct, Widget, ChartType } from "./sellingproduct.model";
import { DatePipe } from "@angular/common";
import { LineChart } from "@carbon/charts";
import { ScaleTypes } from "@carbon/charts/interfaces/enums";

import { simpleLineChart } from "./data1";
import { ChartType1 } from "./chartist.model";
import * as moment from "moment";

import { ChartType2 } from "./chartist.model3";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import { environment } from "src/environments/environment";
import { DataTableDirective } from "angular-datatables";

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  ApexTheme,
} from "ng-apexcharts";
import { Subject } from "rxjs";
import { array_rr_status } from "src/assets/data/dropdown";
import Swal from "sweetalert2";

export type basicColumChart = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  theme: ApexTheme;
  colors: any;
  legend: ApexLegend;
};

@Component({
  selector: "app-ah-dashboard",
  templateUrl: "./ah-dashboard.component.html",
  styleUrls: ["./ah-dashboard.component.scss"],
})
export class AhDashboardComponent implements OnInit, OnDestroy {
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

  // // Stacked bar chart
  stackBarChart: ChartType2;
  // // Simple line chart
  simpleLineChart: ChartType1;
  // // Charts data
  // revenueAreaChart: ChartType;
  // projectionsDonutChart: ChartType;
  // incomeBarChart: ChartType;
  // recentuserAreaChart: ChartType;
  // salesStatusChart: ChartType;
  // earningReportBarChart: ChartType;
  // weeklySalesPieChart: ChartType;
  breadCrumbItems: Array<{}>;
  @Input() dateFilterField;
  TodayStatus;
  YesterdayStatus;
  widgetData: Widget[];
  // Product data
  productData: Sellingproduct[];

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
  constructor(
    private datepipe: DatePipe,
    public commonService: CommonService,
    private http: HttpClient,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    private datePipe: DatePipe,
    public navCtrl: NgxNavigationWithDataComponent
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
    let date = new Date();
    this.dateFilterFieldForChart = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
    // tslint:disable-next-line: max-line-length
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Dashboard", path: "/" },
      { label: "BOC Dashboard", path: "/", active: true },
    ];

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

    /**
     * Fetches data
     */
    this.simpleLineChart = simpleLineChart;
    this.productData = this.productData;

    this.RRStatus = array_rr_status;

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("Access-Token")}`,
      }),
    };

    var url = this.baseUrl + "/api/v1.0/invoice/getDueListOfInvoice";
    var url2 =
      this.baseUrl + "/api/v1.0/repairrequest/getRushandWarrantyListOfRR";

    const that = this;
    var filterData = {};
    var filterData2 = {};
    // var filterData3 = {PartId:this.PartId}

    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      // that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

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

    this.dtOptions2 = this.getdtOption2();
    this.dtOptions2["ajax"] = (dataTablesParameters: any, callback) => {
      // that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.api_check = that.http
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

    this.dataTable = $("#datatable-angular-invoiceDue");
    this.dataTable.DataTable(this.dtOptions);

    this.dataTable2 = $("#datatable-angular-rushWarrantyRR");
    this.dataTable2.DataTable(this.dtOptions2);

    const years = Number(this.datePipe.transform(date, "yyyy"));
    const Month = Number(this.datePipe.transform(date, "MM"));
    const Day = Number(this.datePipe.transform(date, "dd"));
    const CurrentDate = (Day / Month / years).toString();
    this.getChartStatusByDate(CurrentDate);

    this.onStatus();

    this.onPOWithoutPartsList();
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

  /**
   * fetches the dashboard-2 chart data
   */
  private _fetchData() {
    // // Simple line chart data
    // // widget Data
    // this.widgetData = widgetData;
    // // Revenue Area chart
    // this.revenueAreaChart = revenueAreaChart;
    // // Projections Donut Chart
    // this.projectionsDonutChart = projectionsDonutChart;
    // // Income Status Bar chart
    // this.incomeBarChart = incomeBarChart;
    // // Recent Users area chart
    // this.recentuserAreaChart = recentuserAreaChart;
    // // Sales Status chart
    // this.salesStatusChart = salesStatusChart;
    // // table Data
    // this.productData = productData;
    // // Earning report bar chart
    // this.earningReportBarChart = earningReportBarChart;
    // // weekly sales Report pie chart
    // this.weeklySalesPieChart = weeklySalesPieChart;
    // // Stacked bar chart data
    // this.stackBarChart = stackBarChart;
  }

  /**
   * on table data refresh
   */
  onTableContentRefresh() {}

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

  onStatusList(value) {
    var Status = value;
    var StatusName = array_rr_status.find((a) => a.id == value);
    var FromStatictisDate = moment(this.dateTodayFilter.FromDate).format(
      "YYYY-MM-DD"
    );
    var ToStatictisDate = moment(this.dateTodayFilter.ToDate).format(
      "YYYY-MM-DD"
    );
    this.router.navigate(["/admin/repair-request/list"], {
      state: {
        StatusName: StatusName,
        Status: Status,
        FromDate: FromStatictisDate,
        ToDate: ToStatictisDate,
        DateType: 0,
      },
    });
  }

  onStatusList1(value) {
    var Status = value;
    var StatusName = array_rr_status.find((a) => a.id == value);
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var FromStatictisDate = this.datePipe.transform(firstDay, "yyyy-MM-dd");
    var ToStatictisDate = this.datePipe.transform(date, "yyyy-MM-dd");
    this.router.navigate(["/admin/repair-request/list"], {
      state: {
        StatusName: StatusName,
        Status: Status,
        FromDate: FromStatictisDate,
        ToDate: ToStatictisDate,
        DateType: 1,
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
}
