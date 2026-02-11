import { Component, OnInit } from "@angular/core";
import { NgxNavigationWithDataComponent } from "ngx-navigation-with-data";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  tab;
  constructor(public navCtrl: NgxNavigationWithDataComponent) {}

  ngOnInit(): void {
    document.title = "Reports";
  }
  openTab(tabId): void {
    this.navCtrl.navigate("/admin/reports/RR", { tabId: tabId });

    //this.tab = tabId;
  }
}
