/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { ChartType } from './widgets.model';

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

const widgetIcon = [
    {
        icon: 'mdi mdi-android-studio',
        color: 'success',
        number: 64570,
        title: 'Today\'s Visits'
    },
    {
        icon: 'mdi mdi-amazon',
        color: 'primary',
        number: 31570,
        title: 'Total Revenue'
    },
    {
        icon: 'mdi mdi-apple',
        color: 'danger',
        number: 280,
        title: 'Today\'s Sales'
    },
    {
        icon: 'mdi mdi-barley',
        color: 'purple',
        number: 16,
        title: 'Conversion'
    },
    {
        icon: 'mdi mdi-black-mesa',
        color: 'info',
        number: 23570,
        title: 'Today\'s Visits'
    },
    {
        icon: 'mdi mdi-bullseye',
        color: 'warning',
        number: 9654,
        title: 'Total Revenue'
    },
    {
        icon: 'mdi mdi-cart',
        color: 'dark',
        number: 965,
        title: 'Today\'s Sales'
    },
    {
        icon: 'mdi mdi-clock',
        color: 'pink',
        number: 65,
        title: 'Conversion'
    },
];

const widgetuser = [
    {
        image: 'assets/images/users/avatar-1.jpg',
        name: 'Chadengle',
        type: 'Admin',
        color: 'warning'
    },
    {
        image: 'assets/images/users/avatar-2.jpg',
        name: 'Tomaslau',
        type: 'User',
        color: 'success'
    },
    {
        image: 'assets/images/users/avatar-3.jpg',
        name: 'Stillnotdavid',
        type: 'Admin',
        color: 'danger'
    },
    {
        image: 'assets/images/users/avatar-4.jpg',
        name: 'Arashasghari',
        type: 'User',
        color: 'info'
    }
];

const widget = [
    {
        icon: 'mdi mdi-coffee',
        iconcolor: 'primary',
        title: 'New User',
        number: 8541,
        text: '39% Up',
        textcolor: 'success'
    },
    {
        icon: 'mdi mdi-contrast-circle',
        iconcolor: 'warning',
        title: 'New Orders',
        number: 6521,
        text: '56% Down',
        textcolor: 'danger'
    },
    {
        icon: 'mdi mdi-crown',
        iconcolor: 'success',
        title: 'Bug Reports',
        number: 1452,
        text: '0%',
        textcolor: 'info'
    },
    {
        icon: 'mdi mdi-download',
        iconcolor: 'pink',
        title: 'Total Downloads',
        number: 562,
        text: '39% Up',
        textcolor: 'success'
    }
];
const getPlotOpts = (background) => {
    return {
        radialBar: {
            track: {
                background
            },
        },
    };
};

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
        data: [0, 23, 43, 35, 44, 45, 56, 37, 40],
    }, {
        data: [25, 23, 26, 24, 25, 32, 30, 24, 19]
    }],
    colors: ['#1abc9c', '#3bafda'],
    height: 200,
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
        show: false,
    },
    tooltip: {
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

const revenueBarChart: ChartType = {
    toolbar: {
        show: false,
    },
    height: 200,
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
        show: false
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
        data: [70, 90, 100, 140, 50, 80, 130, 90, 80, 120, 120, 140],
    },
    {
        data: [40, 50, 150, 80, 90, 120, 80, 70, 50, 130, 100, 110],
    }],
    plotOptions: {
        bar: {
            columnWidth: '60%'
        }
    },
};

const revenuePieChart: ChartType = {
    type: 'pie',
    series: [20, 40, 30, 10],
    option: {
        pie: {
            expandOnClick: false
        }
    },
    height: 230,
    piechartcolor: ['#dcdcdc', '#3bafda', '#333333', '#00b19d'],
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    tooltip: {
        x: {
            labels: false,
            show: false
        },
        y: {
            title: {
                formatter: (seriesName) => {
                    return '';
                }
            }
        },
    },
    grid: {
        show: false,
        padding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
};

const revenueLineChart: ChartType = {
    toolbar: {
        show: false,
    },
    series: [{
        data: [0, 23, 43, 35, 44, 45, 56, 37, 40],
    }, {
        data: [25, 23, 26, 24, 25, 32, 30, 24, 19]
    }],
    colors: ['#3bafda', '#5d9cec'],
    height: 200,
    type: 'line',
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    legend: {
        show: false,
    },
    tooltip: {
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

const revenueLineColumnChart: ChartType = {
    series: [{
        type: 'column',
        data: [3, 6, 7, 8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12]
    }, {
        type: 'line',
        data: [3, 6, 7, 8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12]
    }],
    colors: ['#00b19d', '#fb6d9d'],
    height: 200,
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    legend: {
        show: false,
    },
    tooltip: {
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


/* ------------------- real time updated chart ----------------------------*/
let lastDate = 0;
const data = [];
const TICKINTERVAL = 86400000;
const XAXISRANGE = 777600000;

const getDayWiseTimeSeries = (baseval: number, count: number, yrange: any) => {
    let i = 0;
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        data.push({
            x, y
        });
        lastDate = baseval;
        baseval += TICKINTERVAL;
        i++;
    }
};

const getNewRealTimeSeries = (yrange: any) => {
    // tslint:disable-next-line: prefer-const
    const newDate = lastDate + TICKINTERVAL;
    lastDate = newDate;

    for (let i = 0; i < data.length - 10; i++) {
        // IMPORTANT
        // we reset the x and y of the data which is out of drawing area
        // to prevent memory leaks
        data[i].x = newDate - XAXISRANGE - TICKINTERVAL;
        data[i].y = 0;
    }

    data.push({
        x: newDate,
        y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    });

    return data;
};

// get initial data
getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
    min: 10,
    max: 90
});

const revenueRealTimeChart: ChartType = {
    height: 200,
    type: 'line',
    animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
            speed: 1000
        }
    },
    toolbar: {
        show: false
    },
    zoom: {
        enabled: false
    },
    colors: ['#00b19d'],
    sparkline: {
        enabled: true
    },
    grid: {
        show: false,
        padding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
    },
    tooltip: {
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
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Dynamic Updating Chart',
        align: 'left'
    },
    markers: {
        size: 0
    },
    xaxis: {
        type: 'datetime',
        range: XAXISRANGE,
    },
    yaxis: {
        max: 100
    },
    legend: {
        show: false
    },
    series: [
        {
            name: 'Data',
            data
        }
    ]
};

/* -------------------- chat ----------------------*/
const chatdata = [
    {
        image: 'assets/images/users/avatar-1.jpg',
        name: 'John Deo',
        message: 'Hello!',
        time: '10:00'
    },
    {
        image: 'assets/images/users/avatar-5.jpg',
        name: 'Smith',
        message: 'Hi, How are you? What about our next meeting?',
        time: '10:01'
    },
    {
        image: 'assets/images/users/avatar-1.jpg',
        name: 'John Deo',
        message: 'Yeah everything is fine',
        time: '10:01'
    },
    {
        image: 'assets/images/users/avatar-5.jpg',
        name: 'Smith',
        message: 'Wow that\'s great',
        time: '10:02'
    }
];

/* -------------------- Todo ----------------------*/

const todoData = [
    {
        id: 1,
        text: 'Design One page theme',
        done: false
    },
    {
        id: 2,
        text: 'Build a js based app',
        done: true
    },
    {
        id: 3,
        text: 'Creating component page',
        done: true
    },
    {
        id: 4,
        text: 'Testing??',
        done: true
    },
    {
        id: 5,
        text: 'Hehe!! This is looks cool!',
        done: false
    },
    {
        id: 6,
        text: 'Create new version 3.0',
        done: false
    },
    {
        id: 7,
        text: 'Build an angular app',
        done: true
    }
];

/* -------------------- Inbox ----------------------*/

const inboxData = [
    {
        image: 'assets/images/users/avatar-1.jpg',
        name: 'Chadengle',
        message: 'Hey! there I\'m available...',
        time: '13:40 PM'
    },
    {
        image: 'assets/images/users/avatar-2.jpg',
        name: 'Tomaslau',
        message: 'I\'ve finished it! See you so...',
        time: '13:34 PM'
    },
    {
        image: 'assets/images/users/avatar-3.jpg',
        name: 'Stillnotdavid',
        message: 'This theme is awesome!',
        time: '13:17 PM'
    },
    {
        image: 'assets/images/users/avatar-4.jpg',
        name: 'Kurafire',
        message: 'Nice to meet you',
        time: '12:20 PM'
    },
    {
        image: 'assets/images/users/avatar-5.jpg',
        name: 'Shahedk',
        message: 'Hey! there I\'m available...',
        time: '10:15 AM'
    },
    {
        image: 'assets/images/users/avatar-6.jpg',
        name: 'Adhamdannaway',
        message: 'This theme is awesome!',
        time: '9:56 AM'
    },
    {
        image: 'assets/images/users/avatar-8.jpg',
        name: 'Arashasghari',
        message: 'Hey! there I\'m available...',
        time: '10:15 AM'
    },
    {
        image: 'assets/images/users/avatar-9.jpg',
        name: 'Joshaustin',
        message: 'I\'ve finished it! See you so...',
        time: '9:56 AM'
    }
];

export {
    // tslint:disable-next-line: max-line-length
    cardData, widgetIcon, widgetuser, widget, revenueAreaChart, revenueBarChart, revenuePieChart, customerChart, orderChart, averageChart, revenueChart, revenueLineChart,
    revenueLineColumnChart, revenueRealTimeChart, chatdata, todoData, inboxData, getNewRealTimeSeries
};

