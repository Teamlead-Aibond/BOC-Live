/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { CommonService } from 'src/app/core/services/common.service';
import { DatePipe } from '@angular/common';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { YEAR_FILTER_START } from 'src/assets/data/dropdown';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
export type ChartOptions3 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};
@Component({
  selector: 'app-repair-and-savings-report',
  templateUrl: './repair-and-savings-report.component.html',
  styleUrls: ['./repair-and-savings-report.component.scss']
})
export class RepairAndSavingsReportComponent implements OnInit {
  _opened: boolean = false;
  _showBackdrop: boolean = true;
  RepairStatus: string;
  YearlySummaryList: any;
  _toggleSidebar() {
    this._opened = !this._opened;
  }
  //Filter
  selectedYear;
  FromDate;
  Fromdate;
  Todate;
  ToDate;
  CustomerId = '';
  PartNo;
  VendorId;
  vendorList;
  date = new Date();
  syear = 2010;
  currentYear = this.date.getFullYear();

  FailedPartByStatus;
  CostSavingsByCategory;
  YearlySummary: any = [];
  AverageTurnAroundTime;
  SourceRatio: any = [];

  monthList = [];
  noOfRepairProcessedList = [];
  totalRepairSpendList = [];
  totalSavingsList = [];

  CostSavingsChart: any = [];
  CostSavingsMonthList = [];
  CostSavingsMonthData = [];

  FailedPartByStatusChart: any = [];
  FailedPartMonthList = [];
  FailedPartMonthData = [];

  TotalRepairSpendChart: any = [];
  TotalRepairMonthList = [];
  TotalRepairMonthData = [];

  yearRange = [];

  //dropdowns
  customerList: any = [];

  totalRepairs = 0;
  totalRepairsSpend = 0;
  totalSavings = 0;

  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptions3: Partial<ChartOptions3>;

  constructor(public service: CommonService, private datePipe: DatePipe, public navCtrl: NgxNavigationWithDataComponent, private cd_ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getCustomerList();
    this.getYearDropDown(YEAR_FILTER_START, this.currentYear);
    this.selectedYear = this.currentYear;
    this._fetchData();
  }

  getCustomerList() {
    this.service.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
      //this.customerList = response.responseData
    });
  }

  getYearDropDown(startYear, endYear) {
    this.yearRange = [];
    for (var i = startYear; i <= endYear; i++) {
      this.yearRange.push(i);
    } //console.log(this.yearRange, 'yearRange')
  }

  getVendorList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }

  _fetchData() {


    this.FailedPartByStatus="";
    this.CostSavingsByCategory="";
    this.AverageTurnAroundTime=""

    // Set the date
    var firstDay = new Date(this.selectedYear, 0, 1);
    var lastDay = new Date(this.selectedYear, 12, 0);
    this.Fromdate = moment(firstDay).format('YYYY-MM-DD');
    this.Todate = moment(lastDay).format('YYYY-MM-DD');

    var postData = {
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
      "CustomerId": this.CustomerId
    }

    this.service.postHttpService(postData, 'RepairSavingsReport').subscribe(response => {
      // console.log('RepairSavingsReport', response)
      if (response.status == true) {
        this.FailedPartByStatus = response.responseData.FailedPartByStatus || "";
        this.CostSavingsByCategory = response.responseData.CostSavingsByCategory|| "";
        this.YearlySummary = response.responseData.YearlySummary|| [];
        this.AverageTurnAroundTime = response.responseData.AverageTurnAroundTime|| "";
        this.SourceRatio = response.responseData.SourceRatio || [];

        this.CostSavingsChart = response.responseData.CostSavingsChart;
        this.FailedPartByStatusChart = response.responseData.FailedPartByStatusChart;
        this.TotalRepairSpendChart = response.responseData.TotalRepairSpendChart;

        this.monthList.length = 0;
        this.noOfRepairProcessedList.length = 0;
        this.totalRepairSpendList.length = 0;
        this.totalSavingsList.length = 0;

        this.totalRepairs = 0;
        this.totalRepairsSpend = 0;
        this.totalSavings = 0; //console.log(this.YearlySummary.length, 'YearlySummary');

        if (this.YearlySummary.length > 0) {
          this.YearlySummary.forEach((value) => {
            this.monthList.push(value.Month);
            this.noOfRepairProcessedList.push(value.NoOfRepairProcessed);
            this.totalRepairSpendList.push(value.TotalRepairSpend);
            this.totalSavingsList.push(value.TotalSavings);
          })

          if (this.noOfRepairProcessedList.length > 0) 
          this.noOfRepairProcessedList.forEach(a =>
             this.totalRepairs =this.noOfRepairProcessedList.reduce((a, b) => a + b) );
          if (this.totalRepairSpendList.length > 0) this.totalRepairSpendList.forEach(a =>
             this.totalRepairsSpend = this.totalRepairSpendList.reduce((a, b) => a + b));
          if (this.totalSavingsList.length > 0) 
          this.totalRepairSpendList.forEach(a =>
          this.totalSavings=this.totalSavingsList.reduce((a, b) => a + b))
        }               

        // Cost Savings Comparison
        this.CostSavingsMonthList = [];
        this.CostSavingsMonthData = [];
        this.CostSavingsChart.forEach((value) => {
          this.CostSavingsMonthList.push(value.Month);
          this.CostSavingsMonthData.push(value.TotalSaving);
        })
        //console.log('this.CostSavingsMonthData', this.CostSavingsMonthData)
        this.chartOptions = {
          series: [
            {
              name: "Total Savings 2020",
              data: this.CostSavingsMonthData
            }
          ],
          chart: {
            type: "bar",
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              // endingShape: "rounded"
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
          },
          xaxis: {
            categories: this.CostSavingsMonthList
          },

          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val;
              }
            }
          }
        };

        // No.of Failed Parts Comparison
        this.FailedPartMonthList = [];
        this.FailedPartMonthData = [];
        this.FailedPartByStatusChart.forEach((value) => {
          this.FailedPartMonthList.push(value.Month);
          this.FailedPartMonthData.push(value.NoOfFailedPart);
        })
        this.chartOptions2 = {
          series: [
            {
              name: "No.Of Repairs Processed 2020",
              data: this.FailedPartMonthData
            }
          ],
          chart: {
            height: 370,
            type: "line",
            dropShadow: {
              enabled: true,
              color: "#000",
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.5
            },
            toolbar: {
              show: false
            }
          },
          colors: ["#77B6EA", "#545454"],
          dataLabels: {
            enabled: true
          },
          stroke: {
            curve: "smooth"
          },
          grid: {
            borderColor: "#e7e7e7",
            row: {
              colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
              opacity: 0.5
            }
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: this.FailedPartMonthList,
            title: {
              text: ""
            }
          },
          legend: {
            position: "top",
            horizontalAlign: "right",
            floating: true,
            offsetY: -25,
            offsetX: -5
          }
        };

        // Total Repair Spend Comparison
        this.TotalRepairMonthList = [];
        this.TotalRepairMonthData = [];
        this.TotalRepairSpendChart.forEach((value) => {
          this.TotalRepairMonthList.push(value.Month);
          this.TotalRepairMonthData.push(value.TotalRepairSpend);
        })
        this.chartOptions3 = {
          series: [
            {
              name: "basic",
              data: this.TotalRepairMonthData
            }
          ],
          chart: {
            type: "bar",
            height: 400
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: this.TotalRepairMonthList
          }
        };

      }
    });
  }

  onFilter(event) {
    this.totalRepairs = 0;
    this.totalRepairsSpend = 0;
    this.totalSavings = 0; 
    this._fetchData();
    this._opened = !this._opened;
  }

  onClear(event) {
    this.CustomerId = "";
    this.selectedYear = this.currentYear;

    this._fetchData();
    this._opened = !this._opened;
  }
}
