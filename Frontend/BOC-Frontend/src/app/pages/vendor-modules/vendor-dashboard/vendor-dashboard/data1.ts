/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { IChartistResponsiveOptions, IChartistData, IChartistOptions } from 'ngx-chartist';
import { ChartType1 } from './chartist.model';

const simpleLineChart: ChartType1 = {
    data: {
        //labels: ['Sourced', 'Quoted', 'Approved', 'Completed'],
        series: [
            [5, 16, 9, 20, 25],
            [2, 15, 7, 25, 30],
            [7, 18, 12, 23, 28],
            [8, 13, 18, 22, 22],
        ]
    },
    type: 'Line',
    options: {
        height:380,
        fullWidth: true,
        chartPadding: {
            right:15,
            bottom:0
        }
    }
};

export {
    simpleLineChart
};
