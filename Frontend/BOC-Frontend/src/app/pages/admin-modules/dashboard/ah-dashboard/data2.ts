import { ChartType2 } from './chartist.model3';

const stackBarChart: ChartType2 = {
    data: {
        labels: ['01-Jan', '02-Jan', '03-Jan', '04-Jan', '05-Jan', '06-Jan'],
        series: [
            [800000, 1200000, 700000, 1300000, 1500000, 1000000],
            [200000, 400000, 500000, 300000, 452000, 500000],
            [160000, 290000, 410000, 600000, 588000, 410000],
            [1400000, 290000, 310000, 800000, 588000, 310000],
        ]
    },
    options: {
        stackBars: true,
        axisY: {
            labelInterpolationFnc: (value) => {
                return (value / 100);
            }
        },
        height: 300
    },
    events: {
        draw: (data) => {
            if (data.type === 'bar') {
                data.element.attr({
                    style: 'stroke-width: 30px'
                });
            }
        }
    },
    type: 'Bar'
};

export {stackBarChart};