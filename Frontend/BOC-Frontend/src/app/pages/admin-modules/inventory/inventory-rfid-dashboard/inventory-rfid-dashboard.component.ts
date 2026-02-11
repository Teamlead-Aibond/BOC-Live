import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { interval, Subject, Subscription } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import * as moment from "moment";
import { linewithDataChart } from "./data";
import { CommonService } from "src/app/core/services/common.service";
import { RfIdIntegrationService } from "../../rfid-integration/rfid-integration.service";
import {
  ReaderId,
  ReaderZone,
  RfReader,
} from "../../rfid-integration/rfid-integration.metadata";
import { ToastService } from "src/app/core/services/toast.service";
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
  states?: any;
  title?: any;
  subtitle?: any;
}

@Component({
  selector: "app-inventory-rfid-dashboard",
  templateUrl: "./inventory-rfid-dashboard.component.html",
  styleUrls: ["./inventory-rfid-dashboard.component.scss"],
})
export class InventoryRfidDashboardComponent implements OnInit, OnDestroy {
  linewithDataChart: ChartType;
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
  LinchartFilter = {
    FromDate: moment().subtract(14, "days"),
    ToDate: moment(),
  };
  LatestStockInList: any = [];
  LatestStockOutList: any = [];
  StockOutInWarehouse: any = [];

  @Input() dateFilterField;
  // bread crumb data
  breadCrumbItems: Array<{}>;
  TodayStatisticsCount;
  Linchartdata;
  LinchartStockIndata: any = [];
  LinchartStockOutdata: any = [];
  ReadyForShippingdata: any = [];
  PartsExistWithOutEntry: any = [];
  arrLength = 0;
  dataSeries: any = [];
  StockIn: any = [];
  StockOut: any = [];
  ReadyForShipping: any = [];
  dates: any = [];

  public intervalTimer = interval(6000);
  private subscription: Subscription;
  lossPreventionResult: any[] = [];
  inProcess: boolean = false;
  RFIDs: string[] = [];

  partLocationImage: string = "";

  rfidExitGateReaderData: RfReader[] = [];

  constructor(
    private http: HttpClient,
    public commonService: CommonService,
    public router: Router,
    private cd_ref: ChangeDetectorRef,
    public rfIdService: RfIdIntegrationService,
    public toastService: ToastService
  ) {
    this.alwaysShowCalendars = true;
    this.showRangeLabelOnInput = true;
    this.keepCalendarOpeningWithRange = true;
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Inventory", path: "/" },
      { label: "RFID Dashboard", path: "/", active: true },
    ];
    this.TodayStatisticsCount = "";

    this.subscription = this.intervalTimer.subscribe(() => {
      if (this.inProcess) return;
      this.inProcess = true;
      this.onLatestStockInStockOutList();
      this.onTodayStatisticsCount();
    });

    this.rfIdService.startReaderData(
      ReaderId.mainStore,
      ReaderZone.autoStockOut
    );
    this.rfidExitGateReaderData =
      this.rfIdService.readerManager.reader[ReaderId.mainStore].zones[
        ReaderZone.autoStockOut
      ].readerData;

    this.subscription = this.rfIdService.readerManager.reader[
      ReaderId.mainStore
    ].zones[ReaderZone.autoStockOut].readerActionStatus.subscribe((status) => {
      //console.log(this.rfidExitGateReaderData);
    });

    //this.showSuccess();
  }

  showSuccess() {
    this.toastService.show("I am a standard toast");

    this.toastService.show("I am a success toast", {
      classname: "bg-success text-light",
      delay: 5000,
    });
  }

  // bindRFIDData() {
  //   this.RFIDs.splice(0);
  //   //Remove Unidentified RFData from the result
  //   //console.log("Reader Count", this.service.rfIdExitGateData.length);
  //   this.lossPreventionResult.forEach((obj, i) => {
  //     if (this.rfIdService.rfIdExitGateData.findIndex(a => a.tagInventoryEvent.epc == obj.RFIDTagNo) < 0) {
  //       this.lossPreventionResult.splice(i, 1);
  //       //console.log("Loss Prev Result - Removal");
  //       //console.log(obj);
  //     }
  //   })

  //   this.rfIdService.rfIdExitGateData.forEach((reader, i) => {
  //     var epc = reader.tagInventoryEvent.epc;
  //     let res = this.lossPreventionResult.find(a => a.RFIDTagNo == epc);
  //     if (res) {
  //       res.readerCount = reader.count;
  //       res.timestamp = reader.timestamp;
  //     } else {
  //       this.RFIDs.push(epc);
  //     }
  //   })

  //   //Get data for New RFIDs
  //   this.getStockoutListByRFIDs(this.RFIDs);
  // }

  getStockoutListByRFIDs(epcs) {
    if (epcs.length <= 0) {
      this.inProcess = false;
      return;
    }

    var postData = {
      RFIDTagNos: epcs,
    };
    this.commonService
      .postHttpService(postData, "getPartstrackingByRFIdTagNos")
      .subscribe(
        (response) => {
          if (response.status == true) {
            response.responseData.Parts.forEach((e) => {
              if (e.StockOutId <= 0) {
                console.log("createLossPreventionLog");
                this.PartsExistWithOutEntry.push(e);
                this.commonService
                  .postHttpService(e, "createLossPreventionLog")
                  .subscribe((response) => {
                    console.log(response);
                  });
              } else {
                console.log("StockOutSuccess");
                this.commonService
                  .postHttpService(
                    { StockOutId: e.StockOutId },
                    "StockOutSuccess"
                  )
                  .subscribe((response) => {
                    console.log(response);
                  });
              }
              this.lossPreventionResult.push(e);
            });
          } else {
            // Swal.fire({
            //   title: 'Error!',
            //   text: response.responseData,
            //   type: 'warning',
            //   confirmButtonClass: 'btn btn-confirm mt-2'
            // });
          }
          this.inProcess = false;
          this.cd_ref.detectChanges();
        },
        (error) => {
          this.inProcess = false;
          console.log(error);
        }
      );
  }

  getStockoutListByRFID(epc) {
    var postData = {
      RFIDTagNo: epc,
    };
    this.commonService
      .postHttpService(postData, "getPartstrackingByRFIdTagNo")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.lossPreventionResult.push(response.responseData.Parts);
          } else {
            // Swal.fire({
            //   title: 'Error!',
            //   text: response.responseData,
            //   type: 'warning',
            //   confirmButtonClass: 'btn btn-confirm mt-2'
            // });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
  }

  onTodayStatisticsCount() {
    var postData = this.dateTodayFilter;
    // window.setInterval(() => {

    this.commonService
      .postHttpService(postData, "RFIDDashboardStatisticsCount")
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
    // }, 6000);
  }

  onLatestStockInStockOutList() {
    var postData = {};
    // window.setInterval(() => {

    this.commonService
      .postHttpService(postData, "LatestStockInStockOutList")
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.LatestStockInList = response.responseData.StockInList;
            this.LatestStockOutList = response.responseData.StockOutlist;
            this.StockOutInWarehouse = response.responseData.StockOutWarehouse;
            this.PartsExistWithOutEntry =
              response.responseData.PartsExistWithOutEntry;
          } else {
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    // }, 6000);
  }
  /**
   * Content Refresh
   */
  contentRefresh() {
    console.log("Content Refresh Requested");
  }

  setPartImage() {}

  Linechart() {
    this.StockOut = [];
    this.StockIn = [];
    this.ReadyForShipping = [];
    var postData = this.LinchartFilter;
    this.commonService.postHttpService(postData, "LineChartDayWise").subscribe(
      (response) => {
        if (response.status == true) {
          this.LinchartStockIndata = response.responseData.StockIn;
          this.LinchartStockOutdata = response.responseData.StockOut;
          this.ReadyForShippingdata = response.responseData.ReadyForShipping;
          for (var i = 0; i < this.LinchartStockIndata.length; i++) {
            this.StockIn.push(this.LinchartStockIndata[i].StockIn);
            this.dates.push(this.LinchartStockIndata[i].Date);
          }
          for (var i = 0; i < this.LinchartStockOutdata.length; i++) {
            this.StockOut.push(this.LinchartStockOutdata[i].StockOut);
            this.dates.push(this.LinchartStockIndata[i].Date);
          }
          for (var i = 0; i < this.ReadyForShippingdata.length; i++) {
            this.ReadyForShipping.push(this.ReadyForShippingdata[i].StockOut);
            this.dates.push(this.LinchartStockIndata[i].Date);
          }
          // console.log(this.StockIn,this.StockOut,this.ReadyForShipping)
          var uniqueDates = [];
          $.each(this.dates, function (i, el) {
            if ($.inArray(el, uniqueDates) === -1) uniqueDates.push(el);
          });
          this.dataSeries = [
            {
              name: "Stock In",
              data: this.StockIn,
            },

            {
              name: "Stock Out",
              data: this.StockOut,
            },
            {
              name: "Ready for Shipping",
              data: this.ReadyForShipping,
            },
          ];
          this.arrLength = this.dates.length;

          const linewithDataChart: ChartType = {
            chart: {
              height: 380,
              type: "line",
              zoom: {
                enabled: false,
              },
              toolbar: {
                show: false,
              },
            },
            colors: ["#f58091", "#69daec", "#f9ca78"],
            dataLabels: {
              enabled: true,
            },
            stroke: {
              width: [3, 3, 3],
              curve: "smooth",
            },
            series: this.dataSeries,
            title: {
              text: ".",
              align: "left",
              style: {
                fontSize: "14px",
                color: "#333",
              },
            },
            grid: {
              row: {
                colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.2,
              },
              borderColor: "#f1f3fa",
            },
            markers: {
              style: "inverted",
              size: 6,
            },
            xaxis: {
              categories: uniqueDates,
            },
            yaxis: {
              title: {
                text: "",
              },
              min: 1,
              max: 31,
            },
            legend: {
              position: "top",
              horizontalAlign: "right",
              floating: true,
              offsetY: -25,
              offsetX: -5,
            },
            responsive: [
              {
                breakpoint: 600,
                options: {
                  chart: {
                    toolbar: {
                      show: false,
                    },
                  },
                  legend: {
                    show: false,
                  },
                },
              },
            ],
          };

          this.linewithDataChart = linewithDataChart;
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
