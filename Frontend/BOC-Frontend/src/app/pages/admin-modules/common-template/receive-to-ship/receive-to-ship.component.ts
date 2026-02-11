import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder, NgForm } from "@angular/forms";
import { CommonService } from "src/app/core/services/common.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import {
  CONST_AH_Group_ID,
  Const_Alert_pop_message,
  Const_Alert_pop_title,
  CONST_ShipAddressType,
} from "src/assets/data/dropdown";
import SignaturePad from "signature_pad";

@Component({
  selector: "app-receive-to-ship",
  templateUrl: "./receive-to-ship.component.html",
  styleUrls: ["./receive-to-ship.component.scss"],
})
export class ReceiveToShipComponent implements OnInit, AfterViewInit {
  RRShippingHistory;
  RRId;
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
  public event: EventEmitter<any> = new EventEmitter();
  ShippingStatus;
  showReceive: boolean = false;
  signaturePad: SignaturePad;
  @ViewChild("canvas", { static: false }) canvasEl: ElementRef;
  signatureImg: string;
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any
  ) {}

  ngOnInit(): void {
    this.RRShippingHistory = this.data.RRShippingHistory;
    this.CustomerId = this.data.CustomerId;
    this.shippingDetails =
      this.RRShippingHistory[this.RRShippingHistory.length - 1];
    this.model.ReceivedBy = localStorage.getItem("UserName");
    this.Status = this.data.Status;
    this.ShippingStatus = this.data.ShippingStatus;
    this.ShipToIdentityName = this.shippingDetails.ShipToIdentityName;
    this.ShipFromAddressId = this.shippingDetails.ShipFromAddressId;
    var CustomerShipIdLocked = this.data.CustomerShipIdLocked;
    var VendorShipIdLocked = this.data.VendorShipIdLocked;
    if (this.ShipToIdentityName == "Vendor") {
      this.ReceiveIdentityType = 2;
      if (this.shippingDetails.ShipToId == CONST_AH_Group_ID) {
        this.To = "Aibond";
      } else {
        this.showReceive = VendorShipIdLocked > 0 ? true : false;
        this.To = "Vendor";
      }
    } else {
      this.showReceive = CustomerShipIdLocked > 0 ? true : false;
      this.ReceiveIdentityType = 1;
      this.To = "Customer";
    }
    if (this.shippingDetails.ShipFromIdentityName == "Vendor") {
      this.ShippingIdentityType = 2;
      if (this.shippingDetails.ShipFromId == CONST_AH_Group_ID) {
        this.From = "Aibond";
      } else {
        this.From = "Vendor";
      }
    } else {
      this.ShippingIdentityType = 1;
      this.From = "Customer";
    }
    this.RRId = this.data.RRId;

    const years = Number(this.datePipe.transform(this.Currentdate, "yyyy"));
    const Month = Number(this.datePipe.transform(this.Currentdate, "MM"));
    const Day = Number(this.datePipe.transform(this.Currentdate, "dd"));
    this.model.ReceiveDate = {
      year: years,
      month: Month,
      day: Day,
    };

    this.model.PickedUpDate = {
      year: years,
      month: Month,
      day: Day,
    };

    // this.getAddressList();
    if (this.shippingDetails.ShipToId == CONST_AH_Group_ID) {
      this.getAHaddress();
    } else if (this.ReceiveIdentityType == 1) {
      this.getAddressList();
    } else if (this.ReceiveIdentityType == 2) {
      this.getVendorAddressList();
    }
  }
  getVendorAddressList() {
    var postData = {
      IdentityId: this.shippingDetails.ShipToId,
      IdentityType: this.ReceiveIdentityType,
      Type: 0,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData.map(function (value) {
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
        });

        var obj = this;
        var ShippingAddress = response.responseData.map(function (value) {
          if (value.AddressId == obj.shippingDetails.ReceiveAddressId) {
            return (obj.model.AddressId = value.AddressId);
          }
        });
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
          //this.model.AddressId =this.AddressList[0].AddressId
          for (var i = 0; i <= this.AddressList.length; i++) {
            if (
              this.AddressList[i].AddressId ==
              this.shippingDetails.ReceiveAddressId
            ) {
              this.model.AddressId = this.AddressList[i].AddressId;
            }
          }
        } else {
        }
        this.cd_ref.detectChanges();
      },
      (error) => console.log(error)
    );
  }

  getAddressList() {
    var postData = {
      IdentityId: this.shippingDetails.ShipToId,
      IdentityType: this.ReceiveIdentityType,
      Type: CONST_ShipAddressType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData.map(function (value) {
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
        });

        var ShippingAddress = response.responseData.map(function (value) {
          if (value.IsShippingAddress == 1) {
            return value.AddressId;
          }
        });
        this.model.AddressId = ShippingAddress[0];
      });
  }
  getAddressFromList() {
    var postData = {
      IdentityId: this.shippingDetails.ShipFromId,
      IdentityType: this.ShippingIdentityType,
      Type: CONST_ShipAddressType,
    };
    this.commonService
      .postHttpService(postData, "getAddressList")
      .subscribe((response) => {
        this.AddressList = response.responseData.map(function (value) {
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
        });

        var Obj = this;

        var ShippingAddress = this.AddressList.map(function (value) {
          if (value.AddressId == Obj.ShipFromAddressId) {
            return value.title;
          }
        });
        this.AddressData = ShippingAddress[0];
      });
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
    if (f.valid) {
      this.btnDisabled = true;
      if (this.model.ShowCustomerReference == true) {
        var ShowCustomerReference = 1;
      } else {
        ShowCustomerReference = 0;
      }
      var postData = {
        RRId: this.RRId,
        ShippingHistoryId: this.shippingDetails.ShippingHistoryId,
        ReceiveAddressId: this.model.AddressId,
        ReceivedBy: this.model.ReceivedBy,
        ReceiveDate: ReceiveDate,
        ReceiveComment: this.model.ReceiveComment,
        ShipToIdentity: this.ReceiveIdentityType,
        ShipToId: this.shippingDetails.ShipToId,
        ShipToName: this.shippingDetails.ShipToName,
        ShowCustomerReference: ShowCustomerReference,
      };

      this.commonService.putHttpService(postData, "RRreceive").subscribe(
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

    //  if(this.Status==5 && this.shippingDetails.ShipToId == this.CustomerId ){
    //   var postdata = {
    //     RRId: this.RRId,

    //   }
    //   this.commonService.postHttpService(postdata, 'RRComplete').subscribe(response => {
    //     if (response.status == true) {
    //       Swal.fire({
    //         title: 'Completed!',
    //         text: 'Repair Request has been completed.',
    //         type: 'success'
    //       });
    //     }
    //   });
    // }
  }

  triggerEvent(item: string) {
    this.event.emit({ data: item, res: 200 });
  }

  onPartsPickup() {
    this.savePad();
    Swal.fire({
      title:
        "Are you sure, You want to change the status from Ready for Pick up to Picked up by Vendor / Customer?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonClass: "btn btn-success mt-2",
      cancelButtonClass: "btn btn-danger ml-2 mt-2",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        var PickUpItem = [
          {
            RRId: this.RRId,
            ShippingHistoryId: this.shippingDetails.ShippingHistoryId,
          },
        ];
        const reqYears = this.model.PickedUpDate.year;
        const reqDates = this.model.PickedUpDate.day;
        const reqmonths = this.model.PickedUpDate.month;
        let requestDates = new Date(reqYears, reqmonths - 1, reqDates);
        let CreatedDate = moment(requestDates).format("YYYY-MM-DD");
        var postData = {
          PickedUpBy: this.model.PickedUpBy,
          PickedUpDate: CreatedDate,
          PickUPSignature: this.model.Signature,
          PickUpItem: PickUpItem,
        };
        this.commonService
          .postHttpService(postData, "UpdateReadyForPickUpToPickUp")
          .subscribe((response) => {
            if (response.status == true) {
              Swal.fire({
                title: "Parts Picked Up",
                text: "Parts Picked Up Sucessfully",
                type: "success",
              });
              this.triggerEvent(response.responseData);
              this.modalRef.hide();
            }
          });
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: "Cancelled",
          text: "No Change:)",
          type: "error",
        });
      }
    });
  }

  ngAfterViewInit() {
    if (this.ShippingStatus == 3 && this.shippingDetails.IsPickUp == 1) {
      this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
    }
  }

  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    console.log("Savepad = " + this.signatureImg);
    this.model.Signature = base64Data;
  }
}
