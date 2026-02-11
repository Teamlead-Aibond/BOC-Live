/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { Component, OnInit } from "@angular/core";

import { Lightbox } from "ngx-lightbox";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  carddata: Array<{}>;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Settings", path: "/", active: true },
    ];

    this.carddata = [
      {
        title: true,
        image: "assets/images/small/img-2.jpg",
        list: ["Cras justo odio", "Dapibus ac facilisis in"],
        link: ["Card link", "Another link"],
      },
    ];
  }

  openModal(content: string) {
    this.modalService.open(content);
  }

  largeModal(largeDataModal: string) {
    this.modalService.open(largeDataModal, { size: "lg" });
  }

  centerModal(centerDataModal: string) {
    this.modalService.open(centerDataModal, { centered: true });
  }
}
