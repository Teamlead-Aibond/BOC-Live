import { Component, OnInit, ViewChild, OnDestroy, Input } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import * as moment from "moment";
import Swal from "sweetalert2";

import { DataTableDirective } from "angular-datatables";
import pdfMake from "pdfmake/build/pdfmake.min.js";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";
import { CommonService } from "src/app/core/services/common.service";
import { AppConfig } from "config";
import { environment } from "src/environments/environment";

import {
  // tslint:disable-next-line: max-line-length
  sparklineChart,
  sparklineSalesChart,
  sparklineExpensesChart,
  sparklineProfitsChart,
  linewithDataChart,
  gradientLineChart,
  stackedAreaChart,
  basicColumChart,
  basicColumChart1,
  basicBarChart,
  nagativeValueBarChart,
  lineColumAreaChart,
  multipleYAxisChart,
  simpleBubbleChart,
  scatterChart,
  simplePieChart,
  gradientDonutChart,
  patternedDonutChart,
  basicRadialBarChart,
  multipleRadialBars,
  strokedCircularGuage,
} from "./data";

import { ChartType } from "./apex.model";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexStroke,
  ApexYAxis,
  ApexTooltip,
  ApexMarkers,
  ApexXAxis,
} from "ng-apexcharts";
import { ChangeDetectorRef } from "@angular/core";
import { interval, Subject, Subscription } from "rxjs";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  labels: string[];
  stroke: ApexStroke;
  markers: ApexMarkers;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-inventory-dashboard",
  templateUrl: "./inventory-dashboard.component.html",
  styleUrls: ["./inventory-dashboard.component.scss"],
})
export class InventoryDashboardComponent implements OnInit {
  // Datepicker
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

  baseUrl = `${environment.api.apiURL}`;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;

  @Input() dateFilterField;

  // bread crumb data
  breadCrumbItems: Array<{}>;

  // sparkline chart common data
  sparklineChart: ChartType;

  // sparkline total sales chart
  sparklineSalesChart: ChartType;
  // sparkline expenses chart
  sparklineExpensesChart: ChartType;
  // sparkline profis chart
  sparklineProfitsChart: ChartType;

  // Line with datalabel chart
  linewithDataChart: ChartType;
  // Gradient line chart
  gradientLineChart: ChartType;
  // Stacked Area chart
  stackedAreaChart: ChartType;
  // Basic Colum Chart
  basicColumChart: ChartType;
  basicColumChart1: ChartType;

  // Basic bar chart
  basicBarChart: ChartType;
  // Bar with Negative Values
  nagativeValueBarChart: ChartType;

  // Line column Area chart
  lineColumAreaChart: ChartType;
  // Multiple Y-Axis chart
  multipleYAxisChart: ChartType;

  // Simple Bubble chart
  simpleBubbleChart: ChartType;
  // Scatter chart
  scatterChart: ChartType;

  // Simple pie chart
  simplePieChart: ChartType;
  gradientDonutChart: ChartType;
  patternedDonutChart: ChartType;
  // RadialBar chart
  basicRadialBarChart: ChartType;
  multipleRadialBars: ChartType;
  strokedCircularGuage: ChartType;
  TodayStatisticsCount;
  YesterdayStatisticsCount;
  InventorySummary;

  public intervalTimer = interval(6000);
  private subscription: Subscription;
  private intervalSubscription: Subscription;
  constructor(
    public service: CommonService,
    private http: HttpClient,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;

    this.chartOptions = {
      series: [
        {
          name: "Units per Transaction",
          type: "area",
          data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33],
        },
        {
          name: "Price Per Transaction",
          type: "line",
          data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43],
        },
      ],
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        type: "solid",
        opacity: [0.35, 1],
      },
      labels: [
        "Jan 21",
        "Feb 21",
        "Mar 21",
        "Apr 21",
        "May 21",
        "Jun 21",
        "Jul 21",
        "Aug 21",
        "Sep 21 ",
        "Oct 21",
        "Nov 21",
        "Dec 21",
      ],
      markers: {
        size: 0,
      },
      yaxis: [
        {
          title: {
            text: "Series A",
          },
        },
        {
          opposite: true,
          title: {
            text: "Series B",
          },
        },
      ],
      xaxis: {
        labels: {
          trim: false,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          },
        },
      },
    };
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Inventory", path: "/" },
      { label: "Dashboard", path: "/", active: true },
    ];
    this.TodayStatisticsCount = "";
    this.YesterdayStatisticsCount = "";
    this.InventorySummary = "";
    this.onInventorySummary();
    this.onTodayStatisticsCount();
    this.onYesterdayStatisticsCount();
    this.intervalSubscription = this.intervalTimer.subscribe(() => {
      this.onInventorySummary();
      this.onTodayStatisticsCount();
      this.onYesterdayStatisticsCount();
    });

    /**
     * fetches data
     */
    this._fetchData();
  }

  onTodayStatisticsCount() {
    var postData = {
      FromDate: moment(this.dateTodayFilter.FromDate).format("YYYY-MM-DD"),
      ToDate: moment(this.dateTodayFilter.ToDate).format("YYYY-MM-DD"),
    };
    this.service
      .postHttpService(postData, "InventoryDashboardStatisticsCount")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.TodayStatisticsCount = response.responseData[0];
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  onInventorySummary() {
    var postData = {};
    // window.setInterval(() => {

    this.service
      .postHttpService(postData, "DashboardSummaryStatisticsCount")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.InventorySummary = response.responseData[0];
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    // }, 6000);
  }

  onYesterdayStatisticsCount() {
    var postData = {
      FromDate: moment(this.dateYesterdayFilter.FromDate).format("YYYY-MM-DD"),
      ToDate: moment(this.dateYesterdayFilter.ToDate).format("YYYY-MM-DD"),
    };
    this.service
      .postHttpService(postData, "InventoryDashboardStatisticsCount")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.YesterdayStatisticsCount = response.responseData[0];
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  /**
   * Content Refresh
   */
  contentRefresh() {
    console.log("Content Refresh Requested");
  }

  private _fetchData() {
    // Sparkline chart data
    this.sparklineChart = sparklineChart;

    // sparkline total sales
    this.sparklineSalesChart = sparklineSalesChart;
    // sparkline expenses
    this.sparklineExpensesChart = sparklineExpensesChart;
    // sparkline profits
    this.sparklineProfitsChart = sparklineProfitsChart;

    // line with label chart
    this.linewithDataChart = linewithDataChart;
    // Gradient line chart
    this.gradientLineChart = gradientLineChart;

    // Stacked area chart data
    this.stackedAreaChart = stackedAreaChart;
    // Basic colum chart data
    this.basicColumChart = basicColumChart;
    this.basicColumChart1 = basicColumChart1;

    // Basic bar chart data
    this.basicBarChart = basicBarChart;
    // Bar with Negative Values
    this.nagativeValueBarChart = nagativeValueBarChart;

    // Line column Area chart data
    this.lineColumAreaChart = lineColumAreaChart;
    // Multiple y axis chart data
    this.multipleYAxisChart = multipleYAxisChart;

    // Simple Bubble chart data
    this.simpleBubbleChart = simpleBubbleChart;
    // Scatter Chart
    this.scatterChart = scatterChart;

    // Pie Charts
    this.simplePieChart = simplePieChart;
    this.gradientDonutChart = gradientDonutChart;
    this.patternedDonutChart = patternedDonutChart;

    // RadialBar Charts
    this.basicRadialBarChart = basicRadialBarChart;
    this.multipleRadialBars = multipleRadialBars;
    this.strokedCircularGuage = strokedCircularGuage;
  }
  //@ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  }

  ngOnDestroy() {
    if (this.intervalSubscription) this.intervalSubscription.unsubscribe();
  }
}
