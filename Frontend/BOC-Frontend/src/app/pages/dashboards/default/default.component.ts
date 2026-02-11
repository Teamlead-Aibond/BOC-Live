/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
import { Component, ElementRef, OnInit } from "@angular/core";
import {
  averageChart,
  customerChart,
  orderChart,
  revenueAreaChart,
  revenueChart,
  yearlySalesBarChart,
  weeklySalesPieChart,
  earningReportBarChart,
  tableData,
} from "./data";

import { RevenueData, ChartType } from "./default.model";

@Component({
  selector: "app-default-dashboard",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})

/**
 * Dashboard-1 component - handling the dashboard-1 with navbar and content
 */
export class DefaultDashboardComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  // Widget Charts
  customerChart: ChartType;
  orderChart: ChartType;
  widgetChart: ChartType;
  revenueChart: ChartType;

  // Charts
  averageChart: ChartType;
  revenueAreaChart: ChartType;
  yearlySalesBarChart: ChartType;
  weeklySalesPieChart: ChartType;
  earningReportBarChart: ChartType;

  // Revenue History Table data
  tabledata: RevenueData[];

  constructor(private eref: ElementRef) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Aibond", path: "/" },
      { label: "Dashboard", path: "/", active: true },
    ];

    /**
     * fetches data
     */
    this._fetchData();
  }

  private _fetchData() {
    // Widget charts data
    this.customerChart = customerChart;
    this.averageChart = averageChart;
    this.orderChart = orderChart;
    this.revenueChart = revenueChart;

    // Revenue Area chart
    this.revenueAreaChart = revenueAreaChart;

    // Yearly sales report bar chart
    this.yearlySalesBarChart = yearlySalesBarChart;

    // weekly sales Report pie chart
    this.weeklySalesPieChart = weeklySalesPieChart;

    // Earning report bar chart
    this.earningReportBarChart = earningReportBarChart;

    // table
    this.tabledata = tableData;
  }
}
