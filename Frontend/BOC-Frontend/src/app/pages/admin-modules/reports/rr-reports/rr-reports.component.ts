import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { concat, Observable, of, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/core/services/common.service';
import * as moment from 'moment';
import { ExcelService } from 'src/app/core/services/excel.service';
import Swal from 'sweetalert2';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { array_rr_status, CONST_APPROVE_ACCESS, CONST_VIEW_ACCESS, footerlineLeft, footerlineRight, shipping_category, shipping_status, warranty_type } from 'src/assets/data/dropdown';
import { catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
@Component({
  selector: 'app-rr-reports',
  templateUrl: './rr-reports.component.html',
  styleUrls: ['./rr-reports.component.scss']
})
export class RrReportsComponent implements OnInit {
  spinner:boolean = false;

  //filter field
  PartId
  keywordForPartNo = 'PartNo';
  partList: any[];
  isLoading: boolean = false;
  keywordForCustomer = 'CompanyName';
  CustomersList: any[] = [];
  CustomerId
  isLoadingCustomer: boolean = false;
  keywordForVendor = 'VendorName';
  VendorsList: any[]
  VendorId = ''
  isLoadingVendor: boolean = false;
  keywordForRR = 'RRNo';
  RRList: any[]
  RRId = ''
  isLoadingRR: boolean = false;
  keywordForVendorPO = 'VendorPONo';
  VendorPOList: any[]
  RRIdVendorPO = ''
  isLoadingVendorPO: boolean = false;
  keywordForCustomerPONo = 'CustomerPONo';
  CustomerPONoList: any[]
  RRIdCustomerPO
  isLoadingCustomerPONo: boolean = false;
  keywordForCustomerSONo = 'CustomerSONo';
  CustomerSONoList: any[]
  RRIdCustomerSO
  isLoadingCustomerSONo: boolean = false;
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  ShippingStatus: string = '';
  ShippingStatusCategory = ''
  RRStatus: any = [];
  ShippingStatusList: any = [];
  ShippingStatusCategoryList: any = []
  public PartNo: string;
  public SerialNo: string;
  // public CustomerAssetName: string;
  public CompanyName: any = [];
  public FirstName: string;
  public LastName: string;
  public Status: string = '';
  public CustomerSONo: string;
  public CustomerPONo: string;
  public IsWarrantyRecovery
  public IsRushRepair: boolean = false;
  public IsRepairTag: boolean = false;
  public VendorName: string;
  public VendorPONo: string;
  public RRDescription: string;
  public CustomerPartNo1: string;
  public ReferenceValue: string;
  public StatusChangeId: string = '';
  IsPartsDeliveredToCustomer: string = '';
  CustomerInvoiceId: string = '';
  VendorInvoiceId: string = '';
  StatusChangeTo
  StatusChangeFrom
  StatusChangeFromDate
  StatusChangeToDate
  RRNo;
  //End Filter field

  FooterRight
  FooterLeft
  _opened: boolean = false;
  _showBackdrop: boolean = true;
  showTable: boolean = true;
  _toggleSidebar() {
    this._opened = !this._opened;
  }

  breadCrumbItems: Array<{}>;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dataTableMessage;
  dtTrigger: Subject<any> = new Subject();
  api_check: any;
  dataTable: any;
  customerList = [];
  RRFieldList = [
    {
      id: '1',
      FieldValue: 'RRNo',
      FieldName: 'Repair Request #',
      checked: false,
    },
    {
      id: '2',
      FieldValue: 'PartNo',
      checked: false,
      FieldName: 'Part #'
    },
    {
      id: '3',
      FieldValue: 'Supplier',
      checked: false,
      FieldName: 'Supplier'
    },
    {
      id: '4',
      FieldValue: 'Manufacturer',
      checked: false,
      FieldName: 'Manufacturer'
    },
    {
      id: '5',
      FieldValue: 'ManufacturerPartNo',
      checked: false,
      FieldName: 'Manufacturer Part #'
    },
    {
      id: '6',
      FieldValue: 'SerialNo',
      checked: false,
      FieldName: 'Serial #'
    },
    {
      id: '7',
      FieldValue: 'Description',
      checked: false,
      FieldName: 'Description'
    }, {
      id: '8',
      FieldValue: 'Status',
      checked: false,
      FieldName: 'Status'
    }, {
      id: '9',
      FieldValue: 'Customer',
      checked: false,
      FieldName: 'Customer'
    }, {
      id: '10',
      FieldValue: 'Department',
      checked: false,
      FieldName: 'Department'
    }, {
      id: '11',
      FieldValue: 'CustomerPONo',
      checked: false,
      FieldName: 'Customer PO #'
    }, {
      id: '12',
      FieldValue: 'RepairPrice',
      checked: false,
      FieldName: 'Repair Price',
    },
    {
      id: '13',
      FieldValue: 'Quantity',
      checked: false,
      FieldName: 'Quantity'
    },
    {
      id: '14',
      FieldValue: 'PriceOfNew',
      checked: false,
      FieldName: 'Price Of New'
    },
    {
      id: '15',
      FieldValue: 'Cost',
      checked: false,
      FieldName: 'Cost'
    },
    {
      id: '16',
      FieldValue: 'ShippingCost',
      checked: false,
      FieldName: 'Shipping Cost'
    }, {
      id: '17',
      FieldValue: 'AHReceivedDate',
      checked: false,
      FieldName: 'AH Received Date'
    }, {
      id: '18',
      FieldValue: 'QuoteSubmittedDate',
      checked: false,
      FieldName: 'Quote Submitted Date'
    }, {
      id: '19',
      FieldValue: 'ApprovedDate',
      checked: false,
      FieldName: 'Approved Date (PO Receipt Date)'
    }, {
      id: '20',
      FieldValue: 'VendorPONo',
      checked: false,
      FieldName: 'Vendor PO #'
    }, {
      id: '21',
      FieldValue: 'SalesOrderNo',
      checked: false,
      FieldName: 'Sales Order #'
    }, {
      id: '22',
      FieldValue: 'RejectedDate',
      checked: false,
      FieldName: 'Rejected Date'
    }, {
      id: '23',
      FieldValue: 'SalesOrderRequiredDate',
      checked: false,
      FieldName: 'Sales Order Required Date'
    }, {
      id: '24',
      FieldValue: 'DateCompleted',
      checked: false,
      FieldName: 'Date Completed'
    }, {
      id: '25',
      FieldValue: 'InvoiceNo',
      checked: false,
      FieldName: 'Invoice #'
    }, {
      id: '26',
      FieldValue: 'RushNormal',
      checked: false,
      FieldName: 'Rush / Normal'
    }, {
      id: '27',
      FieldValue: 'WarrantyRecovery',
      checked: false,
      FieldName: 'Warranty Recovery'
    }, {
      id: '28',
      FieldValue: 'CustomerReference1',
      checked: false,
      FieldName: 'Customer Reference 1'
    },
    {
      id: '29',
      FieldValue: 'CustomerReference2',
      checked: false,
      FieldName: 'Customer Reference 2'
    },
    {
      id: '30',
      FieldValue: 'CustomerReference3',
      checked: false,
      FieldName: 'Customer Reference 3'
    },
    {
      id: '31',
      FieldValue: 'CustomerReference4',
      checked: false,
      FieldName: 'Customer Reference 4'
    }, {
      id: '32',
      FieldValue: 'CustomerReference5',
      checked: false,
      FieldName: 'Customer Reference 5'
    }, {
      id: '33',
      FieldValue: 'CustomerReference6',
      checked: false,
      FieldName: 'Customer Reference 6'
    }, {
      id: '34',
      FieldValue: 'FollowUpStatus',
      checked: false,
      FieldName: 'Follow Up Status'
    }, {
      id: '35',
      FieldValue: 'CustomerPart1',
      checked: false,
      FieldName: 'Customer Part #1'
    }, {
      id: '36',
      FieldValue: 'CustomerPart2',
      checked: false,
      FieldName: 'Customer Part #2'
    },
    {
      id: '37',
      FieldValue: 'CustomerAssetName',
      checked: false,
      FieldName: 'Customer Asset'
    },
    {
      id: '38',
      FieldValue: 'CustomerStatedIssue',
      checked: false,
      FieldName: 'Customer Stated Issue'

    }, {
      id: '39',
      FieldValue: 'RootCause',
      checked: false,
      FieldName: 'Root Cause'
    },
    {
      id: '40',
      FieldValue: 'VendorReferenceNo',
      checked: false,
      FieldName: 'Vendor Reference #'
    },
    {
      id: '41',
      FieldValue: 'InternalNotes',
      checked: false,
      FieldName: 'Internal Notes'
    },
    {
      id: '42',
      FieldValue: 'SubStatusId',
      checked: false,
      FieldName: 'Sub Status',
    },
    {
      id: '43',
      FieldValue: 'AssigneeUserId',
      checked: false,
      FieldName: 'Assignee',
    },
    {
      id: '44',
      FieldValue: 'RRPartLocationId',
      checked: false,
      FieldName: 'RR Part Location',
    },
    {
      id: '45',
      FieldValue: 'PODueDate',
      checked: false,
      FieldName: 'Purchase Order Due Date',
    },
    {
      id: '46',
      FieldValue: 'VendorRefNo',
      checked: false,
      FieldName: 'Vendor Ref No',
    },
  ]
  resultArray = [
    {
      id: '1',
      RRNo: 'RR100254',
      PartNo: 'AHR_PAR4565',
      Customer: '20/20 Custom Platic',
      Supplier: 'GearX',
      Manufacturer: '',
      ManufacturerPartNo: 'AHKRIV001',
      Description: 'Repair of Chief 3000 PSI 1.5" rod DIA, #212696',
      SerialNo: 'AHKRIV001',
      Status: 'Completed',
      Department: '',
      CustomerPONo: '2D-05053015',
      RepairPrice: '$ 180',
      Quantity: '2',
      PriceOfNew: '2',
      Cost: '$ 140.00',
      ShippingCost: '0.00',
      AHReceivedDate: '03/18/2021',
      QuoteSubmittedDate: '04/09/2021',
      ApprovedDate: '04/12/2021',
      VendorPONo: 'PO063298',
      SalesOrderNo: 'SO048882',
      RejectedDate: '',
      SalesOrderRequiredDate: '05/13/2021',
      DateCompleted: '08/26/2021',
      InvoiceNo: 'INVO060762',
      RushNormal: 'Normal',
      WarrantyRecovery: 'No',
      CustomerReference1: 'NA',
      CustomerReference2: 'NA',
      CustomerReference3: 'NA',
      CustomerReference4: 'NA',
      CustomerReference5: 'NA',
      CustomerReference6: 'NA',
      FollowUpStatus: '',
      CustomerPart1: '',
      CustomerPart2: '',
      VendorReferenceNo: '',
      CustomerStatedIssue: '',
      RootCause: 'Quoted for replacing all   seals, o-rings and piston selas.Testing under hydraulic pressure for leaks.',
      CustomerAssetName: '',
      
      
    },
    {
      id: '1',
      RRNo: 'RR100254',
      PartNo: 'AHR_PAR4565',
      Customer: '20/20 Custom Platic',
      Supplier: 'GearX',
      Manufacturer: '',
      ManufacturerPartNo: 'AHKRIV001',
      Description: 'Repair of Chief 3000 PSI 1.5" rod DIA, #212696',
      SerialNo: 'AHKRIV001',
      Status: 'Completed',
      Department: '',
      CustomerPONo: '2D-05053015',
      RepairPrice: '$ 180',
      Quantity: '2',
      PriceOfNew: '2',
      Cost: '$ 140.00',
      ShippingCost: '0.00',
      AHReceivedDate: '03/18/2021',
      QuoteSubmittedDate: '04/09/2021',
      ApprovedDate: '04/12/2021',
      VendorPONo: 'PO063298',
      SalesOrderNo: 'SO048882',
      RejectedDate: '',
      SalesOrderRequiredDate: '05/13/2021',
      DateCompleted: '08/26/2021',
      InvoiceNo: 'INVO060762',
      RushNormal: 'Normal',
      WarrantyRecovery: 'No',
      CustomerReference1: 'NA',
      CustomerReference2: 'NA',
      CustomerReference3: 'NA',
      CustomerReference4: 'NA',
      CustomerReference5: 'NA',
      CustomerReference6: 'NA',
      FollowUpStatus: '',
      CustomerPart1: '',
      CustomerPart2: '',
      VendorReferenceNo: '',
      CustomerStatedIssue: '',
      RootCause: 'Quoted for replacing all   seals, o-rings and piston selas.Testing under hydraulic pressure for leaks.',
      CustomerAssetName: '',
      
    },
  ]
  FieldList = [{
    id: '1',
    FieldValue: 'RRNo',
    FieldName: 'Repair Request #',
    checked: true,
    "targets": [0],
    "visible": true,
    "searchable": true,
  },
  {
    id: '2',
    FieldValue: 'PartNo',
    checked: true,
    FieldName: 'Part #',
    "targets": [1],
    "visible": true,
    "searchable": true,
  },
  {
    id: '3',
    FieldValue: 'Supplier',
    checked: false,
    FieldName: 'Supplier',
    "targets": [2],
    "visible": false,
    "searchable": true,
  },
  {
    id: '4',
    FieldValue: 'Manufacturer',
    checked: false,
    FieldName: 'Manufacturer',
    "targets": [3],
    "visible": false,
    "searchable": true,
  },
  {
    id: '5',
    FieldValue: 'ManufacturerPart',
    checked: false,
    FieldName: 'Manufacturer Part #',
    "targets": [4],
    "visible": false,
    "searchable": true,
  },
  {
    id: '6',
    FieldValue: 'SerialNo',
    checked: true,
    FieldName: 'Serial #',
    "targets": [5],
    "visible": true,
    "searchable": true,
  },
  {
    id: '7',
    FieldValue: 'Description',
    checked: true,
    FieldName: 'Description',
    "targets": [6],
    "visible": true,
    "searchable": true,
  }, {
    id: '8',
    FieldValue: 'StatusName',
    checked: false,
    FieldName: 'Status',
    "targets": [7],
    "visible": false,
    "searchable": true,
  }, {
    id: '9',
    FieldValue: 'Customer',
    checked: false,
    FieldName: 'Customer',
    "targets": [8],
    "visible": false,
    "searchable": true,
  }, {
    id: '10',
    FieldValue: 'Department',
    checked: false,
    FieldName: 'Department',
    "targets": [9],
    "visible": false,
    "searchable": true,
  }, {
    id: '11',
    FieldValue: 'CustomerPO',
    checked: false,
    FieldName: 'Customer PO #',
    "targets": [10],
    "visible": false,
    "searchable": true,
  }, {
    id: '12',
    FieldValue: 'RepairPrice',
    checked: false,
    FieldName: 'Repair Price',
    "targets": [11],
    "visible": false,
    "searchable": true,
  },
  {
    id: '13',
    FieldValue: 'Quantity',
    checked: false,
    FieldName: 'Quantity',
    "targets": [12],
    "visible": false,
    "searchable": true,
  },
  {
    id: '14',
    FieldValue: 'PriceOfNew',
    checked: false,
    FieldName: 'Price Of New',
    "targets": [13],
    "visible": false,
    "searchable": true,
  },
  {
    id: '15',
    FieldValue: 'Cost',
    checked: false,
    FieldName: 'Cost',
    "targets": [14],
    "visible": false,
    "searchable": true,
  },
  {
    id: '16',
    FieldValue: 'Shipping',
    checked: false,
    FieldName: 'Shipping Cost',
    "targets": [15],
    "visible": false,
    "searchable": true,
  },
  {
    id: '17',
    FieldValue: 'AHReceivedDate',
    checked: false,
    FieldName: 'AH Received Date',
    "targets": [16],
    "visible": false,
    "searchable": true,
  },
  {
    id: '18',
    FieldValue: 'QuoteSubmittedDate',
    checked: false,
    FieldName: 'Quote Submitted Date',
    "targets": [17],
    "visible": false,
    "searchable": true,
  },
  {
    id: '19',
    FieldValue: 'ApprovedDate',
    checked: false,
    FieldName: 'Approved Date (PO Receipt Date)',
    "targets": [18],
    "visible": false,
    "searchable": true,
  },
  {
    id: '20',
    FieldValue: 'VendorPONo',
    checked: false,
    FieldName: 'Vendor PO #',
    "targets": [19],
    "visible": false,
    "searchable": true,
  },
  {
    id: '21',
    FieldValue: 'SalesOrderNo',
    checked: false,
    FieldName: 'Sales Order #',
    "targets": [20],
    "visible": false,
    "searchable": true,
  },
  {
    id: '22',
    FieldValue: 'RejectedDate',
    checked: false,
    FieldName: 'Rejected Date',
    "targets": [21],
    "visible": false,
    "searchable": true,
  },
  {
    id: '23',
    FieldValue: 'SalesOrderRequiredDate',
    checked: false,
    FieldName: 'Sales Order Required Date',
    "targets": [22],
    "visible": false,
    "searchable": true,
  },
  {
    id: '24',
    FieldValue: 'DateCompleted',
    checked: false,
    FieldName: 'Date Completed',
    "targets": [23],
    "visible": false,
    "searchable": true,
  },
  {
    id: '25',
    FieldValue: 'Invoice',
    checked: false,
    FieldName: 'Invoice #',
    "targets": [24],
    "visible": false,
    "searchable": true,
  },
  {
    id: '26',
    FieldValue: 'RushNormal',
    checked: false,
    FieldName: 'Rush / Normal',
    "targets": [25],
    "visible": false,
    "searchable": true,
  },
  {
    id: '27',
    FieldValue: 'WarrantyRecovery',
    checked: false,
    FieldName: 'Warranty Recovery',
    "targets": [26],
    "visible": false,
    "searchable": true,
  },
  {
    id: '28',
    FieldValue: 'CustomerReference1',
    checked: false,
    FieldName: 'Customer Reference 1',
    "targets": [27],
    "visible": false,
    "searchable": true,
  },
  {
    id: '29',
    FieldValue: 'CustomerReference2',
    checked: false,
    FieldName: 'Customer Reference 2',
    "targets": [28],
    "visible": false,
    "searchable": true,
  },
  {
    id: '30',
    FieldValue: 'CustomerReference3',
    checked: false,
    FieldName: 'Customer Reference 3',
    "targets": [29],
    "visible": false,
    "searchable": true,
  },
  {
    id: '31',
    FieldValue: 'CustomerReference4',
    checked: false,
    FieldName: 'Customer Reference 4',
    "targets": [30],
    "visible": false,
    "searchable": true,
  },
  {
    id: '32',
    FieldValue: 'CustomerReference5',
    checked: false,
    FieldName: 'Customer Reference 5',
    "targets": [31],
    "visible": false,
    "searchable": true,
  },
  {
    id: '33',
    FieldValue: 'CustomerReference6',
    checked: false,
    FieldName: 'Customer Reference 6',
    "targets": [32],
    "visible": false,
    "searchable": true,
  },
  {
    id: '34',
    FieldValue: 'FollowUpStatus',
    checked: false,
    FieldName: 'Follow Up Status',
    "targets": [33],
    "visible": false,
    "searchable": true,
  },
  {
    id: '35',
    FieldValue: 'CustomerPartNo1',
    checked: false,
    FieldName: 'Customer Part #1',
    "targets": [34],
    "visible": false,
    "searchable": true,
  },
  {
    id: '36',
    FieldValue: 'CustomerPartNo2',
    checked: false,
    FieldName: 'Customer Part #2',
    "targets": [35],
    "visible": false,
    "searchable": true,
  },
  {
    id: '37',
    FieldValue: 'CustomerAssetName',
    checked: false,
    FieldName: 'Customer Asset',
    "targets": [36],
    "visible": false,
    "searchable": true,
  },
  {
    id: '38',
    FieldValue: 'CustomerStatedIssue',
    checked: false,
    FieldName: 'Customer Stated Issue',
    "targets": [37],
    "visible": false,
    "searchable": true,
  },
  {
    id: '39',
    FieldValue: 'RootCause',
    checked: false,
    FieldName: 'Root Cause',
    "targets": [38],
    "visible": false,
    "searchable": true,
  },
  {
    id: '40',
    FieldValue: 'VendorReferenceNo',
    checked: false,
    FieldName: 'Vendor Reference #',
    "targets": [39],
    "visible": false,
    "searchable": true,
  },
 
  {
    id: '41',
    FieldValue: 'InternalNotes',
    checked: false,
    FieldName: 'Internal Notes',
    "targets": [40],
    "visible": false,
    "searchable": true,
  },
  {
    id: '42',
    FieldValue: 'SubStatusId',
    checked: false,
    FieldName: 'Sub Status',
    "targets": [67],
    "visible": false,
    "searchable": true,
  },
  {
    id: '43',
    FieldValue: 'AssigneeUserId',
    checked: false,
    FieldName: 'Assignee',
    "targets": [68],
    "visible": false,
    "searchable": true,
  },
  {
    id: '44',
    FieldValue: 'RRPartLocationId',
    checked: false,
    FieldName: 'RR Part Location',
    "targets": [69],
    "visible": false,
    "searchable": true,
  },
  {
    id: '45',
    FieldValue: 'PODueDate',
    checked: false,
    FieldName: 'Purchase Order Due Date',
    "targets": [70],
    "visible": false,
    "searchable": true,
  },
  {
    id: '46',
    FieldValue: 'VendorRefNo',
    checked: false,
    FieldName: 'Vendor Ref No',
    "targets": [71],
    "visible": false,
    "searchable": true,
  },

  ];
  baseUrl = `${environment.api.apiURL}`;

  ExcelData;
  RRReports: any = []
  IsViewEnabled
  WarrantyList:any=[]
  subStatusList:any=[]
  adminList:any=[]
  RRPartLocationList:any=[]
  AssigneeUserId
  RRPartLocationId
  SubStatusId
  CustomerGroupId: any
  customerGroupList: any;
  dtOptionsdeferLoadingShow: boolean = true;
  constructor(private http: HttpClient, private datePipe: DatePipe, public router: Router, private service: CommonService, public cd_ref: ChangeDetectorRef) { }
  currentRouter = this.router.url;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  DownloadExcelCSVinReports

  ngOnInit() {
    this.IsViewEnabled = this.service.permissionCheck("RepairRequestCustomReport", CONST_VIEW_ACCESS);
    this.DownloadExcelCSVinReports = this.service.permissionCheck("RepairRequestCustomReport", CONST_APPROVE_ACCESS);

    if(this.IsViewEnabled){
    this.RRStatus = array_rr_status;
    this.FooterRight = footerlineRight;
    this.FooterLeft = footerlineLeft;
    this.ShippingStatusList = shipping_status;
    this.ShippingStatusCategoryList = shipping_category;
    this.WarrantyList = warranty_type
    this.getCustomerGroupList();
    this.loadCustomers();
    this.getPartLocationList();
    this.getSubStatusList();
    this.getAdminList();
    this.onReportList();
    }
  }

  checkVisibility(fieldValue) {
    return this.FieldList.find(a => a.FieldValue == fieldValue).checked;
  }

  onCheckChange(e, fieldValue) {
    this.FieldList.map(fl => {
      if (fl.FieldValue == fieldValue) {
        fl.checked = e.target.checked;
        fl.visible = e.target.checked;
        //this.RRReports.push(fl)
      }
    })
    // this.rerender();
  }




  onExcel() {
    //Filter condition

    this.RRReports = this.FieldList.filter(a => a.checked);

    var vendorid = ""
    var vendorName = ""
    if (this.VendorId == '') {
      vendorid = ""
      vendorName = this.VendorName
    }
    else if (this.VendorId != "") {
      vendorid = this.VendorId
      vendorName = ''
    }
    // var Customerid = ""
    // var CustomerName = ""
    // if (this.CustomerId == '' || this.CustomerId == undefined || this.CustomerId == null) {
    //   Customerid = ""
    //   CustomerName = this.CompanyName
    // }
    // else if (this.CustomerId != "") {
    //   Customerid = this.CustomerId
    //   CustomerName = ''
    // }
    var partid = ""
    var partName = ""
    if (this.PartId == '' || this.PartId == undefined || this.PartId == null) {
      partid = ""
      partName = this.PartNo
    }
    else if (this.PartId != "") {
      partid = this.PartId
      partName = ''
    }
    var rrid = ""
    var RRNo = ""
    if (this.RRId == '' || this.RRId == undefined || this.RRId == null) {
      rrid = ""
      RRNo = this.RRNo
    }
    else if (this.RRId != "") {
      rrid = this.RRId
      RRNo = ''
    }

    var RRIdVendorPO = ""
    var VendorPONo = ""
    if (this.RRIdVendorPO == '' || this.RRIdVendorPO == undefined || this.RRIdVendorPO == null) {
      RRIdVendorPO = ""
      VendorPONo = this.VendorPONo
    }
    else if (this.RRIdVendorPO != "") {
      RRIdVendorPO = this.RRIdVendorPO
      VendorPONo = ''
    }
    var RRIdCustomerPO = ""
    var CustomerPONo = ""
    if (this.RRIdCustomerPO == '' || this.RRIdCustomerPO == undefined || this.RRIdCustomerPO == null) {
      RRIdCustomerPO = ""
      CustomerPONo = this.CustomerPONo
    }
    else if (this.RRIdCustomerPO != "") {
      RRIdCustomerPO = this.RRIdCustomerPO
      CustomerPONo = ''
    }

    var RRIdCustomerSO = ""
    var CustomerSONo = ""
    if (this.RRIdCustomerSO == '' || this.RRIdCustomerSO == undefined || this.RRIdCustomerSO == null) {
      RRIdCustomerSO = ""
      CustomerSONo = this.CustomerSONo
    }
    else if (this.RRIdCustomerSO != "") {
      RRIdCustomerSO = this.RRIdCustomerSO
      CustomerSONo = ''
    }

   

    if (this.IsRushRepair == true) {
      var IsRushRepair = 1
    } else {
      IsRushRepair = 0
    }
    if (this.IsRepairTag == true) {
      var IsRepairTag = 1
    } else {
      IsRepairTag = 0
    }
    var postData = {
      "RRNo": RRNo,
      "RRId": rrid,
      "RRDescription": this.RRDescription,
      "PartNo": partName,
      "PartId": partid,
      "SerialNo": this.SerialNo,
      "CustomerSONo": CustomerSONo,
      "RRIdCustomerSO": RRIdCustomerSO,
      "Status": this.Status,
      //"CompanyName": CustomerName,
      "CustomerId": this.CompanyName,
      "CustomerPartNo1": this.CustomerPartNo1,
      "CustomerPONo": CustomerPONo,
      "RRIdCustomerPO": RRIdCustomerPO,
      "ReferenceValue": this.ReferenceValue,
      "VendorName": vendorName,
      "VendorId": vendorid,
      "VendorPONo": VendorPONo,
      "RRIdVendorPO": RRIdVendorPO,
      "VendorInvoiceId": this.VendorInvoiceId,
      "CustomerInvoiceId": this.CustomerInvoiceId,
      "IsPartsDeliveredToCustomer": this.IsPartsDeliveredToCustomer,
      "StatusChangeTo": this.StatusChangeToDate,
      "StatusChangeFrom": this.StatusChangeFromDate,
      "StatusChangeId": this.StatusChangeId,
      "ShippingStatus": this.ShippingStatus,
      "ShippingStatusCategory": this.ShippingStatusCategory,
      "IsWarrantyRecovery": this.IsWarrantyRecovery,
      "IsRushRepair": IsRushRepair,
      "IsRepairTag": IsRepairTag,
      "SubStatusId":this.SubStatusId,
      "AssigneeUserId":this.AssigneeUserId,
      "RRPartLocationId":this.RRPartLocationId,
      "RRReports": this.RRReports,
      // "CustomerAssetName": this.CustomerAssetName,
      "CustomerGroupId": this.CustomerGroupId
    }
    this.spinner = true;

    this.service.postHttpService(postData, "getRepairRequestCustomReportExcel").subscribe(response => {
      if (response.status == true) {
        this.ExcelData = response.responseData.ExcelData;
        this.generateExcelFormat();
        this.spinner = false;

        Swal.fire({
          title: 'Success!',
          text: 'Excel downloaded Successfully!',
          type: 'success',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      else {
        this.spinner = false;
        Swal.fire({
          title: 'Error!',
          text: 'Excel could not be downloaded!',
          type: 'warning',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }


  generateExcelFormat() {
    var data = []
    var jsonData = this.ExcelData
    for (var i = 0; i < jsonData.length; i++) {
      var obj = jsonData[i];
      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      data.push(temparray);
    }

    //Excel Title, Header, Data
    const title = 'Repair Request Custom Report';
    const header = []
    this.RRReports.map(a => {
      header.push(a.FieldName)
    })
    // console.log(header)
    //const header = [this.RRReports[0].FieldName,this.RRReports[1].FieldName,this.RRReports[2].FieldName,this.RRReports[3].FieldName,this.RRReports[4].FieldName,this.RRReports[5].FieldName,this.RRReports[6].FieldName,]
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Data');
    // //Add Row and formatting
    // let titleRow = worksheet.addRow([title]);
    // titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    // worksheet.addRow([]);
    // let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])
    // // //Add Image
    // // let logo = workbook.addImage({
    // //   filename: 'assets/images/ah_logo.png', 
    // //    extension: 'png',
    // // });
    // // worksheet.addImage(logo, 'E1:F3');
    // worksheet.mergeCells('A1:D2');
    // //Blank Row 
    // worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true }

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
    }
    );
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 30;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 30;

    worksheet.addRow([]);
    //Footer Row
    // let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFCCFFE5' }
    // };
    // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    //Merge Cells
   // worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var currentDate = this.datePipe.transform(new Date(), "M-d-yyyy hh-mm-ss a")
      var filename = ('Repair Request Custom Report' + currentDate + '.xlsx')
      fs.saveAs(blob, filename);
    })


  }


  // onFilter() {
  //   this._opened = !this._opened;
  // this.FieldList.map(fl => {
  //   this.RRfield.map(a => {
  //     if (fl.FieldValue == a) {
  //       fl.checked = true;
  //     }
  //   })
  // })


  // this.FieldList.map(fl => {
  //   this.POfield.map(a => {
  //     if (fl.FieldValue == a) {
  //       fl.checked = true;
  //     }
  //   })
  // })
  //}


  // onClear() {
  //   this.RRfield=''
  //   this.FieldList.map(a => a.checked = false);
  //   this._opened = !this._opened;

  // }

  selectPartEvent(item) {
    this.PartId = item.PartId
  }
  clearPartEvent(item) {
    this.PartId = ''
    this.PartNo = ''
  }
  onChangePartSearch(val: string) {

    if (val) {
      this.isLoading = true;
      var postData = {
        "PartNo": val
      }
      this.service.postHttpService(postData, "getonSearchPartByPartNo").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.partList = data.filter(a => a.PartNo.toLowerCase().includes(val.toLowerCase())

          )

        }
        else {

        }
        this.isLoading = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoading = false; });

    }
  }

  onFocused(e, i) {
    // do something when input is focused
  }


  //AutoComplete for customer
  selectCustomerEvent($event) {
    this.CustomerId = $event.CustomerId;
  }

  onChangeCustomerSearch(val: string) {

    if (val) {
      this.isLoadingCustomer = true;
      var postData = {
        "Customer": val
      }
      this.service.postHttpService(postData, "getAllAutoComplete").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.CustomersList = data.filter(a => a.CompanyName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingCustomer = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingCustomer = false; });

    }
  }

  //AutoComplete for Vendor
  selectVendorEvent($event) {
    this.VendorId = $event.VendorId;
  }
  clearVendorEvent($event) {
    this.VendorId = ''
    this.VendorName = ''
  }
  onChangeVendorSearch(val: string) {

    if (val) {
      this.isLoadingVendor = true;
      var postData = {
        "Vendor": val
      }
      this.service.postHttpService(postData, "getAllAutoCompleteofVendor").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.VendorsList = data.filter(a => a.VendorName.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingVendor = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingVendor = false; });

    }
  }


  //AutoComplete for RR
  selectRREvent($event) {
    this.RRId = $event.RRId;
  }
  clearRREvent($event) {
    this.RRId = '';
    this.RRNo = ''
  }
  onChangeRRSearch(val: string) {

    if (val) {
      this.isLoadingRR = true;
      var postData = {
        "RRNo": val
      }
      this.service.postHttpService(postData, "RRNoAotoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.RRList = data.filter(a => a.RRNo.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingRR = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingRR = false; });

    }
  }

  //AutoComplete for VendorPO
  selectVendorPOEvent($event) {
    this.RRIdVendorPO = $event.RRId;
  }
  clearVendorPOEvent($event) {
    this.RRIdVendorPO = ''
    this.VendorPONo = ''
  }
  onChangeVendorPOSearch(val: string) {

    if (val) {
      this.isLoadingVendorPO = true;
      var postData = {
        "VendorPONo": val
      }
      this.service.postHttpService(postData, "VendorPOAutoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.VendorPOList = data.filter(a => a.VendorPONo.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingVendorPO = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingVendorPO = false; });

    }
  }

  //AutoComplete for CustomerPO
  selectCustomerPONoEvent($event) {
    this.RRIdCustomerPO = $event.RRId;
  }
  clearPOEvent($event) {
    this.RRIdCustomerPO = ''
    this.CustomerPONo = ''
  }
  onChangeCustomerPONoSearch(val: string) {

    if (val) {
      this.isLoadingCustomerPONo = true;
      var postData = {
        "CustomerPONo": val
      }
      this.service.postHttpService(postData, "CustomerPOAutoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.CustomerPONoList = data.filter(a => a.CustomerPONo.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingCustomerPONo = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingCustomerPONo = false; });

    }
  }

  //AutoComplete for CustomerSONo
  selectCustomerSONoEvent($event) {
    this.RRIdCustomerSO = $event.RRId;
  }
  clearSOEvent($event) {
    this.RRIdCustomerSO = ''
    this.CustomerSONo = ''
  }
  onChangeCustomerSONoSearch(val: string) {

    if (val) {
      this.isLoadingCustomerSONo = true;
      var postData = {
        "CustomerSONo": val
      }
      this.service.postHttpService(postData, "SONoAutoSuggest").subscribe(response => {
        if (response.status == true) {
          var data = response.responseData
          this.CustomerSONoList = data.filter(a => a.CustomerSONo.toLowerCase().includes(val.toLowerCase())
          )

        }
        else {

        }
        this.isLoadingCustomerSONo = false;
        this.cd_ref.detectChanges();
      }, error => { console.log(error); this.isLoadingCustomerSONo = false; });

    }
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
      "Customer": term
    }
    return this.service.postHttpService(postData, "getAllAutoComplete")
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
    let cMerge = [...new Set([...customerIds, ...this.CompanyName])];
    this.CompanyName = cMerge;
  }

  StatusChangeToDataFormat(StatusChangeTo) {
    const StatusChangeToYears = StatusChangeTo.year;
    const StatusChangeToDates = StatusChangeTo.day;
    const StatusChangeTomonths = StatusChangeTo.month;
    let StatusChangeToDate = new Date(StatusChangeToYears, StatusChangeTomonths - 1, StatusChangeToDates);
    this.StatusChangeToDate = moment(StatusChangeToDate).format('YYYY-MM-DD');
  }
  StatusChangeFromDataFormat(StatusChangeFrom) {
    const StatusChangeFromYears = StatusChangeFrom.year;
    const StatusChangeFromDates = StatusChangeFrom.day;
    const StatusChangeFrommonths = StatusChangeFrom.month;
    let StatusChangeFromDate = new Date(StatusChangeFromYears, StatusChangeFrommonths - 1, StatusChangeFromDates);
    this.StatusChangeFromDate = moment(StatusChangeFromDate).format('YYYY-MM-DD')
  }

  onReportList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem("Access-Token")}`
      })
    };

    var url = this.baseUrl + '/api/v1.0/RRReports/RepairRequestCustomReport';
    const that = this;

    //Filter condition
    var vendorid = ""
    var vendorName = ""
    if (this.VendorId == '') {
      vendorid = ""
      vendorName = this.VendorName
    }
    else if (this.VendorId != "") {
      vendorid = this.VendorId
      vendorName = ''
    }
    // var Customerid = ""
    // var CustomerName = ""
    // if (this.CustomerId == '' || this.CustomerId == undefined || this.CustomerId == null) {
    //   Customerid = ""
    //   CustomerName = this.CompanyName
    // }
    // else if (this.CustomerId != "") {
    //   Customerid = this.CustomerId
    //   CustomerName = ''
    // }
    var partid = ""
    var partName = ""
    if (this.PartId == '' || this.PartId == undefined || this.PartId == null) {
      partid = ""
      partName = this.PartNo
    }
    else if (this.PartId != "") {
      partid = this.PartId
      partName = ''
    }
    var rrid = ""
    var RRNo = ""
    if (this.RRId == '' || this.RRId == undefined || this.RRId == null) {
      rrid = ""
      RRNo = this.RRNo
    }
    else if (this.RRId != "") {
      rrid = this.RRId
      RRNo = ''
    }

    var RRIdVendorPO = ""
    var VendorPONo = ""
    if (this.RRIdVendorPO == '' || this.RRIdVendorPO == undefined || this.RRIdVendorPO == null) {
      RRIdVendorPO = ""
      VendorPONo = this.VendorPONo
    }
    else if (this.RRIdVendorPO != "") {
      RRIdVendorPO = this.RRIdVendorPO
      VendorPONo = ''
    }
    var RRIdCustomerPO = ""
    var CustomerPONo = ""
    if (this.RRIdCustomerPO == '' || this.RRIdCustomerPO == undefined || this.RRIdCustomerPO == null) {
      RRIdCustomerPO = ""
      CustomerPONo = this.CustomerPONo
    }
    else if (this.RRIdCustomerPO != "") {
      RRIdCustomerPO = this.RRIdCustomerPO
      CustomerPONo = ''
    }

    var RRIdCustomerSO = ""
    var CustomerSONo = ""
    if (this.RRIdCustomerSO == '' || this.RRIdCustomerSO == undefined || this.RRIdCustomerSO == null) {
      RRIdCustomerSO = ""
      CustomerSONo = this.CustomerSONo
    }
    else if (this.RRIdCustomerSO != "") {
      RRIdCustomerSO = this.RRIdCustomerSO
      CustomerSONo = ''
    }

    if (this.IsWarrantyRecovery == true) {
      var IsWarrantyRecovery = 1
    } else {
      IsWarrantyRecovery = 0
    }

    if (this.IsRushRepair == true) {
      var IsRushRepair = 1
    } else {
      IsRushRepair = 0
    }
    if (this.IsRepairTag == true) {
      var IsRepairTag = 1
    } else {
      IsRepairTag = 0
    }
    var CustomerGroupId = "";
    if(this.CustomerGroupId != "" || this.CustomerGroupId != null){
      CustomerGroupId = this.CustomerGroupId;
    }
    var filterData = {
      "RRNo": RRNo,
      "RRId": rrid,
      "RRDescription": this.RRDescription,
      "PartNo": partName,
      "PartId": partid,
      "SerialNo": this.SerialNo,
      "CustomerSONo": CustomerSONo,
      "RRIdCustomerSO": RRIdCustomerSO,
      "Status": this.Status,
      //"CompanyName": CustomerName,
      "CustomerId": this.CompanyName,
      "CustomerPartNo1": this.CustomerPartNo1,
      "CustomerPONo": CustomerPONo,
      "RRIdCustomerPO": RRIdCustomerPO,
      "ReferenceValue": this.ReferenceValue,
      "VendorName": vendorName,
      "VendorId": vendorid,
      "VendorPONo": VendorPONo,
      "RRIdVendorPO": RRIdVendorPO,
      "VendorInvoiceId": this.VendorInvoiceId,
      "CustomerInvoiceId": this.CustomerInvoiceId,
      "IsPartsDeliveredToCustomer": this.IsPartsDeliveredToCustomer,
      "StatusChangeTo": this.StatusChangeToDate,
      "StatusChangeFrom": this.StatusChangeFromDate,
      "StatusChangeId": this.StatusChangeId,
      "ShippingStatus": this.ShippingStatus,
      "ShippingStatusCategory": this.ShippingStatusCategory,
      "IsWarrantyRecovery": this.IsWarrantyRecovery,
      "IsRushRepair": IsRushRepair,
      "IsRepairTag": IsRepairTag,
      "SubStatusId":this.SubStatusId,
      "AssigneeUserId":this.AssigneeUserId,
      "RRPartLocationId":this.RRPartLocationId,
      "CustomerGroupId": CustomerGroupId

      // "CustomerAssetName": this.CustomerAssetName
    }
    if(this.DownloadExcelCSVinReports){
      var buttons={}
      buttons= {
        dom: {
          button: {
            className: ''
          }
        },
        buttons: [
          {
            extend: 'colvis',
            className: 'btn btn-xs btn-primary',
            text: 'COLUMNS'
          },
          {
            extend: 'excelHtml5',
            text: 'EXCEL',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'csvHtml5',
            text: 'CSV',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            className: 'btn btn-xs btn-secondary',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'print',
            className: 'btn btn-xs btn-secondary',
            text: 'PRINT',
            exportOptions: {
              columns: ':visible'
            }
          },
          {
            extend: 'copy',
            className: 'btn btn-xs btn-secondary',
            text: 'COPY',
            exportOptions: {
              columns: ':visible'
            }
          },
        ]
      }
    }
    else{
       buttons= {
        dom: {
          button: {
            className: ''
          }

        },
        buttons: []
      }
    }
    
    this.dtOptions = {
      dom: '<" row"<"col-12 col-sm-8 col-md-8 col-xl-6"B> <"col-12 col-sm-4 col-md-4 col-xl-6"f>>rt<" row"<"help-block col-12 col-sm-4 col-md-4 col-xl-4"l><"col-12 col-sm-4 col-md-4 col-xl-4"i><"col-12 col-sm-4 col-md-4 col-xl-4"p>>',
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      processing: true,
      serverSide: true,
      retrieve: true,
      order: [[0, 'desc']],
      serverMethod: 'post',
      ajax: (dataTablesParameters: any, callback) => {
        that.api_check ? that.api_check.unsubscribe() : that.api_check = null;

        that.api_check = that.http.post<any>(url,
          Object.assign(dataTablesParameters,
            filterData
          ), httpOptions).subscribe(resp => {
            callback({
              draw: resp.responseData.draw,
              recordsTotal: resp.responseData.recordsTotal,
              recordsFiltered: resp.responseData.recordsFiltered,
              data: resp.responseData.data
            });
            this.dtTrigger.next()
          });
      },
      buttons: buttons,
      columnDefs: this.FieldList,
      columns: [
        { data: 'RRNo', name: 'RRNo', defaultContent: '', orderable: true, searchable: true },
        { data: 'PartNo', name: 'PartNo', orderable: true, searchable: true },
        { data: 'Supplier', name: 'Supplier', orderable: true, searchable: true },
        { data: 'Manufacturer', name: 'Manufacturer', orderable: true, searchable: true },
        { data: 'ManufacturerPartNo', name: 'ManufacturerPartNo', orderable: true, searchable: true },
        { data: 'SerialNo', name: 'SerialNo', orderable: true, searchable: true },
        { data: 'Description', name: 'Description', orderable: true, searchable: true },
        { data: 'StatusName', name: 'StatusName', orderable: true, searchable: true },
        { data: 'Customer', name: 'Customer', orderable: true, searchable: true },
        { data: 'Department', name: 'Department', orderable: true, searchable: true },
        { data: 'CustomerPO', name: 'CustomerPO', orderable: true, searchable: true },
        { data: 'RepairPrice', name: 'RepairPrice', orderable: true, searchable: true },
        { data: 'Quantity', name: 'Quantity', orderable: true, searchable: true },
        { data: 'PriceOfNew', name: 'PriceOfNew', orderable: true, searchable: true },
        { data: 'Cost', name: 'Cost', orderable: true, searchable: true },
        { data: 'Shipping', name: 'Shipping', orderable: true, searchable: true },
        { data: 'AHReceivedDate', name: 'AHReceivedDate', orderable: true, searchable: true },
        { data: 'QuoteSubmittedDate', name: 'QuoteSubmittedDate', orderable: true, searchable: true },
        { data: 'ApprovedDate', name: 'ApprovedDate', orderable: true, searchable: true },
        { data: 'VendorPONo', name: 'VendorPONo', orderable: true, searchable: true },
        { data: 'SalesOrderNo', name: 'SalesOrderNo', orderable: true, searchable: true },
        { data: 'RejectedDate', name: 'RejectedDate', orderable: true, searchable: true },
        { data: 'SalesOrderRequiredDate', name: 'SalesOrderRequiredDate', orderable: true, searchable: true },
        { data: 'DateCompleted', name: 'DateCompleted', orderable: true, searchable: true },
        { data: 'Invoice', name: 'Invoice', orderable: true, searchable: true },
        { data: 'RushNormal', name: 'RushNormal', orderable: true, searchable: true },
        { data: 'WarrantyRecovery', name: 'WarrantyRecovery', orderable: true, searchable: true },
        { data: 'CustomerReference1', width: '20%', name: 'CustomerReference1', orderable: true, searchable: true },
        { data: 'CustomerReference2', width: '20%', name: 'CustomerReference2', orderable: true, searchable: true },
        { data: 'CustomerReference3', width: '20%', name: 'CustomerReference3', orderable: true, searchable: true },
        { data: 'CustomerReference4', width: '20%', name: 'CustomerReference4', orderable: true, searchable: true },
        { data: 'CustomerReference5', width: '20%', name: 'CustomerReference5', orderable: true, searchable: true },
        { data: 'CustomerReference6', width: '20%', name: 'CustomerReference6', orderable: true, searchable: true },
        { data: 'FollowUpStatus', name: 'FollowUpStatus', orderable: true, searchable: true },
        { data: 'CustomerPartNo1', name: 'CustomerPartNo1', orderable: true, searchable: true },
        { data: 'CustomerPartNo2', name: 'CustomerPartNo2', orderable: true, searchable: true },
        { data: 'CustomerAssetName', name: 'CustomerAssetName', orderable: true, searchable: true },
        { data: 'CustomerStatedIssue', name: 'CustomerStatedIssue', orderable: true, searchable: true },
        { data: 'RootCause', name: 'RootCause', orderable: true, searchable: true },
        { data: 'VendorReferenceNo', name: 'VendorReferenceNo', orderable: true, searchable: true },
        { data: 'InternalNotes', name: 'InternalNotes', orderable: true, searchable: true},

        //38  filter column need
        { data: 'IsRushRepair', name: 'IsRushRepair', orderable: true, searchable: true, "visible": false, },
        { data: 'IsRepairTag', name: 'IsRepairTag', orderable: true, searchable: true, "visible": false, },
        { data: 'ReferenceValue', name: 'ReferenceValue', orderable: true, searchable: true, "visible": false, },
        { data: 'CustomerSONo', name: 'CustomerSONo', orderable: true, searchable: true, "visible": false, },
        { data: 'SODueDatePassed', name: 'SODueDatePassed', orderable: true, searchable: true, "visible": false, },
        { data: 'PODueDatePassed', name: 'PODueDatePassed', orderable: true, searchable: true, "visible": false, },
        { data: 'InvDueDatePassed', name: 'InvDueDatePassed', orderable: true, searchable: true, "visible": false, },
        { data: 'SODueDateNears', name: 'SODueDateNears', orderable: true, searchable: true, "visible": false, },
        { data: 'PODueDateNears', name: 'PODueDateNears', orderable: true, searchable: true, "visible": false, },
        { data: 'InvDueDateNears', name: 'InvDueDateNears', orderable: true, searchable: true, "visible": false, },
        { data: 'IsPartsDeliveredToCustomer', name: 'IsPartsDeliveredToCustomer', orderable: true, searchable: true, "visible": false, },
        { data: 'VendorInvoiceId', name: 'VendorInvoiceId', orderable: true, searchable: true, "visible": false, },
        { data: 'CustomerInvoiceId', name: 'CustomerInvoiceId', orderable: true, searchable: true, "visible": false, },
        { data: 'CustomerId', name: 'CustomerId', orderable: true, searchable: true, "visible": false, },
        { data: 'VendorId', name: 'VendorId', orderable: true, searchable: true, "visible": false, },
        { data: 'PartId', name: 'PartId', orderable: true, searchable: true, "visible": false, },
        { data: 'RRIdVendorPO', name: 'RRIdVendorPO', orderable: true, searchable: true, "visible": false, },
        { data: 'RRIdCustomerPO', name: 'RRIdCustomerPO', orderable: true, searchable: true, "visible": false, },
        { data: 'RRIdCustomerSO', name: 'RRIdCustomerSO', orderable: true, searchable: true, "visible": false, },
        { data: 'StatusChangeFrom', name: 'StatusChangeFrom', orderable: true, searchable: true, "visible": false, },
        { data: 'StatusChangeTo', name: 'StatusChangeTo', orderable: true, searchable: true, "visible": false, },
        { data: 'StatusChangeId', name: 'StatusChangeId', orderable: true, searchable: true, "visible": false, },
        { data: 'RRId', name: 'RRId', className: 'text-center', orderable: true, searchable: true, "visible": false, },
        { data: 'ShippingStatus', name: 'ShippingStatus', orderable: true, searchable: true, "visible": false, },
        { data: 'ShippingStatusCategory', name: 'ShippingStatusCategory', orderable: true, searchable: true, "visible": false, },
        { data: 'Status', name: 'Status', orderable: true, searchable: true, "visible": false, },
        { data: 'SubStatusId', name: 'SubStatusId', orderable: true, searchable: true },
        { data: 'AssigneeUserId', name: 'AssigneeUserId', orderable: true, searchable: true },
        { data: 'RRPartLocationId', name: 'RRPartLocationId', orderable: true, searchable: true },
        { data: 'PODueDate', name: 'PODueDate', orderable: true, searchable: true },
        { data: 'VendorRefNo', name: 'VendorRefNo', orderable: true, searchable: true },

      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {

        return row;
      },
      "preDrawCallback": function () {
        $('#datatable-angular-rr_processing').attr('style', 'display: block; z-index: 10000 !important');

      },

      language: {
        "paginate": {
          "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
          "last": '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
          "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
          "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
        },
        "loadingRecords": '&nbsp;',
        "processing": 'Loading...',
        "emptyTable":  this.dtOptionsdeferLoadingShow ? '<div class="alert alert-info" style="margin-left: 17%" role="alert">Please select filter to load data!</div>' : 'No data available!'
      }
    };
    if(this.dtOptionsdeferLoadingShow){
      this.dtOptions.deferLoading = 0;
    }
    this.dataTable = $('#datatable-angular-rr');
    this.dataTable.DataTable(this.dtOptions);
  }

  rerender(): void {
    this.dtOptionsdeferLoadingShow = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      this.onReportList()
    });
  }
  onFilter(event) {
    var vendorid = ""
    var vendorName = ""
    if (this.VendorId == '') {
      vendorid = ""
      vendorName = this.VendorName
    }
    else if (this.VendorId != "") {
      vendorid = this.VendorId
      vendorName = ''
    }
    // var Customerid = ""
    // var CustomerName = ""
    // if (this.CustomerId == '' || this.CustomerId == undefined || this.CustomerId == null) {
    //   Customerid = ""
    //   CustomerName = this.CompanyName
    // }
    // else if (this.CustomerId != "") {
    //   Customerid = this.CustomerId
    //   CustomerName = ''
    // }
    var partid = ""
    var partName = ""
    if (this.PartId == '' || this.PartId == undefined || this.PartId == null) {
      partid = ""
      partName = this.PartNo
    }
    else if (this.PartId != "") {
      partid = this.PartId
      partName = ''
    }
    var rrid = ""
    var RRNo = ""
    if (this.RRId == '' || this.RRId == undefined || this.RRId == null) {
      rrid = ""
      RRNo = this.RRNo
    }
    else if (this.RRId != "") {
      rrid = this.RRId
      RRNo = ''
    }

    var RRIdVendorPO = ""
    var VendorPONo = ""
    if (this.RRIdVendorPO == '' || this.RRIdVendorPO == undefined || this.RRIdVendorPO == null) {
      RRIdVendorPO = ""
      VendorPONo = this.VendorPONo
    }
    else if (this.RRIdVendorPO != "") {
      RRIdVendorPO = this.RRIdVendorPO
      VendorPONo = ''
    }
    var RRIdCustomerPO = ""
    var CustomerPONo = ""
    if (this.RRIdCustomerPO == '' || this.RRIdCustomerPO == undefined || this.RRIdCustomerPO == null) {
      RRIdCustomerPO = ""
      CustomerPONo = this.CustomerPONo
    }
    else if (this.RRIdCustomerPO != "") {
      RRIdCustomerPO = this.RRIdCustomerPO
      CustomerPONo = ''
    }

    var RRIdCustomerSO = ""
    var CustomerSONo = ""
    if (this.RRIdCustomerSO == '' || this.RRIdCustomerSO == undefined || this.RRIdCustomerSO == null) {
      RRIdCustomerSO = ""
      CustomerSONo = this.CustomerSONo
    }
    else if (this.RRIdCustomerSO != "") {
      RRIdCustomerSO = this.RRIdCustomerSO
      CustomerSONo = ''
    }
    this._opened = !this._opened;
    // var table = $('#datatable-angular-rr').DataTable();
    // table.columns(0).search(RRNo);
    // table.columns(1).search(partName);
    // table.columns(5).search(this.SerialNo);
    // table.columns(3).search(vendorName);
    // table.columns(64).search(this.Status);
    // table.columns(19).search(VendorPONo);
    // table.columns(6).search(this.RRDescription);
    // table.columns(42).search(CustomerSONo);
    // table.columns(34).search(this.CustomerPartNo1);
    // table.columns(10).search(CustomerPONo);
    // table.columns(41).search(this.ReferenceValue);
    // table.columns(26).search(this.IsWarrantyRecovery);
    // table.columns(39).search(this.IsRushRepair);
    // table.columns(40).search(this.IsRepairTag);
    // table.columns(49).search(this.IsPartsDeliveredToCustomer);
    // table.columns(50).search(this.VendorInvoiceId);
    // table.columns(51).search(this.CustomerInvoiceId);
    // table.columns(8).search(this.CompanyName);
    // table.columns(53).search(vendorid);
    // table.columns(54).search(partid);
    // table.columns(55).search(RRIdVendorPO);
    // table.columns(56).search(RRIdCustomerPO);
    // table.columns(57).search(RRIdCustomerSO);
    // table.columns(58).search(this.StatusChangeFromDate);
    // table.columns(59).search(this.StatusChangeToDate);
    // table.columns(60).search(this.StatusChangeId);
    // table.columns(61).search(rrid);
    // table.columns(62).search(this.ShippingStatus);
    // table.columns(63).search(this.ShippingStatusCategory);
    // table.draw();
    this.rerender();


  }


  onClear(event) {
    this.RRNo = '';
    this.PartNo = '';
    this.SerialNo = '';
    this.CompanyName = '';
    this.Status = '';
    this.VendorPONo = '';
    this.VendorName = '';
    this.RRDescription = '';
    this.CustomerSONo = '';
    this.CustomerPartNo1 = '';
    this.CustomerPONo = '';
    this.ReferenceValue = '';
    this.IsWarrantyRecovery = "";
    this.IsPartsDeliveredToCustomer = "";
    this.VendorInvoiceId = "";
    this.CustomerInvoiceId = "";

    this.VendorId = '';
    this.VendorName = '';
    this.PartId = '';
    this.PartNo = '';
    this.CustomerId = '';
    this.CompanyName = '';
    this.RRIdCustomerSO = ""
    this.RRIdVendorPO = ""
    this.RRIdVendorPO = ""
    this.RRId = ""
    this.StatusChangeFromDate = ""
    this.StatusChangeFrom = ""
    this.StatusChangeToDate = ""
    this.StatusChangeTo = ""
    this.StatusChangeId = ""
    this.ShippingStatus = ""
    this.ShippingStatusCategory = "";
    this.CustomerGroupId = null;

    this._opened = !this._opened;
    // this.reLoad();
    this.rerender()
  }


  reLoad() {
    this.router.navigate([this.currentRouter])
  }


  getAdminList() {
    this.service.getHttpService('getAllActiveAdmin').subscribe(response => {//getAdminListDropdown
      this.adminList = response.responseData.map(function (value) {
        return { title: value.FirstName + " " + value.LastName , "UserId": value.UserId }
      });;
    });
  }

  getSubStatusList() {
    this.service.getHttpService('RRSubStatusDDl').subscribe(response => {
      this.subStatusList = response.responseData;
    });
  }

  getPartLocationList() {
    this.service.getHttpService('RRPartLocationDDl').subscribe(response => {
      if (response.status == true) {
        this.RRPartLocationList = response.responseData;
      } else { }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  getCustomerGroupList() {
    this.service.getHttpService("ddCustomerGroup").subscribe(response => {
      if (response.status) {
        this.customerGroupList = response.responseData;
      } 
    });
  }
  changeCustomerGroup(event){
    // console.log(event);
    if(event && event.CustomerGroupId > 0){
      this.CustomerId = ''
      this.customers$ = concat(
        this.searchCustomersWithGroup().pipe( // default items
          catchError(() => of([])), // empty list on error
        ),
        this.customersInput$.pipe(
          distinctUntilChanged(),
          debounceTime(800),
          switchMap(term => {
            if (term != null && term != undefined)
              return this.searchCustomersWithGroup(term).pipe(
                catchError(() => of([])), // empty list on error
              )
            else
              return of([])
          })
        )
      );
    }else{
      this.loadCustomers();
    }
  }
  searchCustomersWithGroup(term: string = ""): Observable<any> {
    this.loadingCustomers = true;
    var postData = {
      "Customer": term,
      "CustomerGroupId": this.CustomerGroupId
    }
    return this.service.postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }

}
