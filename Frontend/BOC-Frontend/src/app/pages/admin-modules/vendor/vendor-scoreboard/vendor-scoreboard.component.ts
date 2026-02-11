/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-vendor-scoreboard",
  templateUrl: "./vendor-scoreboard.component.html",
  styleUrls: ["./vendor-scoreboard.component.scss"],
})
export class VendorScoreboardComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  ProfilePhoto: string;
  data: any = [];
  basicData: any = [];

  constructor() {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Vendors", path: "/" },
      { label: "View", path: "/" },
      { label: "Vendor Scorecard", path: "/", active: true },
    ];

    // Set the profile photo
    this.ProfilePhoto = "assets/images/icons/Vendor.png";
  }
}
