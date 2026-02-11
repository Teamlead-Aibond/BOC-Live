/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { CONST_VIEW_ACCESS } from "src/assets/data/dropdown";

import { RevenueData, ChartType } from "./default.model";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexFill,
  ApexPlotOptions,
  ApexLegend,
} from "ng-apexcharts";
import { CommonService } from "src/app/core/services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from "moment";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: "app-shop-dashboard",
  templateUrl: "./shop-dashboard.component.html",
  styleUrls: ["./shop-dashboard.component.scss"],
  providers: [NgxSpinnerService],
})
export class ShopDashboardComponent implements OnInit, OnDestroy {
  time = new Date();
  timer: NodeJS.Timer;

  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Widget Charts
  customerChart: ChartType;
  orderChart: ChartType;
  widgetChart: ChartType;
  revenueChart: ChartType;

  // Charts
  averageChart: ChartType;
  revenueAreaChart: ChartType;
  yearlySalesBarChart: ChartType;
  weeklySalesPieChart: ChartType;
  earningReportBarChart: ChartType;

  // Revenue History Table data
  tabledata: RevenueData[];
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  @ViewChild("chart1", { static: false }) chart1: ChartComponent;
  @ViewChild("chart2", { static: false }) chart2: ChartComponent;
  @ViewChild("chart3", { static: false }) chart3: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: ChartType;
  resultData: any;
  customersChartSeries: any = [];
  customersChartlabels: any = [];
  partsChartSeries: any = [];
  partsChartlabels: any = [];
  monthlyChartSeries: any = [];
  monthlyChartlabels: any = [];
  statusChartSeries: any = [];
  statusChartlabels: any = [];
  loading: boolean = false;
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
  // chartFilter = { FromDate: moment().subtract(14, 'days'), ToDate: moment() };
  // chartFilter = { FromDate: moment().subtract(1, 'year'), ToDate: moment() };
  chartFilter: any;
  showClearButton: boolean = false;
  IsShowShopDashboard: any;
  loginType: any;
  chartFilterDefault: { FromDate: moment.Moment; ToDate: moment.Moment };

  constructor(
    private eref: ElementRef,
    public service: CommonService,
    private spinner: NgxSpinnerService
  ) {
    // this.IsShowShopDashboard = this.service.permissionCheck("StoreDashbaord", CONST_VIEW_ACCESS);
    this.IsShowShopDashboard = true;
    this.loginType = localStorage.getItem("IdentityType");
  }

  ngOnInit() {
    this.chartFilterDefault = this.chartFilter = {
      FromDate: moment().subtract(1, "year"),
      ToDate: moment(),
    };
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Store Dashboard", path: "/", active: true },
    ];
    this.fetchData();
    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  fetchData() {
    this.spinner.show();
    var FromDate = moment(this.chartFilter.FromDate).format("YYYY-MM-DD");
    var ToDate = moment(this.chartFilter.ToDate).format("YYYY-MM-DD");
    var postData = {
      FromDate: FromDate != "Invalid date" ? FromDate : "",
      ToDate: ToDate != "Invalid date" ? ToDate : "",
    };
    this.service
      .postHttpService(postData, "getShopDashboard")
      .subscribe((response) => {
        if (response && response.responseData) {
          this.resultData = response.responseData;
          if (response.responseData.orderPerCustomerData.length > 0) {
            response.responseData.orderPerCustomerData.forEach(
              (element: { count: any; CompanyName: any }) => {
                this.customersChartSeries.push(element.count);
                this.customersChartlabels.push(element.CompanyName);
                this.chartLoad1();
              }
            );
          }
          if (response.responseData.orderSalesMonthlyData.length > 0) {
            response.responseData.orderSalesMonthlyData.forEach(
              (element: { total: any; month: any }) => {
                this.monthlyChartSeries.push(element.total);
                this.monthlyChartlabels.push(element.month);
                this.chartLoad2();
              }
            );
          }
          if (response.responseData.orderPerPartsData.length > 0) {
            response.responseData.orderPerPartsData.forEach(
              (element: { count: any; PartNo: any }) => {
                this.partsChartSeries.push(element.count);
                this.partsChartlabels.push(element.PartNo);
                this.chartLoad3();
              }
            );
          }
          if (response.responseData.orderStatusData.length > 0) {
            response.responseData.orderStatusData.forEach(
              (element: { count: any; StatusName: any }) => {
                this.statusChartSeries.push(element.count);
                this.statusChartlabels.push(element.StatusName);
                this.chartLoad4();
              }
            );
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      });
  }

  chartLoad1() {
    this.chartOptions = {
      series: [
        {
          name: "Number of Orders#",
          data: this.customersChartSeries,
        },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "11px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: ["#000"],
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: this.customersChartlabels,
      },
    };
  }
  chartLoad2() {
    this.chartOptions1 = {
      series: [
        {
          name: "$",
          data: this.monthlyChartSeries,
        },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "11px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: ["#000"],
        },
        formatter: function (val) {
          return "$ " + val;
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: this.monthlyChartlabels,
      },
    };
  }
  chartLoad3() {
    this.chartOptions2 = {
      series: [
        {
          name: "Selling Count's #",
          data: this.partsChartSeries,
        },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "11px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: ["#000"],
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: this.partsChartlabels,
      },
    };
  }
  chartLoad4() {
    this.chartOptions3 = {
      chart: {
        height: 375,
        type: "pie",
      },
      series: this.statusChartSeries,
      labels: this.statusChartlabels,
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        verticalAlign: "middle",
        floating: false,
        fontSize: "14px",
        offsetX: 0,
        offsetY: -10,
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "11px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: ["#000"],
        },
      },
    };
  }

  callChartFilter() {
    this.loading = true;
    this.clearData();
    var FromDate: any;
    var ToDate: any;
    FromDate = moment(this.chartFilter.FromDate).format("YYYY-MM-DD");
    ToDate = moment(this.chartFilter.ToDate).format("YYYY-MM-DD");
    // if(FromDate != "Invalid date" || ToDate != "Invalid date"){
    if (
      this.chartFilter.FromDate != this.chartFilterDefault.FromDate ||
      this.chartFilter.ToDate != this.chartFilterDefault.ToDate
    ) {
      this.showClearButton = true;
      var postData = {
        FromDate: FromDate,
        ToDate: ToDate,
      };

      this.service
        .postHttpService(postData, "getShopDashboard")
        .subscribe((response) => {
          if (response && response.responseData) {
            this.resultData = response.responseData;
            if (response.responseData.orderStatusData.length > 0) {
              response.responseData.orderStatusData.forEach(
                (element: { count: any; StatusName: any }) => {
                  this.statusChartSeries.push(element.count);
                  this.statusChartlabels.push(element.StatusName);
                  this.chartLoad4();
                }
              );
            }
            this.loading = false;
          } else {
            this.loading = false;
          }
        });
    } else {
      // if(this.chartFilter.FromDate == "" || this.chartFilter.ToDate == ""){
      //   //  ToDo
      // }else if(this.chartFilter.FromDate == null || this.chartFilter.ToDate == null){
      //   // this.fetchData();
      // }
      this.loading = false;
    }
  }

  clearData() {
    // this.resultData = [];
    // this.customersChartSeries = [];
    // this.customersChartlabels = [];

    // this.monthlyChartSeries = [];
    // this.monthlyChartlabels = [];

    // this.partsChartSeries = [];
    // this.partsChartlabels = [];

    this.statusChartSeries = [];
    this.statusChartlabels = [];

    // this.chartOptions = {};
    // this.chartOptions1 = {};
    // this.chartOptions2 = {};
    this.chartOptions3 = {};
  }

  callClear() {
    this.loading = true;
    this.chartFilter = this.chartFilterDefault;
    this.clearData();
    var FromDate = moment(this.chartFilter.FromDate).format("YYYY-MM-DD");
    var ToDate = moment(this.chartFilter.ToDate).format("YYYY-MM-DD");
    var postData = {
      FromDate: FromDate != "Invalid date" ? FromDate : "",
      ToDate: ToDate != "Invalid date" ? ToDate : "",
    };

    this.service
      .postHttpService(postData, "getShopDashboard")
      .subscribe((response) => {
        if (response && response.responseData) {
          this.resultData = response.responseData;
          if (response.responseData.orderStatusData.length > 0) {
            response.responseData.orderStatusData.forEach(
              (element: { count: any; StatusName: any }) => {
                this.statusChartSeries.push(element.count);
                this.statusChartlabels.push(element.StatusName);
                this.chartLoad4();
              }
            );
          }
          this.showClearButton = false;
          this.loading = false;
        } else {
          this.showClearButton = false;
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
