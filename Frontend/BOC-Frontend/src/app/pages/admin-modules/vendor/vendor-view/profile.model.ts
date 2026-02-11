export interface Project {
    id: number;
    name: string;
    startdate: string;
    duedate: string;
    status: string;
    client: string;
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