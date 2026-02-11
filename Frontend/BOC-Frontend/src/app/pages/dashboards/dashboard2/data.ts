/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { ChartType } from './sellingproduct.model';
const widgetData = [
    {
        title: 'Income Status',
        value: 31570,
        text: 'Total income: $22506',
        revenue: '10.25%'
    },
    {
        title: 'Sales Status',
        value: 683,
        text: 'Total sales: 2398',
        revenue: '7.85%'
    },
    {
        title: 'Recent Users',
        value: 3.2,
        text: 'Total users: 121 M',
        revenue: '3.64%'
    },
    {
        title: 'Total Revenue',
        value: 68541,
        text: 'Total revenue: $1.2 M',
        revenue: '17.48%'
    }
];

// Revenue Area Chart Data

const generateDayWiseTimeSeries = (baseval, count, yrange) => {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
    }
    return series;
};

const revenueAreaChart: ChartType = {
    series: [{
        name: 'Direct',
        // data: [44, 55, 41, 15, 50, 45, 78, 12, 45]
        data: generateDayWiseTimeSeries(new Date('11 Feb 2019 GMT').getTime(), 20, {
            min: 100,
            max: 1500
        })
    }, {
        name: 'Affilliate',
        // data: [94, 45, 41, 25, 57, 55, 88, 82, 65]
        data: generateDayWiseTimeSeries(new Date('11 Feb 2019 GMT').getTime(), 20, {
            min: 100,
            max: 1000
        })
    }],
    toolbar: {
        show: false
    },
    xaxis: {
        type: 'datetime',
    },
    height: 320,
    stacked: true,
    events: {
        selection: (chart, e) => {
            console.log(new Date(e.xaxis.min));
        }
    },
    colors: ['#3bafda', '#CED4DC'],
    type: 'area',
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.3,
            opacityTo: 0.9,
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'center'
    },
    yaxis: {
        title: {
            text: 'Recent Signups',
            offsetX: -20,
            style: {
                color: undefined,
                fontSize: '13px',
                cssClass: 'apexcharts-yaxis-title',
            },
        },
    }
};

const projectionsDonutChart: ChartType = {
    height: 320,
    type: 'donut',
    series: [44, 55, 41, 15],
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
    },
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4'],
    colors: ['#3bafda', '#26c6da', '#00b19d', '#d1dee4'],
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 210
            },
            legend: {
                show: false
            },
        }
    }],
};

const incomeBarChart: ChartType = {
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
    height: 36,
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

const recentuserAreaChart: ChartType = {
    type: 'area',
    height: 36,
    fill: true,
    series: [{
        name: 'users',
        data: [3, 5, 2, 9, 7, 2, 5, 3, 9, 6, 5, 9, 7]
    }],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 1,
    },
    sparkline: {
        enabled: true,
    },
    tooltip: {
        x: {
            show: false
        }
    },
    toolbar: {
        show: false
    },
    colors: ['#00b19d'],
};

const salesStatusChart: ChartType = {
    type: 'line',
    height: 36,
    series: [{
        name: 'sales',
        data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2]
    }],
    colors: ['rgb(108, 117, 125)'],
    dataLabels: {
        enabled: false
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
    },
    stroke: {
        width: 1
    },
    toolbar: {
        show: false
    },
    sparkline: {
        enabled: true
    },
};

const productData = [
    {
        name: 'ASOS Ridley High Waist',
        price: '$79.49',
        quantity: 82,
        amount: '$6,518.18',
        date: 'Sep 1, 2018',
        sales: 54,
        productid: 200125
    },
    {
        name: 'Marco Lightweight Shirt',
        price: '$128.50',
        quantity: 37,
        amount: '$4,754.50',
        date: 'Sep 15, 2018',
        sales: 28,
        productid: 200130
    },
    {
        name: 'Half Sleeve Shirt',
        price: '$39.99',
        quantity: 64,
        amount: '$2,559.36',
        date: 'Nov 1, 2018',
        sales: 55,
        productid: 200140
    },
    {
        name: 'Lightweight Jacket',
        price: '$20.00',
        quantity: 184,
        amount: '$3,680.00',
        date: 'Nov 15, 2018',
        sales: 85,
        productid: 200250
    },
    {
        name: 'Marco Shoes',
        price: '$28.49',
        quantity: 69,
        amount: '$1,965.81',
        date: 'Jan 1, 2019',
        sales: 49,
        productid: 200256
    },
    {
        name: 'ASOS Ridley High Waist',
        price: '$79.49',
        quantity: 82,
        amount: '$6,518.18',
        date: 'Sep 1, 2018',
        sales: 54,
        productid: 200125
    },
    {
        name: 'Half Sleeve Shirt',
        price: '$39.99',
        quantity: 64,
        amount: '$2,559.36',
        date: 'Nov 1, 2018',
        sales: 55,
        productid: 200140
    },
    {
        name: 'Lightweight Jacket',
        price: '$20.00',
        quantity: 184,
        amount: '$3,680.00',
        date: 'Nov 15, 2018',
        sales: 85,
        productid: 200250
    }
];

export { widgetData, revenueAreaChart, projectionsDonutChart, incomeBarChart, recentuserAreaChart, salesStatusChart, productData };
