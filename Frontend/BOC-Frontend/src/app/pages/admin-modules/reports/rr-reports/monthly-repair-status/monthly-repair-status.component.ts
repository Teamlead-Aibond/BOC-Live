import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { CommonService } from 'src/app/core/services/common.service';
import * as moment from 'moment';
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
  selector: 'app-monthly-repair-status',
  templateUrl: './monthly-repair-status.component.html',
  styleUrls: ['./monthly-repair-status.component.scss']
})
export class MonthlyRepairStatusComponent implements OnInit {

  isCollapsed: boolean;
  MonthlyRepairStatusPieChart: ChartType;
  public isOpen = false;
  RepairStatus;
  arrLength = 0;
  _opened: boolean = false;
  _showBackdrop: boolean = true;
  CompanyName
  _toggleSidebar() {
    this._opened = !this._opened;
  }

  FooterRight
  FooterLeft

  customerList;
  CustomerList;
  vendorList;
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


  keyword = 'PartNo';
  filteredData: any[];
  isLoading: boolean = false;
  data = [];
  date = new Date()
  CurrentMonthFromDate;
  CurrentMonthToDate
  constructor(public service: CommonService, private datePipe: DatePipe, public navCtrl: NgxNavigationWithDataComponent, private cd_ref: ChangeDetectorRef,) { }

  ngOnInit() {
    this.isCollapsed = false;

    this.RepairStatus = ""

    var y = this.date.getFullYear(), m = this.date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.Fromdate = moment(firstDay).format('YYYY-MM-DD')
    this.Todate = moment(lastDay).format('YYYY-MM-DD')
    this._fetchData();

    this.getCustomerList();
    this.getVendorList();
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
  _fetchData() {
    var postData = {
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
      "CustomerId": this.CustomerId,
      "VendorId": this.VendorId,
      "PartId": this.PartId

    }

    this.service.postHttpService(postData, 'StatusReport').subscribe(response => {
      if (response.IsException == null) {
        var data = response.responseData[0];
        this.RepairStatus = data
        this.arrLength = data;

        const PieChart: ChartType = {
          type: 'pie',
          series: [data.RRGenerated, data.AwaitingVendorSelection, data.AwaitingVendorQuote, data.ResourceVendorChange, data.QuotedAwaitingCustomerPO, data.RepairinProcess, data.QuoteRejected, data.Completed],
          option: {
            pie: {
              expandOnClick: false,
              customScale: 1.5,
            }
          },
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              customIcons: []
            },
            export: {
              csv: {
                filename: undefined,
                columnDelimiter: ',',
                headerCategory: 'category',
                headerValue: 'value',
                dateFormatter(timestamp) {
                  return new Date(timestamp).toDateString()
                }
              }
            },
            autoSelected: 'zoom'
          },
          height: 340,
          width: '97%',
          labels: ['RR Generated', 'Awaiting Vendor Selection', 'Awaiting Vendor Quote', 'Resource Vendor Change', 'Quoted Awaiting Customer PO', 'Repair in Process', 'Quote Rejected', 'Completed'],
          piechartcolor: ['#f672a7', '#37cde6', '#f7b84b', '#6559cc', '#09518e', '#38414a', '#f1556c', '#1abc9c'],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            position: 'top'
          },
          tooltip: {
            x: {
              show: false
            }
          },
          grid: {
            show: false,
            padding: {
              top: 50,
              left: 0,
              right: 0,
              bottom: 0
            }
          },
        };
        this.MonthlyRepairStatusPieChart = PieChart;

      } else { }
    });
  }


  onFilter(event) {
    var postData = {
      "FromDate": this.Fromdate,
      "ToDate": this.Todate,
      "CustomerId": this.CustomerId,
      "VendorId": this.VendorId,
      "PartId": this.PartId

    }


    this.service.postHttpService(postData, 'StatusReport').subscribe(response => {
      if (response.IsException == null) {
        var data = response.responseData[0];
        this.RepairStatus = data
        this.arrLength = data;

        const PieChart: ChartType = {
          type: 'pie',
          series: [data.RRGenerated, data.AwaitingVendorSelection, data.AwaitingVendorQuote, data.ResourceVendorChange, data.QuotedAwaitingCustomerPO, data.RepairinProcess, data.QuoteRejected, data.Completed],
          option: {
            pie: {
              // size: '50%',
              expandOnClick: false,
              customScale: 1.5,
            },
            // plotOptions: {
            //   pie: {
            //     size: 100
            //   }
            // }

          },
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              customIcons: []
            },
            export: {
              csv: {
                filename: undefined,
                columnDelimiter: ',',
                headerCategory: 'category',
                headerValue: 'value',
                dateFormatter(timestamp) {
                  return new Date(timestamp).toDateString()
                }
              }
            },
            autoSelected: 'zoom'
          },
          height: 340,
          width: '97%',
          labels: ['RR Generated', 'Awaiting Vendor Selection', 'Awaiting Vendor Quote', 'Resource Vendor Change', 'Quoted Awaiting Customer PO', 'Repair in Process', 'Quote Rejected', 'Completed'],
          piechartcolor: ['#f672a7', '#37cde6', '#f7b84b', '#6559cc', '#09518e', '#38414a', '#f1556c', '#1abc9c'],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            position: 'top'
          },
          tooltip: {
            x: {
              show: false
            }
          },
          grid: {
            show: false,
            padding: {
              top: 50,
              left: 0,
              right: 0,
              bottom: 0
            }
          },
        };
        this.MonthlyRepairStatusPieChart = PieChart;
        this._opened = !this._opened;

      } else { }
    });

    if (this.CustomerId != null && this.CustomerId != '') {
      this.CompanyName = this.CustomerList.find(a => a.CustomerId == this.CustomerId).CompanyName;
    }


  }

  onClear(event) {
    this.ToDate = ""
    var y = this.date.getFullYear(), m = this.date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.Fromdate = moment(firstDay).format('YYYY-MM-DD')
    this.Todate = moment(lastDay).format('YYYY-MM-DD')
    this.FromDate = ""
    // this.Fromdate = "",
    //this.Todate = "",
    this.CustomerId = "",
      this.VendorId = "",
      this.PartId = ""
    this.Part = ""
    this.CompanyName = ""
    this._opened = !this._opened;

    this._fetchData();
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
