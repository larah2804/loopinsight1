<script lang="ts">
/** 
 * This file is part of LoopInsighT1, an open source tool to
 * simulate closed-loop glycemic control in type 1 diabetes.
 * Distributed under the MIT software license.
 * See https://lt1.org for further information.
 */

import { defineComponent } from 'vue'
import Patient from '../../types/Patient.js'
import { ModuleImportList, ModuleProfileList } from '../../types/ModuleProfile.js'
import { ParameterFileContents } from '../../types/ParameterFileContents.js'
import AccordionBox from './AccordionBox.vue'
import ModuleConfig from './ModuleConfig.vue'
import UvaPadova_T1DMS from '../../core/models/UvaPadova_T1DMS.js'

/** list of physiological models, provided by bundler */
declare var __LT1_LOCAL_MODELS__: ModuleProfileList

interface Datum {
    parameter1: string;
    parameter2: string;
}

// Typdefinition für das Array von Datum-Objekten
const daten: Datum[] = [
    { parameter1: '', parameter2: '' }
];

export function generateTableDataJSON(daten: Datum[]): string {
    return JSON.stringify(daten);
}

export default defineComponent({
    emits: ["patientChanged", "profileUpdated", "datasaved"],

    components: {
        AccordionBox,
        ModuleConfig
    },

    data() {
        return {
            modelImports: {} as ModuleImportList,
            daten: [{ parameter1: '', parameter2: '' }],
        }
    },

    computed: {
        modelInfo: function () { return __LT1_LOCAL_MODELS__ },
    },

    created() {
        // import module dynamically
        for (const id in this.modelInfo) {
            this.modelImports[id] = () => import(
                /* webpackChunkName: "models_[request]" */
                /* webpackMode: "lazy" */
                `../../core/models/${id}.ts`
            )
        }
    },

    methods: {

        getPatient(): Patient {
            const moduleConfig = <InstanceType<typeof ModuleConfig>>
                this.$refs.moduleConfig
            return <Patient>moduleConfig.getModule()
        },

        loadFile(filename: Blob) {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.addEventListener('load', (event) => {
                    if (!event.isTrusted) {
                        console.warn("file not trusted")
                        return
                    }
                    if (typeof event.target?.result === "undefined") {
                        console.warn("error reading file")
                        return
                    }
                    const result = <string>event.target.result
                    const content = JSON.parse(decodeURIComponent(result))
                    resolve(content)
                })
                reader.readAsText(filename)
            })
        },

        /** import model from uploaded JSON file */
        async loadPatient(event: Event) {
            if (typeof event?.target === "undefined") {
                return
            }
            const target = event.target as HTMLInputElement
            if (!Array.isArray(target.files)) {
                return
            }
            const file = target.files[0]
            const content = <ParameterFileContents>await this.loadFile(file)

            const moduleConfig = <InstanceType<typeof ModuleConfig>>
                this.$refs.moduleConfig
            moduleConfig.loadFromFile(content)

        },

        /** save virtual patient as JSON file */
        savePatient() {
            const moduleConfig = <InstanceType<typeof ModuleConfig>>
                this.$refs.moduleConfig
            const content = moduleConfig.getParameterFile()

            const now = new Date(Date.now())
            const nowString = now.toISOString().split(".")[0].replaceAll("-", "")
                .replaceAll("T", "_").replaceAll(":", "").replaceAll(".", "")
            const filename = 'LT1_Patient_' + content.model + '_' + nowString + '.json'

            const encodedContent = 'data:text/plain;charset=utf-8,'
                + encodeURIComponent(JSON.stringify(content))
            const element = document.getElementById('savepatientdownload')!
            element.setAttribute('href', encodedContent)
            element.setAttribute('download', filename)
            element.click()

            return generateTableDataJSON(this.daten);
        },

        valueChanged() {
            this.$emit('profileUpdated', this.daten)
        },
        zeileHinzufuegen() {
            this.daten.push({ parameter1: '', parameter2: '' });
        },
        zeileEntfernen(index: number) {
            if (index > -1 && index < this.daten.length) {
                this.daten.splice(index, 1);
            }
        },
        saveTableData() {
            const now = new Date(Date.now());
            const nowString = now.toISOString().split(".")[0].replaceAll("-", "")
                .replaceAll("T", "_").replaceAll(":", "").replaceAll(".", "");
            const filename = `TableData_${nowString}.json`;

            const encodedContent = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.daten));
            const element = document.createElement('a');
            element.setAttribute('href', encodedContent);
            element.setAttribute('download', filename);
            element.click();
        },
        exportTableData() {
            return JSON.stringify(this.daten);
        },
        saveData() {
            this.$emit('datasaved', this.daten)
        },
        //updateKlassifizierung() {
            //const updatedData = this.daten.map(row => ({ parameter1: parseFloat(row.parameter1), parameter2: parseFloat(row.parameter2) }));
            //Klasse(updatedData);

        //}
    },
})
</script>

<template>
    <AccordionBox :title="$t('Test')">
        <p style="text-align:center;">
        <div>
            <table border="0">
                <thead>
                    <tr>
                        <th><button @click="zeileHinzufuegen">Zeile hinzufügen</button> </th>
                        <th><button @click="zeileEntfernen(1)">Zeile entfernen</button> </th>
                    </tr>
                </thead>
            </table>
            <table>
                <tr>
                    <th><button @click="valueChanged">Update Klassifizierung</button></th>
                    <th><button @click="saveData">Daten senden</button></th>
                </tr>
            </table>
            <table border="1">
                <thead>
                    <tr>
                        <th>Uhrzeit</th>
                        <th>Wert</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in daten" :key="index">
                        <td><input v-model="row.parameter1" type="text"></td>
                        <td><input v-model="row.parameter2" type="text"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        </p>

    </AccordionBox>
</template>

<style>
table {
    width: 100%;
    border-collapse: collapse;
}

th {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

input[type="text"] {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
}
</style>



<i18n locale="en">
{
	"model"				: "Choose physiological model",
	"patientsettings"	: "Virtual Patient",
	"savepatient"		: "save patient",
	"loadpatient"		: "load patient",
}
</i18n>

<i18n locale="de">
{
	"model"				: "Physiologisches Modell auswählen",
	"patientsettings"	: "Virtuelle Patient:in",
	"savepatient"		: "Patient:in speichern",
	"loadpatient"		: "Patient:in laden",
}
</i18n>