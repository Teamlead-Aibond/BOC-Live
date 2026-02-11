/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
// Widget data
export interface Widget {
    title: string;
    value: number;
    text: string;
    revenue: string;
}

// Selling Products Table data
export interface Sellingproduct {
    name: string;
    price: string;
    quantity: number;
    amount: string;
    date: string;
    sales: number;
    productid: number;
}

// Chart data
export interface ChartType {
    chart?: any;
    plotOptions?: any;
    colors?: any;
    series?: any;
    stroke?: any;
    fill?: any;
    labels?: any;
    markers?: any;
    legend?: any;
    xaxis?: any;
    yaxis?: any;
    tooltip?: any;
    grid?: any;
    type?: any;
    sparkline?: any;
    dataLabels?: any;
    height?: any;
    option?: any;
    toolbar?: any;
    stacked?: any;
    color?: any;
    width?: any;
    padding?: any;
    fixed?: any;
    marker?: any;
    responsive?: any;
    events?: any;
}
