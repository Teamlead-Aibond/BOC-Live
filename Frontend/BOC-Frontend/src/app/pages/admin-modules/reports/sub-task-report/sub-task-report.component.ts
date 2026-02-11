import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
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
  piechartcolor?: any;
  toolbar?: any;
  stacked?: any;
  color?: any;
  width?: any;
  padding?: any;
  fixed?: any;
  x?: any;
  y?: any;
  marker?: any;
  show?: any;
  curve?: any;
}
@Component({
  selector: 'app-sub-task-report',
  templateUrl: './sub-task-report.component.html',
  styleUrls: ['./sub-task-report.component.scss']
})
export class SubTaskReportComponent implements OnInit, OnDestroy {


  //Server Side
  baseUrl = `${environment.api.apiURL}`;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  dataTableMessage;
  api_check: any;
  dataTable: any;
  isCollapsed: boolean;
  public isOpen = false;
  basicColumChart

  FooterRight
  FooterLeft

  Task: any = []
  adminListddl: any = []
  TaskByUserChart
  CompletedTaskByUserChart
  NumberofTask
  UserId
  _toggleWindow() {
    this.isOpen = !this.isOpen;
  }
  constructor(public service: CommonService, private datePipe: DatePipe, private http: HttpClient, public navCtrl: NgxNavigationWithDataComponent, private cd_ref: ChangeDetectorRef,) { }

  ngOnInit() {
    this.isCollapsed = false;
    this.getAdminList()
    this.AverageDaysTask();
    this.TaskByUser();
    this.CompletedTaskByUser()
    this.onActiveTaskList();
  }




  AverageDaysTask() {

    this.Task = ['Awaiting RQ', 'Awaiting RMA', 'Awaiting RGA']
    var Days =
      [
        {
          "name": "Awaiting RQ",
          "data": [62, 0, 0],
          "backgroundColor": "#34568B"
        },
        {
          "name": "Awaiting RMA",
          "data": [0, 70, 0],
          "backgroundColor": "#FF6F61"
        },
        {
          "name": "Awaiting RGA",
          "data": [0, 0, 10],
          "backgroundColor": "#6B5B95"
        },
      ]


    const basicColumChart: ChartType = {

      series: Days,
      chart: {
        id: "barChart",
        type: "bar",
        height: 350,
        width: '100%',
        stacked: true,
      },
      colors: ['#f37f90', '#8c83d9', '#69daec', '#53cdb5'],
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: this.Task,
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

  TaskByUser() {

    var User = ['Dev User', 'User2', 'User3']
    var NoofTask =
      [
        {
          "name": "Dev User",
          "data": [50, 0, 0],
        },
        {
          "name": "User2",
          "data": [0, 10, 0],
        },
        {
          "name": "User3",
          "data": [0, 0, 80],
        },
      ]

    const basicColumChart: ChartType = {

      series: NoofTask,
      chart: {
        id: "barChart",
        type: "bar",
        height: 350,
        width: '100%',
        stacked: true,
      },
      colors: ['#34568B', '#FF6F61', '#6B5B95', '#53cdb5'],
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: User,
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
    this.TaskByUserChart = basicColumChart;
  }
  CompletedTaskByUser() {

    var User = ['Dev User', 'User2', 'User3']
    var NoofTask =
      [
        {
          "name": "Dev User",
          "data": [100, 0, 0],
        },
        {
          "name": "User2",
          "data": [0, 104, 0],
        },
        {
          "name": "User3",
          "data": [0, 0, 250],
        },
      ]

    const basicColumChart: ChartType = {

      series: NoofTask,
      chart: {
        id: "barChart",
        type: "bar",
        height: 350,
        width: '100%',
        stacked: true,
      },
      colors: ['#34568B', '#FF6F61', '#6B5B95', '#53cdb5'],
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: User,
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
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
    };
    this.CompletedTaskByUserChart = basicColumChart;
  }

  onActiveTaskList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url3 = this.baseUrl + '';
    const that = this;
    var filterData = {
      "NumberofTask": this.NumberofTask,
      "UserId": this.UserId,
    }
    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.api_check = that.http.post<any>(url3,
        Object.assign(dataTablesParameters,
          filterData
        ), httpOptions).subscribe(resp => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.Part
          });
          // Calling the DT trigger to manually render the table
          this.dtTrigger.next()
        });

    };


    this.dtOptions["columns"] = [
      { data: 'RRNo', width: '10%', name: 'RRNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'CompanyName', width: '10%', name: 'CompanyName', defaultContent: '', orderable: true, searchable: true },
      { data: 'PartNo', width: '10%', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'SubStatus', width: '10%', name: 'Manufacturer', defaultContent: '', orderable: true, searchable: true },
      { data: 'AssignedBy', width: '10%', name: 'TotalRepairCost', defaultContent: '', orderable: true, searchable: true },

    ];

    this.dataTable = $('#datatable-angular-ActiveTaskList');
    this.dataTable.DataTable(this.dtOptions);

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
      searching: false,
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

      columnDefs: [

      ],

      createdRow: function (row, data, index) {




      },

      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView2', row).unbind('click');
        $('.actionView2', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
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
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onActiveTaskList()
    });
  }

  onClear() {
    this.UserId = ''
    this.NumberofTask = ''
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onActiveTaskList()
    });
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  getAdminList() {
    this.service.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminListddl = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName, "UserId": value.UserId }
      });
    });
  }


}
