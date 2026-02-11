import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from "@angular/core";
import { FormBuilder, NgForm } from "@angular/forms";
import * as moment from "moment";
import { BsModalRef } from "ngx-bootstrap/modal";
import { CommonService } from "src/app/core/services/common.service";
import {
  CONST_AH_Group_ID,
  Const_Alert_pop_message,
  Const_Alert_pop_title,
  CONST_ShipAddressType,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";

@Component({
  selector: "app-mro-ship",
  templateUrl: "./mro-ship.component.html",
  styleUrls: ["./mro-ship.component.scss"],
})
export class MroShipComponent implements OnInit {
  CustomerName;
  VendorName;
  ahName;
  RRShippingHistory: any = [];
  MROId;
  shippingDetails;
  submitted = false;
  model: any = {};
  AddressList;
  vendorList;
  ShipFromId;
  ShipToName;
  ShipFromName;
  ShipFromAddressId;
  ShipViaList;
  VendorId;
  ShipToAddressList;
  ShippingIdentityId;
  CustomerId;
  Currentdate = new Date();
  ShippingStatus;
  ah_groupId;
  ShippingIdentityType;
  customerList;
  ShipFromAddressList;
  ShipToIdentityName;
  ReceiveIdentityType;
  ShippingAddressId;
  ShippingIdentityName;
  Status;
  btnDisabled: boolean = false;
  Qtyshow: boolean = true;
  SOItemId;
  SOId;
  POItemId;
  POId;
  PartId;
  qtyError: boolean = false;
  ReadyForShipment;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any
  ) {}

  ngOnInit(): void {
    this.MROId = this.data.MROId;
    this.VendorId = this.data.VendorId;
    this.CustomerId = this.data.CustomerId;
    this.CustomerName = this.data.CustomerName;
    this.SOItemId = this.data.SOItemId;
    this.SOId = this.data.SOId;
    this.POItemId = this.data.POItemId;
    this.POId = this.data.POId;
    this.PartId = this.data.PartId;
    this.ReadyForShipment = this.data.ReadyForShipment;
    this.model.ShippedBy = localStorage.getItem("UserName");
    const years = Number(this.datePipe.transform(this.Currentdate, "yyyy"));
    const Month = Number(this.datePipe.transform(this.Currentdate, "MM"));
    const Day = Number(this.datePipe.transform(this.Currentdate, "dd"));
    this.model.ShipDate = {
      year: years,
      month: Month,
      day: Day,
    };

    this.getShipViaList();
    this.onCustomerShipAddress();
    this.getShipFromAddressList();
  }

  onValidatieQty(qty) {
    if (qty > this.ReadyForShipment) {
      this.qtyError = true;
    } else {
      this.qtyError = false;
    }
  }
  getVendorList() {
    this.commonService
      .getHttpService("getVendorListDropdown")
      .subscribe((response) => {
        this.vendorList = response.responseData;
        if (
          this.ShipFromId == this.ah_groupId &&
          this.shippingDetails.ShipIdentityType == "Customer"
        ) {
          if (this.VendorId != "") {
            this.ShipToName = this.vendorList.find(
              (a) => a.VendorId == this.VendorId
            ).VendorName;
          }
        }
      });
  }

  getCustomerList() {
    this.commonService
      .getHttpService("getCustomerListDropdown")
      .subscribe((response) => {
        this.customerList = response.responseData;
        if (
          this.ShipFromId == this.ah_groupId &&
          this.ShippingStatus == 2 &&
          this.shippingDetails.ShipIdentityType != "Customer"
        ) {
          // if (this.CustomerId != '') {
          //   this.ShipToName = this.customerList.find(a => a.CustomerId == this.CustomerId).CompanyName
          // } else {
          //   this.ShipToName = ""
          // }
        }
      });
  }
  filterAndGetValue(object, getField, filterField, filterValue) {
    var value = object.filter(
      function (data) {
        return data[filterField] == filterValue;
      },
      filterField,
      filterValue
    );
    return value[0][getField];
  }
  getShipViaList() {
    this.commonService.getHttpService("ShipViaList").subscribe((response) => {
      this.ShipViaList = response.responseData;
    });
  }

  getShipFromAddressList() {
    var postData = {
      IdentityId: this.VendorId,
      IdentityType: 2,
      Type: CONST_ShipAddressType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.ShipFromAddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            Address: value.AddressId,
          };
        });
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId;
          }
        });
        this.model.Address = ShippingAddress[0];
      });
  }

  onCustomerShipAddress() {
    var postData = {
      IdentityId: this.CustomerId,
      IdentityType: 1,
      Type: CONST_ShipAddressType,
    };
    // this.CustomerName = this.customerList.find(a => a.CustomerId == this.CustomerId).CompanyName

    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.ShipToAddressList = response.responseData.map(function (value) {
          return {
            title:
              value.StreetAddress +
              " " +
              value.SuiteOrApt +
              ", " +
              value.City +
              " , " +
              value.StateName +
              " ," +
              value.CountryName +
              ". - " +
              value.Zip,
            ShipToAddressId: value.AddressId,
          };
        });
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId;
          }
        });
        this.model.ShipToAddressId = ShippingAddress[0];
      });
  }

  onSubmit(f: NgForm) {
    const ShipDateYears = this.model.ShipDate.year;
    const ShipDateDates = this.model.ShipDate.day;
    const ShipDatemonths = this.model.ShipDate.month;
    let shipDate = new Date(ShipDateYears, ShipDatemonths - 1, ShipDateDates);
    let ShipDate = moment(shipDate).format("YYYY-MM-DD");
    if (f.valid && this.qtyError == false) {
      this.btnDisabled = true;
      if (this.model.ShowCustomerReference == true) {
        var ShowCustomerReference = 1;
      } else {
        ShowCustomerReference = 0;
      }
      if (this.model.ShowRootCause == true) {
        var ShowRootCause = 1;
      } else {
        ShowRootCause = 0;
      }
      var postData = {
        MROId: this.MROId,
        POId: this.POId,
        POItemId: this.POItemId,
        SOId: this.SOId,
        SOItemId: this.SOItemId,
        PartId: this.PartId,
        Quantity: this.model.ShipQuantity,
        ShipFromIdentity: 2,
        ShipFromId: CONST_AH_Group_ID,
        ShipFromName: "Aibond",
        ShipFromAddressId: this.model.Address,
        ShipViaId: this.model.ShipViaId,
        TrackingNo: this.model.TrackingNo,
        PackWeight: this.model.PackWeight,
        ShippingCost: this.model.ShippingCost,
        ShipDate: ShipDate,
        ShippedBy: this.model.ShippedBy,
        ShipComment: this.model.ShipComment,
        ShipToIdentity: 1,
        ShipToId: this.CustomerId,
        ShipToName: this.CustomerName,
        ShowCustomerReference: ShowCustomerReference,
        ShowRootCause: ShowRootCause,
        ShipToAddressId: this.model.ShipToAddressId,
      };

      this.commonService.postHttpService(postData, "Ship").subscribe(
        (response) => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: "Success!",
              text: "Ship saved Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Ship could not be saved!",
              type: "warning",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          }
          this.cd_ref.detectChanges();
        },
        (error) => console.log(error)
      );
    } else {
      Swal.fire({
        type: "error",
        title: Const_Alert_pop_title,
        text: Const_Alert_pop_message,
        confirmButtonClass: "btn btn-confirm mt-2",
      });
    }
  }
  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }
}
