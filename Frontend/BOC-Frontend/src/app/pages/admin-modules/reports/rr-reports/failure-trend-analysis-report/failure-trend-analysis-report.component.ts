import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import * as moment from 'moment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
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
  selector: 'app-failure-trend-analysis-report',
  templateUrl: './failure-trend-analysis-report.component.html',
  styleUrls: ['./failure-trend-analysis-report.component.scss']
})
export class FailureTrendAnalysisReportComponent implements OnInit, OnDestroy {

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
  MonthlyRepairStatusPieChart: ChartType;
  public isOpen = false;
  SupplierFailureTrend: any = [];
  arrLength: any = [];
  _opened: boolean = false;
  _showBackdrop: boolean = true;
  basicColumChart
  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft

  customerList;
  CustomerList;
  vendorList;
  dataSeries: any = [];
  Supplier: any = [];
  Transactions: any = []
  _toggleWindow() {
    this.isOpen = !this.isOpen;
  }


  //Filter
  FromDate;
  Fromdate;
  Todate;
  ToDate;
  CustomerId;
  PartId;
  Part;
  VendorId;
  CompanyName

  keyword = 'PartNo';
  filteredData: any[];
  isLoading: boolean = false;
  data = [];
  date = new Date()
  CurrentMonthFromDate;
  CurrentMonthToDate
  constructor(public service: CommonService, private datePipe: DatePipe, private http: HttpClient, public navCtrl: NgxNavigationWithDataComponent, private cd_ref: ChangeDetectorRef,) { }

  ngOnInit() {
    this.isCollapsed = false;


    var y = this.date.getFullYear(), m = this.date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.Fromdate = moment(firstDay).format('YYYY-MM-DD')
    this.Todate = moment(lastDay).format('YYYY-MM-DD')

    const years = Number(this.datePipe.transform(this.Fromdate, 'yyyy'));
    const Month = Number(this.datePipe.transform(this.Fromdate, 'MM'));
    const Day = Number(this.datePipe.transform(this.Fromdate, 'dd'));
    this.FromDate = {
      year: years,
      month: Month,
      day: Day
    }
    const todateYears = Number(this.datePipe.transform(this.Todate, 'yyyy'));
    const todateMonth = Number(this.datePipe.transform(this.Todate, 'MM'));
    const todateDay = Number(this.datePipe.transform(this.Todate, 'dd'));
    this.ToDate = {
      year: todateYears,
      month: todateMonth,
      day: todateDay
    }

    this.onFailureTrendAnalysisReport();

    this.getCustomerList();
    this.getVendorList();


    // this.FooterRight = footerlineRight;
    // this.FooterLeft = footerlineLeft
  }



  getCustomerList() {
    this.service.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData.map(function (value) {
        return { title: value.CompanyName, "CustomerId": value.CustomerId }
      });
      this.CustomerList = response.responseData
    });
  }

  getVendorList() {
    this.service.getHttpService('getVendorListDropdown').subscribe(response => {
      this.vendorList = response.responseData;
    });
  }


  selectEvent(item) {
    this.PartId = item.PartId

  }
  clearPartEvent(item) {
    this.PartId = ''
    this.Part = ''
  }

  onChangeSearch(val: string) {

    if (val) {
      this.isLoading = true;
      var postData = {
        "PartNo": val
      }
      this.service.postHttpService(postData, "getonSearchPartByPartNo").subscribe(response => {
        if (response.status == true) {
          this.data = response.responseData
          this.filteredData = this.data.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase())

          )

        }
        else {

        }
        this.isLoading = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoading = false; });

    }
  }

  onFocused(e) {
    // do something when input is focused
  }

  FromDateFormat(FromDate) {
    if (FromDate != null) {
      const FromDateYears = FromDate.year;
      const FromDateDates = FromDate.day;
      const FromDatemonths = FromDate.month;
      let FromDateDate = new Date(FromDateYears, FromDatemonths - 1, FromDateDates);
      this.Fromdate = moment(FromDateDate).format('YYYY-MM-DD');
    } else {
      this.Fromdate = ''
    }
  }
  ToDateFormat(ToDate) {
    if (ToDate != null) {
      const ToDateYears = ToDate.year;
      const ToDateDates = ToDate.day;
      const ToDatemonths = ToDate.month;
      let ToDateof = new Date(ToDateYears, ToDatemonths - 1, ToDateDates);
      this.Todate = moment(ToDateof).format('YYYY-MM-DD')
    } else {
      this.Todate = ''
    }
  }
  _fetchData(ChartData) {

    this.SupplierFailureTrend = ChartData

    this.arrLength = this.SupplierFailureTrend;
    for (var i = 0; i < this.SupplierFailureTrend.length; i++) {
      this.Supplier.push(this.SupplierFailureTrend[i].Supplier);
      this.Transactions.push(this.SupplierFailureTrend[i].Transactions)
    }
    this.dataSeries = [
      {

        "data": this.Transactions,
      }
    ]
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
        categories: this.Supplier,
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




  onFailureTrendAnalysisReport() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };
    var url3 = this.baseUrl + '/api/v1.0/repairRequest/FailureTrendAnalysisReport';
    const that = this;
    var filterData = {
      "PartId": this.PartId,
      "CustomerId": this.CustomerId,
      "VendorId": this.VendorId,
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
    }
    this.dtOptions = this.getdtOption();
    this.dtOptions["ajax"] = (dataTablesParameters: any, callback) => {
      //that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

      that.http.post<any>(url3,
        Object.assign(dataTablesParameters,
          filterData
        ), httpOptions).subscribe(resp => {
          callback({
            draw: resp.responseData.draw,
            recordsTotal: resp.responseData.recordsTotal,
            recordsFiltered: resp.responseData.recordsFiltered,
            data: resp.responseData.Part
          });
          this._fetchData(resp.responseData.Supplier)
          // Calling the DT trigger to manually render the table
          this.dtTrigger.next()
        });

    };


    this.dtOptions["columns"] = [
      { data: 'PartNo', width: '10%', name: 'PartNo', defaultContent: '', orderable: true, searchable: true },
      { data: 'Manufacturer', width: '10%', name: 'Manufacturer', defaultContent: '', orderable: true, searchable: true },
      { data: 'Description', width: '10%', name: 'Description', defaultContent: '', orderable: true, searchable: true },
      { data: 'TotalRepairCost', width: '10%', name: 'TotalRepairCost', defaultContent: '', orderable: true, searchable: true },
      { data: 'FailureQuantity', width: '10%', name: 'FailureQuantity', defaultContent: '', orderable: true, searchable: true, },
      { data: 'AverageRepairCost', width: '12%', name: 'AverageRepairCost', defaultContent: '', orderable: true, searchable: true, },

    ];

    this.dataTable = $('#datatable-angular-FailureTrendAnalysisReport');
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
  onFilter(event) {


    this.Supplier = [];
    this.Transactions = [];

    this.rerender()
    if (this.CustomerId != '' && this.CustomerId != null) {
      this.CompanyName = this.CustomerList.find(a => a.CustomerId == this.CustomerId).CompanyName;
    }
    this._opened = !this._opened;



  }



  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onFailureTrendAnalysisReport()
    });
  }
  onClear(event) {
    this.ToDate = ""
    this.FromDate = ""
    // this.Fromdate = "",
    //   this.Todate = "",

    this.PartId = ""
    this.Part = ""
    this.CustomerId = ""
    this.CompanyName = ""
    this.VendorId = ""
    this._opened = !this._opened;
    this.Supplier = [];
    this.Transactions = [];
    var y = this.date.getFullYear(), m = this.date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.Fromdate = moment(firstDay).format('YYYY-MM-DD')
    this.Todate = moment(lastDay).format('YYYY-MM-DD')
    this.rerender()

  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  onVendorChange(value) {
    if (value == null) {
      this.VendorId = ''
    }

  }
  onChangeCustomer(CustomerId) {
    if (CustomerId == null) {
      this.CustomerId = ''
    }
  }
}
