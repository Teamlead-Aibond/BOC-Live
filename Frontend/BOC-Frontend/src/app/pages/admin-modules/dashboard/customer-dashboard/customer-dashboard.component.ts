import { Component, ElementRef, OnInit, OnDestroy } from "@angular/core";
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
  cardData,
} from "./data";
//import { Cards, Widgets, WidgetUser, WidgetIcon, Chat, Todo, Inbox } from './widgets.model';

import { RevenueData, ChartType } from "./default.model";

@Component({
  selector: "app-customer-dashboard",
  templateUrl: "./customer-dashboard.component.html",
  styleUrls: ["./customer-dashboard.component.scss"],
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  time = new Date();
  timer;

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
      { label: "Dashboard 2", path: "/", active: true },
    ];

    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);

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

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
