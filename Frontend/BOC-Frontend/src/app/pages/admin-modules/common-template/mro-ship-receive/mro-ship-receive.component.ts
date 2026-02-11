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
  CONST_ShipAddressType,
  Const_Alert_pop_title,
  Const_Alert_pop_message,
} from "src/assets/data/dropdown";
import Swal from "sweetalert2";

@Component({
  selector: "app-mro-ship-receive",
  templateUrl: "./mro-ship-receive.component.html",
  styleUrls: ["./mro-ship-receive.component.scss"],
})
export class MroShipReceiveComponent implements OnInit {
  RRShippingHistory;
  VendorName;
  MROId;
  shippingDetails;
  submitted = false;
  model: any = {};
  AddressList;
  ShipToIdentityName;
  ReceiveIdentityType;
  ShippingIdentityType;
  Currentdate = new Date();
  AddressData;
  ShipFromAddressId;
  From;
  To;
  CustomerId;
  Status;
  btnDisabled: boolean = false;
  ShipViaList: any = [];
  ShipFromAddressList: any = [];
  VendorId;
  SOItemId;
  SOId;
  POItemId;
  POId;
  Pending;
  qtyError: boolean = false;
  ReceiveDateError: boolean = false;
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
    this.VendorName = this.data.VendorName;
    this.CustomerId = this.data.CustomerId;
    this.VendorId = this.data.VendorId;
    this.SOItemId = this.data.SOItemId;
    this.SOId = this.data.SOId;
    this.POItemId = this.data.POItemId;
    this.POId = this.data.POId;
    this.model.ReceivedBy = localStorage.getItem("UserName");
    this.model.ShippedBy = localStorage.getItem("UserName");
    this.MROId = this.data.MROId;
    this.Pending = this.data.Pending;
    const years = Number(this.datePipe.transform(this.Currentdate, "yyyy"));
    const Month = Number(this.datePipe.transform(this.Currentdate, "MM"));
    const Day = Number(this.datePipe.transform(this.Currentdate, "dd"));
    this.model.ReceiveDate = {
      year: years,
      month: Month,
      day: Day,
    };
    this.model.ShipDate = {
      year: years,
      month: Month,
      day: Day,
    };

    this.getAHaddress();
    this.getShipViaList();
    this.getShipFromAddressList();
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
        // console.log(this.model.Address)
      });
  }
  onReceivedateValidation(ReceiveDate) {
    const ReceiveDateYears = ReceiveDate.year;
    const ReceiveDateDates = ReceiveDate.day;
    const ReceiveDatemonths = ReceiveDate.month;
    let receiveDate = new Date(
      ReceiveDateYears,
      ReceiveDatemonths - 1,
      ReceiveDateDates
    );
    let Receivedate = moment(receiveDate).format("YYYY-MM-DD");
    const ShippedDateYears = this.model.ShipDate.year;
    const ShippedDateDates = this.model.ShipDate.day;
    const ShippedDatemonths = this.model.ShipDate.month;
    let ShipDate = new Date(
      ShippedDateYears,
      ShippedDatemonths - 1,
      ShippedDateDates
    );
    let shipDate = moment(ShipDate).format("YYYY-MM-DD");
    if (Receivedate < shipDate) {
      this.ReceiveDateError = true;
    } else {
      this.ReceiveDateError = false;
    }
  }
  onValidatieQty(qty) {
    if (qty > this.Pending) {
      this.qtyError = true;
    } else {
      this.qtyError = false;
    }
  }
  getShipViaList() {
    this.commonService.getHttpService("ShipViaList").subscribe((response) => {
      this.ShipViaList = response.responseData;
    });
  }

  getAHaddress() {
    this.commonService.getHttpService("getAHGroupVendorAddress").subscribe(
      (response) => {
        if (response.status == true) {
          this.AddressList = response.responseData.AHGroupVendorAddress.map(
            function (value) {
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
                AddressId: value.AddressId,
              };
            }
          );
          this.model.AddressId = this.AddressList[0].AddressId;
          // for (var i = 0; i <= this.AddressList.length; i++) {
          //   if (this.AddressList[i].AddressId == this.shippingDetails.ReceiveAddressId) {
          //     this.model.AddressId = this.AddressList[i].AddressId
          //   }

          // }
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  onSubmit(f: NgForm) {
    this.submitted = true;
    const ReceiveDateYears = this.model.ReceiveDate.year;
    const ReceiveDateDates = this.model.ReceiveDate.day;
    const ReceiveDatemonths = this.model.ReceiveDate.month;
    let receiveDate = new Date(
      ReceiveDateYears,
      ReceiveDatemonths - 1,
      ReceiveDateDates
    );
    let ReceiveDate = moment(receiveDate).format("YYYY-MM-DD");

    const ShippedDateYears = this.model.ShipDate.year;
    const ShippedDateDates = this.model.ShipDate.day;
    const ShippedDatemonths = this.model.ShipDate.month;
    let ShipDate = new Date(
      ShippedDateYears,
      ShippedDatemonths - 1,
      ShippedDateDates
    );
    let shipDate = moment(ShipDate).format("YYYY-MM-DD");
    if (f.valid && this.qtyError == false && this.ReceiveDateError == false) {
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
        Quantity: this.model.Quantity,
        ShipFromIdentity: 2,
        ShipFromId: this.VendorId,
        ShipFromName: this.VendorName,
        ShipFromAddressId: this.model.Address,
        ShipViaId: this.model.ShipViaId,
        TrackingNo: this.model.TrackingNo,
        PackWeight: this.model.PackWeight,
        ShippingCost: this.model.ShippingCost,
        ShipDate: shipDate,
        ShippedBy: this.model.ShippedBy,
        ShipComment: this.model.ShipComment,
        ShipToIdentity: 2,
        ShipToId: CONST_AH_Group_ID,
        ShipToName: "Aibond",
        ShipToAddressId: this.model.AddressId,
        ReceivedBy: this.model.ReceivedBy,
        ReceiveDate: ReceiveDate,
        ReceiveComment: this.model.ReceiveComment,
        ShowCustomerReference: ShowCustomerReference,
        ShowRootCause: ShowRootCause,
      };

      this.commonService.postHttpService(postData, "ShipAndReceive").subscribe(
        (response) => {
          if (response.status == true) {
            this.triggerEvent(response.responseData);
            this.modalRef.hide();
            Swal.fire({
              title: "Success!",
              text: "Ship Receive saved Successfully!",
              type: "success",
              confirmButtonClass: "btn btn-confirm mt-2",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Ship Receive could not be saved!",
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
