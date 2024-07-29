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

let chartSignals: Chart

export default defineComponent({
    emits: ["selectLog"],
    components: {
        AccordionBox
    },
    
    
    mounted() {
        const component = this
        const id = "signals"
        const canvas = document.getElementById(id) as HTMLCanvasElement
        chartSignals = new Chart(canvas.getContext('2d')!, {
            data: {
                datasets: [
                    <ChartDatasetCustomTypesPerDataset>{
                        type: "line",
                        data: [],
                        yAxisID: 'ye',
                        label: "Vmx",
                        borderColor: colors['THUBlue'],
                        spanGaps: true,
                        stepped: "before",
                    },        
                    <ChartDatasetCustomTypesPerDataset>{
                        type: "line",
                        data: [],
                        yAxisID: 'ys',
                        label: "kir",
                        borderColor: colors['THUGreen'],
                        spanGaps: true,
                        stepped: "before",
                    },        
                    <ChartDatasetCustomTypesPerDataset>{
                        type: "line",
                        data: [],
                        yAxisID: 'yu',
                        label: "Uid",
                        borderColor: colors['THURed'],
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
                    ye: {
                        title: { display: true, text: "mg/kg/min per pmol/l" },
                        min: 0,
                        ticks: { stepSize: 0.005 },
                        suggestedMax: 0.1,
                    },
                    ys: {
                        title: { display: true, text: "1" },
                        min: 0,
                        ticks: { stepSize: 1 },
                        suggestedMax: 3,
                    },
                    yu: {
                        title: { display: true, text: "mg/kg/min" },
                        min: 0,
                        ticks: { stepSize: 1 },
                        suggestedMax: 6,
                    },
                },
                
            },
        })
    },
    methods: {
        reset() {
            let datasets = chartSignals.data.datasets
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
            const datasets = chartSignals.data.datasets
            
            datasets[0].data.push({ x: t.valueOf(), y: result.y.Vmx??NaN })
            datasets[1].data.push({ x: t.valueOf(), y: result.y.kir??NaN })
            datasets[2].data.push({ x: t.valueOf(), y: result.y.Uid??NaN })
            
            
            
        },
        update() {
            chartSignals.update()
        },
    },
})
</script>


<template>
    <AccordionBox :title="$t('title')" :initial="true">
        <div class="canvas-chart">
            <canvas id="signals" />
        </div>
    </AccordionBox>
</template>


<i18n locale="en">
{
	"title":		"Model Signals Uid",
}
</i18n>
<i18n locale="de">
{
	"title": 		"Modell Signale Uid",
}
</i18n>
