/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LineChart } from "@carbon/charts";
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Sellingproduct, Widget, ChartType } from '../../../admin-modules/dashboard/ah-dashboard/sellingproduct.model';
import { simpleLineChart } from './data1';
import { ChartType1 } from './chartist.model';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  ApexTheme
} from "ng-apexcharts";
import { array_rr_status, PurchaseOrder_Status, rr_status_vendor } from 'src/assets/data/dropdown';
import { Subject } from 'rxjs';
import { ScaleTypes } from '@carbon/charts/interfaces/enums';

export type basicColumChart = {
  simpleLineChart: ChartType1;
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
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})

export class VendorDashboardComponent implements OnInit, OnDestroy {
  Status;
  FromStatictisDate;
  ToStatictisDate;
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 15 Days': [moment().subtract(14, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  dateTodayFilter = { FromDate: moment(), ToDate: moment() };

  dateYesterdayFilter = { FromDate: moment().subtract(1, 'days'), ToDate: moment().subtract(1, 'days') };
  LoggedFilter = { FromDate: moment().subtract(29, 'days'), ToDate: moment() };
  breadCrumbItems: Array<{}>;
  @Input() dateFilterField;
  TodayStatus;
  YesterdayStatus;
  SubmittedYesterdayStatus
  SubmittedTodayStatus;
  //serverSide
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  //dtElement: DataTableDirective;
  dtOptions: any = {};
  dtOptions2: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  dataTable2: any;
  basicColumChart: ChartType;
  chartOptions
  loggedInStatus;
  dates: any = [];
  Completed: any = [];
  AwaitingQuote: any = [];
  Quoted: any = [];
  Approved: any = [];
  Rejected: any = []
  arrLength: any = [];
  dataSeries: any = [];
  public isOpen = false;
  simpleLineChart: ChartType1;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  timelineChartData = [];
  timelineChartOption;
  isTimelineChartShow = true;
  dateFilterFieldForChart;
  _toggleWindow() {
    this.isOpen = !this.isOpen;
  }
  constructor(private datepipe: DatePipe, public commonService: CommonService, private http: HttpClient,
    public router: Router, private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent, private datePipe: DatePipe,) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }
  ngOnInit(): void {
    let date = new Date();
    this.dateFilterFieldForChart = { day: date.getDate(), month: (date.getMonth() + 1), year: date.getFullYear() };
    this.simpleLineChart = simpleLineChart;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/VendorPortal/getVendorPortalDashboardPODue';
    var url2 = this.baseUrl + '/api/v1.0/VendorPortal/RushandWarrantyListOfRRByVendorId';
    const chartHolder = document.getElementById('timelineChartData');
    const data = [];
    const options = {
      // title: '',
      axes: {
        left: {
          mapsTo: 'key',
          scaleType: ScaleTypes.LINEAR,
          title: 'Date'
        },
        bottom: {
          scaleType: ScaleTypes.TIME,
          mapsTo: 'date',
          title: 'Date'
        },
      },
      curve: 'curveMonotoneX',
      height: '400px',
      color: {
        scale: {
          'Sourced': '#f58091',
          'Quoted': '#8c83d9',
          'Approved': '#f9ca78',
          'Completed': '#53cdb5',
        }
      },
    };

    this.timelineChartOption = new LineChart(chartHolder, {
      data,
      options
    });
    this.onChartDateChange(this.dateFilterFieldForChart);

    const that = this;
    var filterData = {}
    var filterData2 = {}
    // var filterData3 = {PartId:this.PartId}

    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      // that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.http.post<any>(url,
        Object.assign(dataTablesParameters,
          filterData
        ), httpOptions).subscribe(resp => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
        });
    };

    this.dtOptions["columns"] = [
      {
        data: 'RRNo', width: '10%', name: 'RRNo', defaultContent: '', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {
          return '<a href="#" class="actionView" ngbTooltip="View">' + row.RRNo + '</a>'
        }
      },
      { data: 'GrandTotal', width: '10%', name: 'GrandTotal', defaultContent: '', orderable: true, searchable: true },
      { data: 'DueDate', width: '20%', name: 'DueDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'DueDateDiff', width: '10%', name: 'DueDateDiff', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Status', width: '5%', name: 'Status', defaultContent: '', orderable: true, searchable: true, }

    ];

    this.dtOptions2 = this.getdtOption2();
    this.dtOptions2["ajax"] = (dataTablesParameters: any, callback) => {
      // that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.http.post<any>(url2,
        Object.assign(dataTablesParameters,
          filterData2
        ), httpOptions).subscribe(resp => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.data || []
          });
        });
    };

    this.dtOptions2["columns"] = [
      {
        data: 'RRNo', name: 'RRNo', width: '10%', defaultContent: '', orderable: true, searchable: true,
        render: (data: any, type: any, row: any, meta) => {

          //RepairMessage show condition
          var repairMessage = ''
          var repairMessage1 = ''

          if (row.IsRushRepair == 1) {
            var repairMessage = "Rush Repair"
          }
          if (row.IsWarrantyRecovery == 1) {
            var repairMessage = "Warranty Repair"
          }
          if (row.IsWarrantyRecovery == 2) {
            var repairMessage = "Warranty New"
          }
          if ((row.IsRushRepair == 1) && (row.IsWarrantyRecovery == 1)) {
            var repairMessage = "Rush Repair"
            var repairMessage1 = "Warranty Repair"
          }
          return `<a href="#/vendor/RR-edit?RRId=${row.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${row.RRNo}</a><br><span style="font-weight: bold;padding: 0px;color: red">${repairMessage} <br> ${repairMessage1}</span>`;
        }
      },
      { data: 'PartNo', name: 'PartNo', width: '10%', defaultContent: '', orderable: true, searchable: true },
      { data: 'Created', name: 'Created', width: '10%', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Status', name: 'Status', width: '25%', defaultContent: '', orderable: true, searchable: true, }

    ];

    this.dataTable = $('#datatable-angular-PODue');
    this.dataTable.DataTable(this.dtOptions);

    this.dataTable2 = $('#datatable-angular-rushWarrantyRR');
    this.dataTable2.DataTable(this.dtOptions2);


    this.LoggedInStatus();
    const years = Number(this.datePipe.transform(date, 'yyyy'));
    const Month = Number(this.datePipe.transform(date, 'MM'));
    const Day = Number(this.datePipe.transform(date, 'dd'));
    const CurrentDate = (Day / Month / years).toString()
    this.getChartStatusByDate(CurrentDate);

    this.onStatus();

  }

  onChartDateChange(event) {
    let date = (event.day < 10 ? ('0' + event.day) : event.day) + '/' + (event.month < 10 ? ('0' + event.month) : event.month) + '/' + event.year;
    this.getChartStatusByDate(date);
  }

  getChartStatusByDate(date = '24/02/2021') {
    let obj = this;
    obj.timelineChartData = [];
    obj.isTimelineChartShow = false;
    this.commonService.postHttpService({
      Date: date
    }, 'ChartStatusByDate').subscribe(response => {
      if (response.status == true) {
        [
          'Approved',
          'Completed',
          'Quoted',
          'Sourced',
        ].forEach(function (key) {
          if (response.responseData[key].length > 0) {
            obj.isTimelineChartShow = true;
            response.responseData[key].forEach(function (value) {
              obj.timelineChartData.push({
                'group': key,
                'date': value.Date,
                'key': value.Count,
              });
            });
          }
        });
        obj.timelineChartOption.model.setData(obj.timelineChartData);
      }
      else {
        obj.timelineChartOption.model.setData(obj.timelineChartData);
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getdtOption() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-3 col-sm-3 col-md-3 col-xl-3"l><"col-4 col-sm-4 col-md-4 col-xl-4"i><"col-5 col-sm-5 col-md-5 col-xl-5"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      autoWidth: false,
      serverSide: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: {
        dom: {
          button: {
            className: ''
          }

        },
        buttons: []
      },


      //columnDefs: [{width: '10%', targets:0}],
      createdRow: function (row, data, index) {
        var symbol = '$'
        var html = '<span>' + data.CurrencySymbol+ ' ' + + data.GrandTotal + '</span>'
        $('td', row).eq(1).html(html);

        var Difference_In_Days = "Days";
        var html = '<span class="badge badge-danger">' + data.DueDateDiff + " " + Difference_In_Days + '</span>';
        $('td', row).eq(3).html(html);

        var statusObj = PurchaseOrder_Status.find(a => a.PurchaseOrder_StateId == data.Status)
        var html = '<span class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.PurchaseOrder_StateName : '') + '</span>';
        $('td', row).eq(4).html(html);

       // Set the RRNo
        var number = '';
       if (data.RRNo != '' && data.RRNo != '0' && data.RRNo != null) {
       number = data.RRNo;
       var html = `<a href="#/vendor/RR-edit?RRId=${data.RRId}" target="_blank"  data-toggle='tooltip' title='RR View' data-placement='top'>${number}</a>`;
       $('td', row).eq(0).html(html);
       } 

      },
      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('vendor/RR-edit', { RRId: data.RRId });
        });
        return row;
      },

      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        }
      }
    };
  }

  getdtOption2() {
    return {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-6 col-md-6 col-xl-6"l><"col-12 col-sm-6 col-md-6 col-xl-6"i><"col-12 col-sm-12 col-md-12 col-xl-12"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      buttons: {
        dom: {
          button: {
            className: ''
          }
        },
        buttons: []
      },
      createdRow: function (row, data, index) {

        var statusObj = rr_status_vendor.find(a => a.id == data.Status)
        var html = '<span class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.title : '') + '</span>';
        $('td', row).eq(3).html(html);

      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView3', row).unbind('click');
        $('.actionView3', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });

        $('.actionView1', row).unbind('click');
        $('.actionView1', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('vendor/RR-edit', { RRId: data.RRId });
        });
        return row;
      },

      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        }
      }
    };



  }


  todayStatus() {
    var postData = {
      "FromDate": moment(this.dateTodayFilter.FromDate).format("YYYY-MM-DD"),
      "ToDate": moment(this.dateTodayFilter.ToDate).format("YYYY-MM-DD")

    }
    this.commonService.postHttpService(postData, "VendorDashboardStatisticsCount").subscribe(response => {
      if (response.status == true) {
        this.TodayStatus = response.responseData.ExceptSubmittedCount;



      }
      else {



      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }

  onStatus() {
    var postData = {
      "FromDate": "",
      "ToDate": ""
    }
    this.commonService.postHttpService(postData, "VendorDashboardStatisticsCount").subscribe(response => {
      if (response.status == true) {

        this.YesterdayStatus = response.responseData.ExceptSubmittedCount;


      }
      else {



      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }


  LoggedInStatus() {
    var postData = {
      "FromDate": moment(this.LoggedFilter.FromDate).format("YYYY-MM-DD"),
      "ToDate": moment(this.LoggedFilter.ToDate).format("YYYY-MM-DD")

    }
    this.dates = [];
    this.AwaitingQuote = [];
    this.Completed = []
    this.Quoted = [];
    this.Rejected = [];
    this.Approved = []
    this.commonService.postHttpService(postData, "VendorloggedInStatusBarChart").subscribe(response => {
      if (response.status == true) {

        this.loggedInStatus = response.responseData

        for (var i = 0; i < this.loggedInStatus.length; i++) {

          this.dates.push(this.loggedInStatus[i].Date);
          this.AwaitingQuote.push(this.loggedInStatus[i].AwaitingQuote);
          this.Quoted.push(this.loggedInStatus[i].Quoted)
          this.Approved.push(this.loggedInStatus[i].Approved)
          this.Rejected.push(this.loggedInStatus[i].Rejected)
          this.Completed.push(this.loggedInStatus[i].Completed)


          this.dataSeries = [
            {
              "name": "Awaiting Quote",
              "data": this.AwaitingQuote,
            },

            {
              "name": "Quoted",
              "data": this.Quoted,
            },
            {
              "name": "Approved",
              "data": this.Approved
            },
            {
              "name": "Rejected",
              "data": this.Rejected
            },
            {
              "name": "Completed",
              "data": this.Completed
            },
          ]
        }
        this.arrLength = this.loggedInStatus;
        var uniqueDates = []
        $.each(this.dates, function (i, el) {
          if ($.inArray(el, uniqueDates) === -1) uniqueDates.push(el);
        });
        const basicColumChart: ChartType = {

          series: this.dataSeries,
          chart: {
            id: "barChart",
            type: "bar",
            height: 350,
            width: '100%',
            stacked: true,
          },
          colors: ['#37cde6', '#6559cc', '#f7b84b', '#f1556c', '#53cdb5'],
          stroke: {
            width: 1,
            colors: ["#fff"]
          },
          xaxis: {
            categories: uniqueDates,
            labels: {
              formatter: function (val) {
                return val;
              }
            }
          },
          yaxis: {
            title: {
              text: undefined
            }
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + '';
              }
            },
            x: {
              formatter: function (val) {
                return val + '';
              }
            },
            theme: "light"
          },
          /* theme: {
            palette: "palette1"
          }, */
          fill: {
            opacity: 1
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center"
          }
        };

        this.basicColumChart = basicColumChart;
      }
      else {



      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }


  onStatusList(value) {
    this.Status = value
    var StatusName = rr_status_vendor.find(a => a.id == value)
    this.FromStatictisDate = moment(this.dateTodayFilter.FromDate).format("YYYY-MM-DD"),
      this.ToStatictisDate = moment(this.dateTodayFilter.ToDate).format("YYYY-MM-DD")
    this.navCtrl.navigate('vendor/RR-list', { StatusName: StatusName, Status: this.Status, FromDate: this.FromStatictisDate, ToDate: this.ToStatictisDate, DateType: 0 });
  }

  onYesterdayStatusList(value) {
    this.Status = value
    var StatusName = rr_status_vendor.find(a => a.id == value)

    this.navCtrl.navigate('vendor/RR-list', { StatusName: StatusName, Status: this.Status, FromDate: this.FromStatictisDate, ToDate: this.ToStatictisDate, DateType: 1 });

  }
}
