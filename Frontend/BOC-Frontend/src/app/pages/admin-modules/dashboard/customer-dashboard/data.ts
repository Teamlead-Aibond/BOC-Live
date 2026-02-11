import { ChartType } from './default.model';

const getPlotOpts = (background) => {
    return {
        radialBar: {
            track: {
                background
            },
        },
    };
};

const cardData = [
    {
        color: 'success',
        value: 2562,
        title: 'Total Sales today'
    },
    {
        color: 'primary',
        value: 5685,
        title: 'Daily visitors'
    },
    {
        color: 'pink',
        value: 12480,
        title: 'Total Earning'
    },
    {
        color: 'purple',
        value: 62,
        title: 'Pending Orders'
    }
];

const widgetChartOpts: ChartType = {
    type: 'line',
    width: 140,
    height: 54,
    sparkline: {
        enabled: true
    }
};

const widgetChartGrid: ChartType = {
    padding: {
        top: 10
    }
};

const widgetTooltip: ChartType = {
    fixed: {
        enabled: false
    },
    x: {
        show: false
    },
    y: {
        title: {
            formatter: (seriesName) => {
                return '';
            }
        }
    },
    marker: {
        show: false
    }
};

const widgetStroke: ChartType = {
    show: true,
    curve: 'smooth',
    width: 3
};

const customerChart: ChartType = {
    series: [{
        data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
    }],
    color: ['rgb(26,188,156)'],
    chart: widgetChartOpts,
    plotOptions: getPlotOpts('rgba(26,188,156, 0.2)'),
    tooltip: widgetTooltip,
    stroke: widgetStroke,
    grid: widgetChartGrid
};

const orderChart: ChartType = {
    series: [{
        data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
    }],
    color: ['rgb(59, 175, 218)'],
    chart: widgetChartOpts,
    plotOptions: getPlotOpts('rgba(59, 175, 218, 0.4)'),
    tooltip: widgetTooltip,
    stroke: widgetStroke,
    grid: widgetChartGrid
};

const revenueChart: ChartType = {
    series: [{
        data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
    }],
    color: ['rgb(246,113,167)'],
    chart: widgetChartOpts,
    plotOptions: getPlotOpts('rgba(246,113,167, 0.4)'),
    tooltip: widgetTooltip,
    stroke: widgetStroke,
    grid: widgetChartGrid
};

const averageChart: ChartType = {
    series: [{
        data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
    }],
    color: ['rgb(108,116,125)'],
    chart: widgetChartOpts,
    plotOptions: getPlotOpts('rgba(108,116,125, 0.4)'),
    tooltip: widgetTooltip,
    stroke: widgetStroke,
    grid: widgetChartGrid
};

const revenueAreaChart: ChartType = {
    toolbar: {
        show: false,
    },
    series: [{
        name: 'Desktop',
        data: [0, 23, 43, 35, 44, 45, 56, 37, 40],
    }, {
        name: 'Laptop',
        data: [25, 23, 26, 24, 25, 32, 30, 24, 19]
    }],
    colors: ['#1abc9c', '#3bafda'],
    height: 250,
    type: 'area',
    stroke: {
        curve: 'straight',
        width: 1,
    },
    dataLabels: {
        enabled: false
    },
    sparkline: {
        enabled: true
    },
    grid: {
        show: false,
        padding: {
            top: 40,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    legend: {
        show: true,
        position: 'top',
        floating: true
    },
    tooltip: {
        x: {
            show: false
        },
        y: {
            title: {
                text: undefined,
            }
        },
        marker: {
            show: false
        }
    },
    xaxis: {
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        },
        lines: {
            show: false,
        }
    }
};

const yearlySalesBarChart: ChartType = {
    toolbar: {
        show: false,
    },
    height: 250,
    type: 'bar',
    stacked: true,
    color: ['rgb(59, 175, 218)', 'rgb(227, 234, 239)'],
    dataLabels: {
        enabled: false
    },
    sparkline: {
        enabled: true,
    },
    grid: {
        show: false,
        padding: {
            top: 40,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    legend: {
        show: true,
        position: 'top',
        floating: true
    },
    tooltip: {
        x: {
            show: false
        }
    },
    stroke: {
        show: true,
        width: 4,   // thickness of the lines
    },
    series: [{
        name: 'Revenue',
        data: [70, 90, 100, 140, 50, 80, 130, 90, 80, 120, 120, 140],
    },
    {
        name: 'Number of Sales',
        data: [40, 50, 150, 80, 90, 120, 80, 70, 50, 130, 100, 110],
    }],
    plotOptions: {
        bar: {
            columnWidth: '60%'
        }
    },
};

const weeklySalesPieChart: ChartType = {
    type: 'pie',
    series: [20, 40, 30],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 230,
    labels: ['Direct', 'Affilliate', 'Sponsored'],
    piechartcolor: ['#6c757d', '#3bafda', '#00b19d'],
    dataLabels: {
        enabled: false
    },
    legend: {
        show: true,
        position: 'top',
        floating: true
    },
    tooltip: {
        x: {
            show: false
        }
    },
    grid: {
        show: false,
        padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
};

const earningReportBarChart: ChartType = {
    type: 'bar',
    tooltip: {
        enabled: false
    },
    sparkline: {
        enabled: true,
    },
    dataLabels: {
        enabled: false
    },
    colors: ['rgb(59, 175, 218)', 'rgb(227, 234, 239)'],
    height: 100,
    plotOptions: {
        bar: {
            columnWidth: '80%',
            distributed: true
        }
    },
    series: [
        {
            name: 'Weekly Earning',
            data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2, 9, 7, 2, 1, 3, 5, 2, 9, 7, 2, 5, 3, 9, 6, 5, 9, 7]
        }
    ]
};

const tableData = [
    {
        marketplaces: 'Themes Market',
        date: 'Oct 15, 2018',
        taxhold: '$125.23',
        payout: '$5848.68',
        status: 'Upcoming'
    },
    {
        marketplaces: 'Freelance',
        date: 'Oct 12, 2018',
        taxhold: '$78.03',
        payout: '$5848.68',
        status: 'Paid'
    },
    {
        marketplaces: 'Share Holding',
        date: 'Oct 10, 2018',
        taxhold: '$358.24',
        payout: '$815.89',
        status: 'Paid'
    },
    {
        marketplaces: 'Envato\'s Affiliates',
        date: 'Oct 03, 2018',
        taxhold: '$18.78',
        payout: '$248.75',
        status: 'Overdue'
    },
    {
        marketplaces: 'Marketing Revenue',
        date: 'Sep 21, 2018',
        taxhold: '$185.36',
        payout: '$978.21',
        status: 'Upcoming'
    },
    {
        marketplaces: 'Advertise Revenue',
        date: 'Sep 15, 2018',
        taxhold: '$29.56',
        payout: '$358.10',
        status: 'Paid'
    },
];

export {
    customerChart, orderChart, revenueChart, averageChart, revenueAreaChart, yearlySalesBarChart,
    weeklySalesPieChart, earningReportBarChart, tableData, cardData
};
