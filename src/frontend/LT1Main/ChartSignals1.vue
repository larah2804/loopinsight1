<script lang="ts">
/** 
 * This file is part of LoopInsighT1, an open source tool to
 * simulate closed-loop glycemic control in type 1 diabetes.
 * Distributed under the MIT software license.
 * See https://lt1.org for further information.
 */

import 'chartjs-adapter-luxon'
import { defineComponent, toRaw } from 'vue'
import Chart from 'chart.js/auto'
import { ChartDatasetCustomTypesPerDataset } from 'chart.js'
import colors from '../util/Colors.js'
import { SimulationResult } from '../../types/SimulationResult.js'
import AccordionBox from './AccordionBox.vue'
import { ControllerInternals } from '../../types/Controller.js'

let chartSignals1: Chart

export default defineComponent({
    emits: ["selectLog"],
    components: {
        AccordionBox
    },
    
    
    mounted() {
        const component = this
        const id = "signals1"
        const canvas = document.getElementById(id) as HTMLCanvasElement
        chartSignals1 = new Chart(canvas.getContext('2d')!, {
            data: {
                datasets: [
                    <ChartDatasetCustomTypesPerDataset>{
                        type: "line",
                        data: [],
                        yAxisID: 'y',
                        label: "EGP",
                        borderColor: colors['THURed'],
                        spanGaps: true,
                        stepped: "before",
                    },    
                    <ChartDatasetCustomTypesPerDataset>{
                        type: "line",
                        data: [],
                        yAxisID: 'yx',
                        label: "kp1",
                        borderColor: colors['THUGreen'],
                        spanGaps: true,
                        stepped: "before",
                    },  
                    <ChartDatasetCustomTypesPerDataset>{
                        type: "line",
                        data: [],
                        yAxisID: 'yk',
                        label: "kp3",
                        borderColor: colors['THUBlue'],
                        spanGaps: true,
                        stepped: "before",
                    },                                                 
                ]
            },
            options: {
                layout: {
                    padding: { right: 20 },
                },
                scales: {
                    x: {
                        type: "time",   
                        offset: false,
                        time: {
                            displayFormats: {
                                hour: 'HH:mm'
                            }
                        },
                    },
                    y: {
                        title: { display: true, text: "mg/kg/min" },
                        min: 0,
                        ticks: { stepSize: 1 },
                        suggestedMax: 4,
                    },
                    yx: {
                        title: { display: true, text: "mg/kg/min" },
                        min: 0,
                        ticks: { stepSize: 1 },
                        suggestedMax: 4,
                    },
                    yk: {
                        title: { display: true, text: "mg/kg/min per pmol/l" },
                        min: 0,
                        ticks: { stepSize: 0.001 },
                        suggestedMax: 0.05,
                    },
                },
                
            },
        })
    },
    methods: {
        reset() {
            let datasets = chartSignals1.data.datasets
            for (let i = 0; i < datasets.length; i++) {
                datasets[i].data = []
            }
            
        },
        setSimulationResults(results: SimulationResult[]) {
            for (const result of results) {
                this._pushRecord(result)
            }
            this.update()
        },
        _pushRecord(result: SimulationResult) {
            const t = result.t
            const datasets = chartSignals1.data.datasets
            
            datasets[0].data.push({ x: t.valueOf(), y: result.y.EGP??NaN })
            datasets[1].data.push({ x: t.valueOf(), y: result.y.kp1??NaN })
            datasets[2].data.push({ x: t.valueOf(), y: result.y.kp3??NaN })
            
            
        },
        update() {
            chartSignals1.update()
        },
    },
})
</script>


<template>
    <AccordionBox :title="$t('title')" :initial="true">
        <div class="canvas-chart">
            <canvas id="signals1" />
        </div>
    </AccordionBox>
</template>


<i18n locale="en">
{
	"title":		"Model Signals EPG",
}
</i18n>
<i18n locale="de">
{
	"title": 		"Modell Signale EPG",
}
</i18n>
