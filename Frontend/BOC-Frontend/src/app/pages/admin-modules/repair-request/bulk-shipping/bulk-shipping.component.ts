import { Component, OnInit, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { array_rr_status, CONST_AH_Group_ID, Const_Alert_pop_message, Const_Alert_pop_title, CONST_CREATE_ACCESS, CONST_ShipAddressType, CONST_VIEW_ACCESS, shipping_status, UPS_ID, user_type } from 'src/assets/data/dropdown';
import { DatePipe } from '@angular/common';
import { PackingSlipComponent } from '../../quotes/packing-slip/packing-slip.component';
import { BulkShippingPackingslipComponent } from '../../common-template/bulk-shipping-packingslip/bulk-shipping-packingslip.component';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { UpdatePartCurrentLocationComponent } from '../../common-template/update-part-current-location/update-part-current-location.component';
import { BulkCaseShipComponent } from '../../common-template/bulk-case-ship/bulk-case-ship.component';
import { BulkCaseReceiveComponent } from '../../common-template/bulk-case-receive/bulk-case-receive.component';
import { BulkCaseUpdatepartLocationComponent } from '../../common-template/bulk-case-updatepart-location/bulk-case-updatepart-location.component';
import * as xml2js from 'xml2js';
import { UpsBulkShippingComponent } from '../../common-template/ups-bulk-shipping/ups-bulk-shipping.component';

@Component({
  selector: 'app-bulk-shipping',
  templateUrl: './bulk-shipping.component.html',
  styleUrls: ['./bulk-shipping.component.scss']
})
export class BulkShippingComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  model: any = {}
  btnDisabled: boolean = false;
  public event: EventEmitter<any> = new EventEmitter();
  customers$: Observable<any> = of([]);
  customersInput$ = new Subject<string>();
  loadingCustomers: boolean = false;
  CustomersList: any[] = [];
  Vendors$: Observable<any> = of([]);
  VendorsInput$ = new Subject<string>();
  CustomerId
  VendorId
  ShippingStatusList: any = []
  RRStatus: any = []
  ShipViaList: any = []
  RRNo
  Status
  ShippingStatus
  CustomerReference;
  EvalNotes;
  ShipViaId;
  UserTypeList: any = [];
  ShipFrom;
  ShipTo;
  RRInfo: any = [];
  RRShippingHistory: any = []
  RRDetails: any = []
  ah_groupId
  customerList: any = []
  ShippingArray: any = []
  customerAddressList: any = []
  ahAddress
  array_rr_status
  CustomerName;
  CustomerAddress
  ShippingError
  RRSalesOrder: any = [];
  accessRights: any = [];
  CREATE_ACCESS = CONST_CREATE_ACCESS;
  selectalldisable: boolean = false;
  IsAddEnabled
  IsViewEnabled
  UPSId
  RRNoSearch
  RRfilterData: any = []
  //UPS Variable
  access = "0D90D48B4B528035";
  userid = "ahdshipping1";
  passwd = "American@2020";
  // wsdl = "http://localhost/Shipping_Pkg/ShippingPACKAGE/PACKAGEWebServices/SCHEMA-WSDLs/Ship.wsdl";
  wsdl = "assets/xml/Ship-copy.wsdl";
  operation = "ProcessShipment";
  endpointurl = "https://wwwcie.ups.com/webservices/Ship";
  outputFileName = "XOLTResult.xml";
  outputFileNameJson = "XOLTResult.json";
  shipperNumber = "425597";
  shipRequestOption = "nonvalidate";
  shipperName = 'ShipperName';
  shipperAttentionName = 'ShipperZs Attn Name';
  shipperTaxIdentificationNumber = '123456';
  shipperAddressLine = '2311 York Rd';
  shipperCity = 'Timonium';
  shipperStateProvinceCode = 'MD';
  shipperPostalCode = '21093';
  shipperCountryCode = 'US';
  shipperPhoneNumber = '1115554758';
  shipperPhoneExtension = '1';
  ShipAccountNumber
  ups_gif_image: any;
  ups_html_image: any;
  ups_html_image_decode: any;
  ups_status: any;
  ups_tracking_number: any;
  ups_trans_code: any;
  ups_trans_value: any;
  ups_service_value: any;
  ups_service_code: any;
  ups_total_value: any;
  ups_total_code: any;
  ups_unit_code: any;
  ups_unit_des: any;
  ups_unit_weight: any;
  error: any;
  Form: FormGroup
  xml: any;
  ShippingHistoryId
  IsUPSEnable;
  IsUserUPSEnable;
  ShowShipFromAddress: boolean = false;
  ShowShipToAddress: boolean = false;
  ShippingIdentityType: number;
  ShipFromAddressList: any;
  ShipFromAddress: any;
  ShipToAddressList: any;
  hideRRs: boolean = false;
  constructor(public modalRef: BsModalRef,
    private fb: FormBuilder,
    private CommonmodalService: BsModalService,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any,) { }

  ngOnInit(): void {
    this.accessRights = JSON.parse(localStorage.getItem("accessRights"));
    this.RRSalesOrder = this.accessRights["RRSalesOrder"].split(",");
    this.IsAddEnabled = this.commonService.permissionCheck("BulkShipping", CONST_CREATE_ACCESS);
    this.IsViewEnabled = this.commonService.permissionCheck("BulkShipping", CONST_VIEW_ACCESS);


    this.UPSId = UPS_ID
    this.IsUPSEnable = ''
    this.IsUserUPSEnable = localStorage.getItem("IsUserUPSEnable")
    this.getAdminSettingsView()

    this.ahAddress = ""
    this.CustomerAddress = ''
    this.loadCustomers();
    this.loadVendors();
    this.getCustomerList();
    this.ShippingStatusList = shipping_status;
    this.RRStatus = array_rr_status;
    this.getShipViaList()
    this.UserTypeList = user_type
    this.ah_groupId = CONST_AH_Group_ID
    this.getahaddress();
    this.array_rr_status = array_rr_status;

    // console.log(this.model);


  }
  getAdminSettingsView() {
    var postData = {}
    this.commonService.postHttpService(postData, "getSettingsGeneralView").subscribe(response => {
      if (response.status == true) {
        this.IsUPSEnable = response.responseData.IsUPSEnable

      }
      else {

      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }
  getahaddress() {
    var postData = {
      "IdentityId": CONST_AH_Group_ID,
      "IdentityType": 2,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.customerAddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      var ShippingAddress = response.responseData.map(function (value) {
        if (value.IsShippingAddress == 1) {
          return value
        }
      });
      this.ahAddress = ShippingAddress[0]

    });
  }
  getCustomerddress() {
    var postData = {
      "IdentityId": this.model.CustomerId,
      "IdentityType": 1,
      "Type": CONST_ShipAddressType

    }
    this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
      this.customerAddressList = response.responseData.map(function (value) {
        return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "AddressId": value.AddressId }
      });
      var ShippingAddress = response.responseData.map(function (value) {
        if (value.IsShippingAddress == 1) {
          return value
        }
      });
      this.CustomerAddress = ShippingAddress[0]
      this.CustomerName = this.customerList.find(a => a.CustomerId == this.model.CustomerId).CompanyName


    });
  }
  onSearch(f: NgForm) {
    this.RRfilterData = []
    this.RRNoSearch = ''
    this.isAllUnSelected()
    if (this.model.RRNo != undefined) {
      var rrNo = this.model.RRNo.replace("\n", "").toString()
      var RRNo = rrNo.split(" ");
    } else {
      RRNo = ""
    }

    if (f.valid) {
      if (this.model.ShipFrom == this.model.ShipTo) {
        this.ShippingError = 'Error';
        return false;
      } else {
        this.ShippingError = ''

        var postData = {
          "CustomerId": this.model.CustomerId,
          "VendorId": this.model.VendorId ? this.model.VendorId.VendorId : 0,
          "RRNo": RRNo,
          "Status": this.model.Status || '-1',
          "ShipTo": this.model.ShipTo
        }
        if (this.model.CustomerId) {
          this.getCustomerddress()
        }
        this.commonService.postHttpService(postData, "SearchListForBulkShipping").subscribe(response => {
          // console.log(response.responseData);
          if (response.status == true) {
            this.RRDetails = response.responseData.map(a => {
              a.checked = false;
              a.statusObj = array_rr_status.find(item => item.id == a.Status)
              return a;
            });
            this.checkValueHide();
          }
          else {
            this.RRDetails = []
            Swal.fire({
              title: 'Message',
              text: response.message,
              type: 'info',
              confirmButtonClass: 'btn btn-confirm mt-2'
            });
          }
          this.cd_ref.detectChanges();
        }, error => console.log(error));
      }
    }
  }

  onSearchload() {
    this.isAllUnSelected()
    if (this.model.RRNo != undefined) {
      var rrNo = this.model.RRNo.replace("\n", "").toString()
      var RRNo = rrNo.split(" ");
    } else {
      RRNo = ""
    }
    var postData = {
      "CustomerId": this.model.CustomerId,
      "VendorId": this.model.VendorId ? this.model.VendorId.VendorId : 0,
      "RRNo": RRNo,
      "Status": this.model.Status || '-1',
      "ShipTo": this.model.ShipTo
    }
    if (this.model.CustomerId) {
      this.getCustomerddress()
    }
    this.commonService.postHttpService(postData, "SearchListForBulkShipping").subscribe(response => {

      if (response.status == true) {
        this.RRDetails = response.responseData.map(a => {
          a.checked = false; a.statusObj = array_rr_status.find(item => item.id == a.Status)
          return a;
        });
        this.checkValueHide();
      }
      else {
        this.RRDetails = []
        Swal.fire({
          title: 'Message',
          text: response.message,
          type: 'info',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  onClear() {
    this.model.CustomerId = null,
      this.model.VendorId = null,
      this.model.RRNo = undefined,
      this.model.Status = "",
      this.model.ShipFrom = "",
      this.model.ShipFromAddressId = null,
      this.model.ShipTo = "",
      this.model.ShipToAddressId = null,
      this.model.ShowRootCause = false,
      this.model.ShowCustomerReference = false,
      this.model.ShipViaId = '',
      this.RRDetails = [],
      this.RRfilterData = [],
      this.RRNoSearch = ''
  }

  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(function (data) {
      return data[filterField] == filterValue;
    }, filterField, filterValue)
    return value[0][getField];
  }

  CreateBulkitem(event, i) {
    this.RRDetails[i].checked = event.target.checked;
  }
  onSubmitStatic(f1: NgForm) {
    if (f1.valid) {
      this.ShippingArray = this.RRDetails.filter(a => a.checked);
      if (this.ShippingArray.length > 0) {
        if (((this.model.ShipFrom == 'Aibond' && this.model.ShipTo == 'Customer') || (this.model.ShipFrom == 'Aibond' && this.model.ShipTo == 'Vendor')) && this.model.ShipViaId == this.UPSId && this.IsUPSEnable == '1' && this.IsUserUPSEnable == 1) {
          var UPSInfo = {
            "ShipFrom": this.model.ShipFrom,
            "ShipTo": this.model.ShipTo,
            "ShipViaId": this.model.ShipViaId,
            "CustomerId": this.model.CustomerId,
            "VendorId": this.model.VendorId ? this.model.VendorId.VendorId : 0,
            "ShippingArray": this.ShippingArray,
            "CustomerShipper": this.model.CustomerShipperNumber,
            "VendorShipper": this.model.VendorShipperNumber,
            "ShipToAddressId": this.model.ShipToAddressIdNew
          }
          this.modalRef = this.CommonmodalService.show(UpsBulkShippingComponent,
            {
              backdrop: 'static',
              ignoreBackdropClick: false,
              initialState: {
                data: { UPSInfo },
                class: 'modal-xl'
              }, class: 'gray modal-xl'
            });
          this.modalRef.content.closeBtnName = 'Close';

          this.modalRef.content.event.subscribe(res => {
            this.onSearchload();
          });

        } else {

          var postData = {
            "ShipFrom": this.model.ShipFrom,
            "ShipTo": this.model.ShipTo,
            "ShipViaId": this.model.ShipViaId,
            "CustomerId": this.model.CustomerId,
            "VendorId": this.model.VendorId ? this.model.VendorId.VendorId : 0,
            "ShippingArray": this.ShippingArray,
            "ShipToAddressId": this.model.ShipToAddressIdNew
          }
          this.commonService.postHttpService(postData, "BulkShipping").subscribe(response => {
            if (response.status == true) {
              this.onSearchload();
              var BulkShipId = response.responseData.BulkShipId;
              var ShipToAddressId = this.model.ShipToAddressIdNew;
              this.modalRef = this.CommonmodalService.show(BulkShippingPackingslipComponent,
                {
                  backdrop: 'static',
                  ignoreBackdropClick: false,
                  initialState: {
                    data: { BulkShipId, ShipToAddressId },
                    class: 'modal-xl'
                  }, class: 'gray modal-xl'
                });
            }
            else {
              Swal.fire({
                title: 'Error!',
                text: response.message,
                type: 'warning',
                confirmButtonClass: 'btn btn-confirm mt-2'
              });

            }
            this.cd_ref.detectChanges();
          }, error => console.log(error));
        }
      }
      else {
        Swal.fire({
          type: 'info',
          title: 'Message',
          text: 'Please checked the RR Line Item',
          confirmButtonClass: 'btn btn-confirm mt-2',
        });

      }
    }
  }
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
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
    return this.commonService.postHttpService(postData, "getAllAutoComplete")
      .pipe(
        map(response => {
          this.CustomersList = response.responseData;
          this.loadingCustomers = false;
          return response.responseData;
        })
      );
  }
  loadVendors() {
    this.Vendors$ = concat(
      of([]), // default items
      this.VendorsInput$.pipe(
        distinctUntilChanged(),
        debounceTime(800),
        // tap(() => this.moviesLoading = true),
        switchMap(term => {

          return this.searchVendors(term).pipe(
            catchError(() => of([])), // empty list on error
            // tap(() => this.moviesLoading = false)
          )
        })
      )
    );
  }
  searchVendors(term: string = ""): Observable<any> {
    var postData = {
      "Vendor": term
    }
    return this.commonService.postHttpService(postData, "getAllAutoCompleteofVendor")
      .pipe(
        map(response => {
          return response.responseData;
        })
      );
  }
  getShipViaList() {
    this.commonService.getHttpService('ShipViaList').subscribe(response => {
      this.ShipViaList = response.responseData;
    });
  }

  getCustomerList() {
    this.commonService.getHttpService('getCustomerListDropdown').subscribe(response => {
      this.customerList = response.responseData;
    });
  }
  //Part Current Location
  onUpdatePartCurrentLocation(RRId, VendorId, CustomerId, PartCurrentdetails, i) {
    if (CustomerId) {
      var CustomerName = this.customerList.find(a => a.CustomerId == CustomerId).CompanyName
    }
    var RRId = RRId;
    var VendorId = VendorId;
    var CustomerId = CustomerId;
    this.modalRef = this.CommonmodalService.show(BulkCaseUpdatepartLocationComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { RRId, VendorId, CustomerId, CustomerName, PartCurrentdetails },
          class: 'modal-lg'
        }, class: 'gray modal-lg'
      });

    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      this.RRDetails[i] = res.data.PartCurrentdetails
      if (this.RRNoSearch == '') {
        if (this.RRfilterData.length > 0) {
          this.onSearchRRload()
        } else {
          this.onSearchload()

        }
      } else {
        this.onSearchload2()
      }
    });
  }
  //Ship
  onShip(ShipDetails, i) {
    this.modalRef = this.CommonmodalService.show(BulkCaseShipComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { ShipDetails },
          class: 'modal-xl'
        }, class: 'gray modal-xl'
      });
    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe(res => {
      this.RRDetails[i] = res.data.ShipDetails
      if (this.RRNoSearch == '') {
        if (this.RRfilterData.length > 0) {
          this.onSearchRRload()
        } else {
          this.onSearchload()

        }
      } else {
        this.onSearchload2()
      }
    });
  }
  //Receive
  onRRShippingReceive(ReceiveDetails, i) {
    this.modalRef = this.CommonmodalService.show(BulkCaseReceiveComponent,
      {
        backdrop: 'static',
        ignoreBackdropClick: false,
        initialState: {
          data: { ReceiveDetails },
          class: 'modal-xl',


        }, class: 'gray modal-xl',

      });

    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe(res => {
      this.RRDetails[i] = res.data.ReceiveDetails
      if (this.RRNoSearch == '') {
        if (this.RRfilterData.length > 0) {
          this.onSearchRRload()
        } else {
          this.onSearchload()

        }
      } else {
        this.onSearchload2()
      }
    });
  }
  //Create SO
  CreateSO(item) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success mt-2',
      cancelButtonClass: 'btn btn-danger ml-2 mt-2',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        var postData = {
          RRId: item.RRId,
          QuoteId: item.QuoteId,
          CustomerId: this.model.CustomerId,
          CustomerShipToId: item.CustomerShipToId,
          CustomerBillToId: item.CustomerBillToId
        }
        this.commonService.postHttpService(postData, 'RRCreateSO').subscribe(response => {
          if (response.status == true) {
            Swal.fire({
              title: 'Created SO!',
              text: 'Sales Order has been created.',
              type: 'success'
            });
            if (this.RRNoSearch == '') {
              if (this.RRfilterData.length > 0) {
                this.onSearchRRload()
              } else {
                this.onSearchload()

              }
            } else {
              this.onSearchload2()
            }
          }
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Sales Order has not created.',
          type: 'error'
        });
      }
    });

  }

  getResult(val) {
    if (val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse']) {
      this.error = '';
      this.ups_status = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['common:Response'][0]['common:ResponseStatus'][0]['common:Description'][0];
      this.ups_tracking_number = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentIdentificationNumber'][0];

      this.ups_gif_image = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:PackageResults'][0]['ship:ShippingLabel'][0]['ship:GraphicImage'][0];
      this.ups_html_image = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:PackageResults'][0]['ship:ShippingLabel'][0]['ship:HTMLImage'][0];
      // this.ups_html_image_decode = atob(this.ups_html_image); 
      this.ups_trans_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TransportationCharges'][0]['ship:CurrencyCode'][0];
      this.ups_trans_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TransportationCharges'][0]['ship:MonetaryValue'][0];

      this.ups_service_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:ServiceOptionsCharges'][0]['ship:CurrencyCode'][0];
      this.ups_service_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:ServiceOptionsCharges'][0]['ship:MonetaryValue'][0];

      this.ups_total_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TotalCharges'][0]['ship:CurrencyCode'][0];
      this.ups_total_value = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:ShipmentCharges'][0]['ship:TotalCharges'][0]['ship:MonetaryValue'][0];

      this.ups_unit_code = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:UnitOfMeasurement'][0]['ship:Code'][0];
      this.ups_unit_des = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:UnitOfMeasurement'][0]['ship:Description'][0];
      this.ups_unit_weight = val['soapenv:Envelope']['soapenv:Body'][0]['ship:ShipmentResponse'][0]['ship:ShipmentResults'][0]['ship:BillingWeight'][0]['ship:Weight'][0];
    } else {
      this.ups_status = 'fail';
      this.ups_gif_image = '';
      this.error = val['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault'][0]['detail'][0]['err:Errors'][0]['err:ErrorDetail'][0]['err:PrimaryErrorCode'][0]['err:Description'][0];
    }
  }


  onSearchRR() {
    var RRNoSearch = this.RRNoSearch.trim()
    if (RRNoSearch != "") {
      if (this.RRDetails.find(a => a.RRNo == RRNoSearch)) {
        var RRSearchData = []
        RRSearchData.push(
          this.RRDetails.find(a => a.RRNo == RRNoSearch)
        )
        this.RRfilterData.push(
          this.RRDetails.find(a => a.RRNo == RRNoSearch)
        )

        this.RRDetails = RRSearchData;
        this.checkValueHide();
      } else {
        Swal.fire({
          title: 'Message',
          text: 'No Record found',
          type: 'info',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
    }
  }

  onClearSearch() {
    this.onSearchRRload()
  }

  onSearchRRload() {
    this.RRNoSearch = ''
    if (this.model.RRNo != undefined) {
      var rrNo = this.model.RRNo.replace("\n", "").toString()
      var RRNo = rrNo.split(" ");
    } else {
      RRNo = ""
    }
    var postData = {
      "CustomerId": this.model.CustomerId,
      "VendorId": this.model.VendorId ? this.model.VendorId.VendorId : 0,
      "RRNo": RRNo,
      "Status": this.model.Status || '-1',
      "ShipTo": this.model.ShipTo
    }
    if (this.model.CustomerId) {
      this.getCustomerddress()
    }
    this.commonService.postHttpService(postData, "SearchListForBulkShipping").subscribe(response => {

      if (response.status == true) {
        this.RRfilterData = this.RRfilterData.filter(a => a.checked)
        response.responseData.map(a => {
          if (this.RRfilterData.find(x => x.RRNo == a.RRNo)) {
            var checkeditem = this.RRfilterData.find(x => x.RRNo == a.RRNo)
            a.checked = checkeditem.checked
            a.PackWeight = checkeditem.PackWeight
          } else {
            a.checked = false
          }
          a.statusObj = array_rr_status.find(item => item.id == a.Status)
          return a;
        });

        this.RRDetails = response.responseData;
        this.checkValueHide();



      }
      else {
        this.RRDetails = []
        Swal.fire({
          title: 'Message',
          text: response.message,
          type: 'info',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }


  onSearchload2() {
    if (this.model.RRNo != undefined) {
      var rrNo = this.model.RRNo.replace("\n", "").toString()
      var RRNo = rrNo.split(" ");
    } else {
      RRNo = ""
    }
    var postData = {
      "CustomerId": this.model.CustomerId,
      "VendorId": this.model.VendorId ? this.model.VendorId.VendorId : 0,
      "RRNo": RRNo,
      "Status": this.model.Status || '-1',
      "ShipTo": this.model.ShipTo
    }
    if (this.model.CustomerId) {
      this.getCustomerddress()
    }
    this.commonService.postHttpService(postData, "SearchListForBulkShipping").subscribe(response => {

      if (response.status == true) {
        response.responseData.map(a => {
          if (this.RRfilterData.find(x => x.RRNo == a.RRNo)) {
            var checkeditem = this.RRfilterData.find(x => x.RRNo == a.RRNo)
            a.checked = checkeditem.checked
            a.PackWeight = checkeditem.PackWeight
          } else {
            a.checked = false
          }
          a.statusObj = array_rr_status.find(item => item.id == a.Status)
          return a;
        });
        this.RRDetails = response.responseData;
        this.onSearchRR();

      }
      else {
        this.RRDetails = []
        Swal.fire({
          title: 'Message',
          text: response.message,
          type: 'info',
          confirmButtonClass: 'btn btn-confirm mt-2'
        });
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));

  }

  shipFromChange() {
    // console.log(this.model.ShipFrom);
    switch (this.model.ShipFrom) {
      case "Aibond":
        this.ShippingIdentityType = 2;
        this.getAHaddress("From");
        break;
      case "Customer":
        // console.log("Customer",this.model.CustomerId);
        this.ShippingIdentityType = 1;
        this.getShipFromAddressList(this.model.CustomerId);
        break;
      case "Vendor":
        // console.log("Vendor",this.model.VendorId);
        this.ShippingIdentityType = 2;
        this.getShipFromAddressList(this.model.VendorId.VendorId);
        break;
      default:
    }

    this.ShowShipFromAddress = true;
  }

  shipToChange() {
    // console.log(this.model.ShipTo);
    switch (this.model.ShipTo) {
      case "Aibond":
        this.ShippingIdentityType = 2;
        this.getAHaddress("To");
        break;
      case "Customer":
        this.ShippingIdentityType = 1;
        this.getShipToAddressList(this.model.CustomerId);
        break;
      case "Vendor":
        this.ShippingIdentityType = 2;
        this.getShipToAddressList(this.model.VendorId.VendorId);
        break;
      default:
    }
    this.ShowShipToAddress = true;
  }

  getShipFromAddressList(IdentityId) {
    console.log(IdentityId);
    if (IdentityId == null || IdentityId == '') {
      Swal.fire({
        title: 'Message',
        text: "Please choose customer/vendor!",
        type: 'info',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
    } else {
      var postData = {
        "IdentityId": IdentityId,
        "IdentityType": this.ShippingIdentityType,
        // "Type": CONST_ShipAddressType
      }
      this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
        this.ShipFromAddressList = response.responseData.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "Address": value.AddressId }
        });
      });
    }

  }

  getShipToAddressList(IdentityId) {
    console.log(IdentityId);
    if (IdentityId == null || IdentityId == '') {
      Swal.fire({
        title: 'Message',
        text: "Please choose customer/vendor!",
        type: 'info',
        confirmButtonClass: 'btn btn-confirm mt-2'
      });
    } else {
      var postData = {
        "IdentityId": IdentityId,
        "IdentityType": this.ShippingIdentityType
      }
      this.commonService.postHttpService(postData, 'getAddressList').subscribe(response => {
        this.ShipToAddressList = response.responseData.map(function (value) {
          return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "Address": value.AddressId }
        });

        // var ShippingAddress = response.responseData.map(function (value) {
        //   if (value.IsShippingAddress == 1) {
        //     return value.AddressId
        //   }
        // });
        // this.model.ShipToAddressIdNew = ShippingAddress[0]
      });


    }
  }

  getAHaddress(type) {
    this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(response => {
      if (response.status == true) {
        if (type == "From") {
          this.ShipFromAddressList = response.responseData.AHGroupVendorAddress.map(function (value) {
            return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "Address": value.AddressId }
          });
        } else {
          this.ShipToAddressList = response.responseData.AHGroupVendorAddress.map(function (value) {
            return { title: value.StreetAddress + " " + value.SuiteOrApt + ", " + value.City + " , " + value.StateName + " ," + value.CountryName + ". - " + value.Zip, "Address": value.AddressId }
          });
        }
      }
      this.cd_ref.detectChanges();
    }, error => console.log(error));
  }

  //Select all
  isAllSelected() {
    this.RRDetails.map((item: any) => {
      // if ((item.ShippingStatus==0 ||  item.ShippingStatus==null)||(item.ShippingIdentityId!=this.ah_groupId && item.ShipFromId != null) || (item.ShippingStatus==1 && item.ReceiveDate == null) || ((item.ShippingStatus!=2) && (item.ReceiveDate == null && item.ShipToId != this.ah_groupId)) || (item.ShippingStatus==2 && item.ShippingIdentityId== this.model.CustomerId && item.ShippingIdentityType == 1) || (item.Status==5 && item.CustomerSOId== 0 && this.model.ShipTo == 'Customer')
      // || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == null && item.ShipToId != item.VendorId) 
      // || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == this.model.CustomerId) 
      // || (this.model.ShipFromAddressIdNew != item.ShippingAddressId) 
      // || (item.CustomerShipIdLocked > 0 && item.CustomerShipIdLocked != this.model.ShipToAddressIdNew))
      // {item.checked = false
      // }else{
      //   item.checked = true
      // }
      if (this.model.ShipFrom == "Aibond") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingIdentityId != this.ah_groupId && item.ShipFromId != null)
          || (item.ShippingStatus == 1 && item.ReceiveDate == null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != this.ah_groupId))
          || (item.ShippingStatus == 2 && item.ShippingIdentityId == this.model.CustomerId && item.ShippingIdentityType == 1)
          || (item.Status == 5 && item.CustomerSOId == 0 && this.model.ShipTo == 'Customer')
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
          || (this.model.ShipTo == 'Customer' && item.CustomerShipIdLocked > 0 && item.CustomerShipIdLocked != this.model.ShipToAddressIdNew)
          || (this.model.ShipTo == 'Vendor' && item.VendorShipIdLocked > 0 && item.VendorShipIdLocked != this.model.ShipToAddressIdNew)
        ) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      } else if (this.model.ShipFrom == "Vendor" && this.model.ShipTo == "Customer") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingStatus == 1 && item.ReceiveDate == null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != item.VendorId))
          || (item.ShippingStatus == 2 && item.ShippingIdentityId == this.model.CustomerId && item.ShippingIdentityType == 1)
          || (item.Status == 5 && item.CustomerSOId == 0 && this.model.ShipTo == 'Customer')
          || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == null && item.ShipToId != item.VendorId)
          || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == this.model.CustomerId)
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
          || (item.CustomerShipIdLocked > 0 && item.CustomerShipIdLocked != this.model.ShipToAddressIdNew)
        ) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      } else if (this.model.ShipFrom == "Customer" && this.model.ShipTo == "Vendor") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingIdentityId != item.CustomerId && item.ShipFromId != null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != item.CustomerId))
          || (item.ShippingIdentityId != item.CustomerId && item.ShipToId != item.CustomerId)
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
          || (item.VendorShipIdLocked > 0 && item.VendorShipIdLocked != this.model.ShipToAddressIdNew)
        ) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      } else if (this.model.ShipFrom == "Vendor" && this.model.ShipTo == "Aibond") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingStatus == 1 && item.ReceiveDate == null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != item.VendorId))
          || (item.ShippingStatus == 2 && item.ShippingIdentityId == this.model.CustomerId && item.ShippingIdentityType == 1)
          || (item.Status == 5 && item.CustomerSOId == 0 && this.model.ShipTo == 'Customer')
          || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == null && item.ShipToId != item.VendorId)
          || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == this.model.CustomerId)
          || (item.ShipFromId != null && item.ShipToId != item.VendorId)
          || (item.ShippingIdentityId == item.CustomerId && item.ShipFromId == null)
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
        ) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      } else if (this.model.ShipFrom == "Customer" && this.model.ShipTo == "Aibond") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingIdentityId != item.CustomerId && item.ShipFromId != null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != item.CustomerId))
          || (item.ShippingIdentityId != item.CustomerId && item.ShipToId != item.CustomerId)
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
        ) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      }
    });
    this.selectalldisable = true
  }
  //UnSelect all
  isAllUnSelected() {
    this.RRDetails.map((item: any) => {
      item.checked = false
    });
    this.selectalldisable = false
  }

  checkValueHide() {
    this.hideRRs = false;
    this.model.ShipToAddressIdNew = this.model.ShipToAddressId;
    this.model.ShipFromAddressIdNew = this.model.ShipFromAddressId;
    console.log("checkValueHide");
    // this.RRDetails.splice(index, 1);
    this.RRDetails.forEach((item, index) => {
      if (this.model.ShipFrom == "Aibond") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingIdentityId != this.ah_groupId && item.ShipFromId != null)
          || (item.ShippingStatus == 1 && item.ReceiveDate == null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != this.ah_groupId))
          || (item.ShippingStatus == 2 && item.ShippingIdentityId == this.model.CustomerId && item.ShippingIdentityType == 1)
          || (item.Status == 5 && item.CustomerSOId == 0 && this.model.ShipTo == 'Customer')
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
          || (this.model.ShipTo == 'Customer' && item.CustomerShipIdLocked > 0 && item.CustomerShipIdLocked != this.model.ShipToAddressIdNew)
          || (this.model.ShipTo == 'Vendor' && item.VendorShipIdLocked > 0 && item.VendorShipIdLocked != this.model.ShipToAddressIdNew)
        ) {
          item.IsAvailable = 0;
        } else {
          item.IsAvailable = 1
        }
      } else if (this.model.ShipFrom == "Vendor" && this.model.ShipTo == "Customer") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingStatus == 1 && item.ReceiveDate == null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != item.VendorId))
          || (item.ShippingStatus == 2 && item.ShippingIdentityId == this.model.CustomerId && item.ShippingIdentityType == 1)
          || (item.Status == 5 && item.CustomerSOId == 0 && this.model.ShipTo == 'Customer')
          || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == null && item.ShipToId != item.VendorId)
          || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == this.model.CustomerId)
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
          || (item.CustomerShipIdLocked > 0 && item.CustomerShipIdLocked != this.model.ShipToAddressIdNew)
        ) {
          item.IsAvailable = 0;
        } else {
          item.IsAvailable = 1
        }
      } else if (this.model.ShipFrom == "Customer" && this.model.ShipTo == "Vendor") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingIdentityId != item.CustomerId && item.ShipFromId != null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != item.CustomerId))
          || (item.ShippingIdentityId != item.CustomerId && item.ShipToId != item.CustomerId)
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
          || (item.VendorShipIdLocked > 0 && item.VendorShipIdLocked != this.model.ShipToAddressIdNew)
        ) {
          item.IsAvailable = 0;
        } else {
          item.IsAvailable = 1
        }
      } else if (this.model.ShipFrom == "Vendor" && this.model.ShipTo == "Aibond") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingStatus == 1 && item.ReceiveDate == null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != item.VendorId))
          || (item.ShippingStatus == 2 && item.ShippingIdentityId == this.model.CustomerId && item.ShippingIdentityType == 1)
          || (item.Status == 5 && item.CustomerSOId == 0 && this.model.ShipTo == 'Customer')
          || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == null && item.ShipToId != item.VendorId)
          || (item.ShippingIdentityId == this.ah_groupId && item.ShipFromId == this.model.CustomerId)
          || (item.ShipFromId != null && item.ShipToId != item.VendorId)
          || (item.ShippingIdentityId == item.CustomerId && item.ShipFromId == null)
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
        ) {
          item.IsAvailable = 0;
        } else {
          item.IsAvailable = 1
        }
      } else if (this.model.ShipFrom == "Customer" && this.model.ShipTo == "Aibond") {
        if (
          (item.ShippingStatus == 0 || item.ShippingStatus == null)
          || (item.ShippingIdentityId != item.CustomerId && item.ShipFromId != null)
          || ((item.ShippingStatus != 2) && (item.ReceiveDate == null && item.ShipToId != item.CustomerId))
          || (item.ShippingIdentityId != item.CustomerId && item.ShipToId != item.CustomerId)
          || (this.model.ShipFromAddressIdNew != item.ShippingAddressId)
        ) {
          item.IsAvailable = 0;
        } else {
          item.IsAvailable = 1
        }
      }
    })

    console.log(this.RRDetails);
  }

  hideNotReadyRrs() {

    if (this.hideRRs) {
      $(".hideClass").parent().css("display", "none")
    } else {
      $(".hideClass").parent().css("display", "block")
    }
  }

}