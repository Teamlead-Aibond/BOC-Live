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
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { ChartType } from '../charttype.model';
import { concat, Observable, of, Subject } from 'rxjs';
import { rr_status_customer } from 'src/assets/data/dropdown';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  Status;
  FromStatictisDate;
  ToStatictisDate;
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean
  customerList:any=[]
  Customer = [];
  customer = []
  @ViewChild(DaterangepickerDirective, {static: true}) picker: DaterangepickerDirective;
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

  OverallSummary = { FromDate: '', ToDate: '' };
  LoggedFilter = { FromDate: moment().subtract(29, 'days'), ToDate: moment() };
  breadCrumbItems: Array<{}>;
  @Input() dateFilterField;
  TodayStatus;
  YesterdayStatus;
  public isOpen = false;

  _toggleWindow() {
    this.isOpen = !this.isOpen;
  }
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
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  SubmittedYesterdayCount;
  SubmittedTodayCount;
  basicColumChart: ChartType;
  chartOptions
  loggedInStatus;
  dates: any = [];
  Completed: any = [];
  RRReceived: any = [];
  RRWaitingForCustomerApproval: any = [];
  RepairInProgress: any = [];
  arrLength: any = [];
  dataSeries: any = []

  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];

  constructor(private datepipe: DatePipe, public commonService: CommonService, private http: HttpClient,
    public router: Router, private cd_ref: ChangeDetectorRef,
    public navCtrl: NgxNavigationWithDataComponent,) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }
  ngOnInit(): void {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/CustomerPortal/getDueListOfInvoiceByCustomerId';
    var url2 = this.baseUrl + '/api/v1.0/CustomerPortal/getRushandWarrantyListOfRRByCustomerId';

    const that = this;
    var filterData = {}
    var filterData2 = {}
    // var filterData3 = {PartId:this.PartId}

    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.api_check = that.http.post<any>(url,
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
          return`<a href="#/customer/RR-edit?RRId=${row.RRId}" target="_blank"  ngbTooltip="View">${row.RRNo}</a>`
        }
      },
      { data: 'PartNo', width: '10%', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'InvoiceDate', width: '20%', name: 'InvoiceDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'DueDate', width: '10%', name: 'DueDate', defaultContent: '', orderable: true, searchable: true, },
      { data: 'DueDateDiff', width: '15%', name: 'DueDateDiff', defaultContent: '', orderable: true, searchable: true, }

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
          return `<a href="#/customer/RR-edit?RRId=${row.RRId}" target="_blank"  ngbTooltip="View">${row.RRNo}</a>` + '<br>' + '<span style="font-weight: bold;padding: 0px;color: red">' + repairMessage + '<br>' + repairMessage1 + '</span>';
        }
      },
      { data: 'PartNo', name: 'PartNo', width: '10%', defaultContent: '', orderable: true, searchable: true },
      { data: 'RRImage', name: 'RRImage', orderable: true, searchable: true },
 // { data: 'VendorName', name: 'VendorName', width: '30%', defaultContent: '', orderable: true, searchable: true },
      { data: 'Created', name: 'Created', width: '10%', defaultContent: '', orderable: true, searchable: true, },
      { data: 'Status', name: 'Status', width: '25%', defaultContent: '', orderable: true, searchable: true, }

    ];

    this.dataTable = $('#datatable-angular-invoiceDue');
    this.dataTable.DataTable(this.dtOptions);

    this.dataTable2 = $('#datatable-angular-rushWarrantyRR');
    this.dataTable2.DataTable(this.dtOptions2);



    this.LoggedInStatus();
    this.onStatus();
    this.loadCustomers();

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


        var Difference_In_Days = "Days";


        var html = '<span class="badge badge-danger">' + data.DueDateDiff + " " + Difference_In_Days + '</span>';
        $('td', row).eq(4).html(html);
      },





      rowCallback: (row: Node, data: any | Object, index: number) => {
        $('.actionView', row).unbind('click');
        $('.actionView', row).bind('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.navCtrl.navigate('/customer/RR-edit', { RRId: data.RRId });
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
//image row
html = '<img  class="rounded-square img-thumbnail avatar-xl" src="assets/images/No Image Available.png">';
if (data.RRImage != '' && data.RRImage != 'undefined' && data.RRImage != null)
  html = '<img  class="rounded-square img-thumbnail avatar-xl" src="' + data.RRImage + '">';;
$('td', row).eq(2).html(html);

        var statusObj = rr_status_customer.find(a => a.id == data.Status)
        var html = '<span class="badge ' + (statusObj ? statusObj.cstyle : '') + ' btn-xs">' + (statusObj ? statusObj.title : '') + '</span>';
        $('td', row).eq(4).html(html);
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
          this.navCtrl.navigate('/customer/RR-edit', { RRId: data.RRId });
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
      "ToDate": moment(this.dateTodayFilter.ToDate).format("YYYY-MM-DD"),
      "CustomerId":this.customer

    }
    this.commonService.postHttpService(postData, "CustomerDashboardStatisticsCount").subscribe(response => {
      if (response.status == true) {
        this.TodayStatus = response.responseData.ExceptSubmittedCount;
        this.SubmittedTodayCount = response.responseData.SubmittedCount



      }
      else {



      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }

  onStatus() {
    var postData = {
      "FromDate": "",
      "ToDate": '',
      "CustomerId":this.Customer

    }
    this.commonService.postHttpService(postData, "CustomerDashboardStatisticsCount").subscribe(response => {
      if (response.status == true) {

        this.YesterdayStatus = response.responseData.ExceptSubmittedCount;
        this.SubmittedYesterdayCount = response.responseData.SubmittedCount


      }
      else {



      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }
  onOverallStatus() {
    
    var postData = {
      "FromDate": "",
      "ToDate": '',

    }
  
    this.commonService.postHttpService(postData, "CustomerDashboardStatisticsCount").subscribe(response => {
      if (response.status == true) {

        this.YesterdayStatus = response.responseData.ExceptSubmittedCount;
        this.SubmittedYesterdayCount = response.responseData.SubmittedCount


      }
      else {



      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));


  }


  getCustomerList() {
    this.commonService.getHttpService("CustomerDropDownListForDashboard").subscribe(response => {
      if (response.status == true) {
        this.customerList = response.responseData
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
    this.dates = []
    this.Completed = []
    this.RRReceived = []
    this.RRWaitingForCustomerApproval = []
    this.RepairInProgress = []
    this.commonService.postHttpService(postData, "CustomerloggedInStatusBarChart").subscribe(response => {
      if (response.status == true) {

        this.loggedInStatus = response.responseData

        for (var i = 0; i < this.loggedInStatus.length; i++) {

          this.dates.push(this.loggedInStatus[i].Date);
          this.RRReceived.push(this.loggedInStatus[i].RRReceived);
          this.RRWaitingForCustomerApproval.push(this.loggedInStatus[i].RRWaitingForCustomerApproval)
          this.RepairInProgress.push(this.loggedInStatus[i].RepairInProgress)
          this.Completed.push(this.loggedInStatus[i].Completed)


          this.dataSeries = [
            {
              "name": "Repairs Received",
              "data": this.RRReceived,
            },

            {
              "name": "Repairs Waiting For Customer Approval",
              "data": this.RRWaitingForCustomerApproval,
            },
            {
              "name": "Repairs In Progress",
              "data": this.RepairInProgress
            },
            {
              "name": "Repairs Completed",
              "data": this.Completed
            },
          ]
        }
        this.arrLength = this.dates;
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
          colors: ['#f37f90', '#8c83d9', '#69daec', '#53cdb5'],
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

  openDatepicker() {
     this.picker.open();
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }


  onStatusList(value) {
    this.Status = value
    var Status1 = '';

    var StatusName = rr_status_customer.find(a => a.id == value)
    this.FromStatictisDate = moment(this.dateTodayFilter.FromDate).format("YYYY-MM-DD"),
      this.ToStatictisDate = moment(this.dateTodayFilter.ToDate).format("YYYY-MM-DD")
    this.navCtrl.navigate('customer/rr-list', { StatusName: StatusName, Status: this.Status, Status1: Status1, FromDate: this.FromStatictisDate, ToDate: this.ToStatictisDate, DateType: 0,CustomerId:this.customer });
  }

  onYesterdayStatusList(value) {
    this.Status = value;
    var Status1 = '';

    var StatusName = rr_status_customer.find(a => a.id == value)

    this.navCtrl.navigate('customer/rr-list', { StatusName: StatusName, Status: this.Status, Status1: Status1, FromDate: this.FromStatictisDate, ToDate: this.ToStatictisDate, DateType: 1,CustomerId:this.Customer });

  }
  onYesterdayTwoStatusList(value, value1) {
    this.Status = value;
    var Status1 = value1;

    var StatusName = rr_status_customer.find(a => a.id == value)

    this.navCtrl.navigate('customer/rr-list', { StatusName: StatusName, Status: this.Status, Status1: Status1, FromDate: this.FromStatictisDate, ToDate: this.ToStatictisDate, DateType: 1 ,CustomerId:this.Customer});

  }
  onTwoStatusList(value, value1) {
    this.Status = value;
    var Status1 = value1;

    var StatusName = rr_status_customer.find(a => a.id == value)
    this.FromStatictisDate = moment(this.dateTodayFilter.FromDate).format("YYYY-MM-DD"),
    this.ToStatictisDate = moment(this.dateTodayFilter.ToDate).format("YYYY-MM-DD")
    this.navCtrl.navigate('customer/rr-list', { StatusName: StatusName, Status: this.Status, Status1: Status1, FromDate: this.FromStatictisDate, ToDate: this.ToStatictisDate, DateType: 0 ,CustomerId:this.customer});

  }

  loadCustomers() {
    this.customers$ = concat(
      this.searchCustomers().pipe( // default items
        catchError(() => of([])), // empty list on error
      ),
      this.customersInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(term => {
          if (term != null && term != undefined)
            return this.searchCustomers(term).pipe(
              catchError(() => of([])), // empty list on error
            )
          else
            return of([])
        })
      )
    );
  }
  searchCustomers(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      "CompanyName": term
    }
    return this.commonService.postHttpService(postData, "CustomerNameAutoSuggest")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

  selectAll() {
    let customerIds = this.CustomersList.map(a => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.Customer])];
    this.Customer = cMerge;
  }

  selectAlltoday() {
    let customerIds = this.CustomersList.map(a => a.CustomerId);
    let cMerge = [...new Set([...customerIds, ...this.customer])];
    this.customer = cMerge;
  }

}
