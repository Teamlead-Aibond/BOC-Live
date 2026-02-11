import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CommonService } from "src/app/core/services/common.service";
import { CONST_AH_Group_ID } from "src/assets/data/dropdown";

@Component({
  selector: "app-part-current-location-history",
  templateUrl: "./part-current-location-history.component.html",
  styleUrls: ["./part-current-location-history.component.scss"],
})
export class PartCurrentLocationHistoryComponent implements OnInit {
  RRShippingHistory: any = [];
  FromIdentityName;
  ToIdentityName;
  ShippingStatus;
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cd_ref: ChangeDetectorRef,
    private commonService: CommonService,
    @Inject(BsModalRef) public data: any
  ) {}

  ngOnInit(): void {
    this.RRShippingHistory = this.data.History;
    this.ShippingStatus = this.data.ShippingStatus;
    for (var i = 0; i < this.RRShippingHistory.length; i++) {
      if (
        this.RRShippingHistory[i].ShipFromIdentityName == "Vendor" &&
        this.RRShippingHistory[i].ShipFromId != CONST_AH_Group_ID
      ) {
        this.RRShippingHistory[i].FromIdentityName = "Vendor";
      } else if (
        this.RRShippingHistory[i].ShipFromIdentityName == "Vendor" &&
        this.RRShippingHistory[i].ShipFromId == CONST_AH_Group_ID
      ) {
        this.RRShippingHistory[i].FromIdentityName = "Aibond";
      } else if (this.RRShippingHistory[i].ShipFromIdentityName == "Customer") {
        this.RRShippingHistory[i].FromIdentityName = "Customer";
      }

      if (
        this.RRShippingHistory[i].ShipToIdentityName == "Vendor" &&
        this.RRShippingHistory[i].ShipToId != CONST_AH_Group_ID
      ) {
        this.RRShippingHistory[i].ToIdentityName = "Vendor";
      } else if (
        this.RRShippingHistory[i].ShipToIdentityName == "Vendor" &&
        this.RRShippingHistory[i].ShipToId == CONST_AH_Group_ID
      ) {
        this.RRShippingHistory[i].ToIdentityName = "Aibond";
      } else if (this.RRShippingHistory[i].ShipToIdentityName == "Customer") {
        this.RRShippingHistory[i].ToIdentityName = "Customer";
      }

      // To set two dates to two variables
      var date1 = new Date(this.RRShippingHistory[i].ShipDate);
      var date2 = new Date(this.RRShippingHistory[i].ReceiveDate);

      // To calculate the time difference of two dates
      var Difference_In_Time = date2.getTime() - date1.getTime();

      // To calculate the no. of days between two dates
      this.RRShippingHistory[i].Difference_In_Days =
        Difference_In_Time / (1000 * 3600 * 24);
    }
  }
}
