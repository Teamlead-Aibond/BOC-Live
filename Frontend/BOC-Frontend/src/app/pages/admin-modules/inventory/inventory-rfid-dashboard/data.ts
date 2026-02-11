import { ChartType } from './apex.model';

const linewithDataChart: ChartType = {
    chart: {
        height: 380,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        }
    },
    colors: ['#f58091', '#69daec', '#f9ca78'],
    dataLabels: {
        enabled: true,
    },
    stroke: {
        width: [3, 3, 3],
        curve: 'smooth'
    },
    series: [{
        name: 'Stock In - 34',
        data: [22, 24, 25, 26, 27, 28, 30]
    },
    {
        name: 'Stock Out - 24',
        data: [14, 12, 16, 20, 12, 16, 14]
    },
    {
        name: 'Ready for Shipping - 3',
        data: [5, 7, 10, 8, 7, 5, 10]
    }
    ],
    title: {
        text: '.',
        align: 'left',
        style: {
            fontSize: '14px',
            color: '#333'
        }
    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    markers: {
        style: 'inverted',
        size: 6
    },
    xaxis: {
        categories: ['Jan 01', 'Jan 02', 'Jan 03', 'Jan 04', 'Jan 05', 'Jan 06', 'Jan 07'],
    },
    yaxis: {
        title: {
            text: ''
        },
        min: 5,
        max: 31
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            legend: {
                show: false
            },
        }
    }]
};




export {linewithDataChart};
