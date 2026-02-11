/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { Component, OnInit } from "@angular/core";

import { Sellingproduct, Widget, ChartType } from "./sellingproduct.model";

import {
  widgetData,
  revenueAreaChart,
  projectionsDonutChart,
  incomeBarChart,
  recentuserAreaChart,
  salesStatusChart,
  productData,
} from "./data";

@Component({
  selector: "app-dashboard2",
  templateUrl: "./dashboard2.component.html",
  styleUrls: ["./dashboard2.component.scss"],
})

/**
 * Dashboard-2 component - handling the dashboard-2 with navbar and content
 */
export class Dashboard2Component implements OnInit {
  // Charts data
  revenueAreaChart: ChartType;
  projectionsDonutChart: ChartType;
  incomeBarChart: ChartType;
  recentuserAreaChart: ChartType;
  salesStatusChart: ChartType;
  breadCrumbItems: Array<{}>;

  widgetData: Widget[];
  // Product data
  productData: Sellingproduct[];

  constructor() {}

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Dashboard", path: "/" },
      { label: "Dashboard 2", path: "/", active: true },
    ];

    /**
     * Fetches data
     */
    this._fetchData();
  }

  /**
   * fetches the dashboard-2 chart data
   */
  private _fetchData() {
    // widget Data
    this.widgetData = widgetData;

    // Revenue Area chart
    this.revenueAreaChart = revenueAreaChart;

    // Projections Donut Chart
    this.projectionsDonutChart = projectionsDonutChart;

    // Income Status Bar chart
    this.incomeBarChart = incomeBarChart;

    // Recent Users area chart
    this.recentuserAreaChart = recentuserAreaChart;

    // Sales Status chart
    this.salesStatusChart = salesStatusChart;

    // table Data
    this.productData = productData;
  }

  /**
   * on table data refresh
   */
  onTableContentRefresh() {
    console.log("table data refresh requested");
  }
}
