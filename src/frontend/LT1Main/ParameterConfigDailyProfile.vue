<script lang="ts">
import { defineComponent, PropType, toRaw } from 'vue';
import DailyProfile from '../../common/DailyProfile.js';
import InfoboxTooltip from './InfoboxTooltip.vue';
import { ParameterDescription } from '../../types/ParametricModule.js'

export default defineComponent({
    props: {
        // Empfängt die Konfiguration und Standardwerte vom Parent
        config: {
            type: Object as PropType<ParameterDescription>,
            required: true,
        },
        defaultValue: {
            type: Array as PropType<Array<[number, number]>>,  // Anfangswerte für DailyProfile
            default: () => []
        },
        id: String,
        description: String,
        tooltip: String,
    },
    data() {
        return {
            // Initialisiert DailyProfile mit den übergebenen Standardwerten
            profileData: JSON.parse(JSON.stringify(this.defaultValue || []))
        };
    },
    

    methods: {
        addEntry() {
            this.profileData.push([0, 0]); 
            this.valueChanged();
        },
        removeEntry(index: number) {
            if (index >= 0 && index < this.profileData.length) {
                this.profileData.splice(index, 1);
            }
            this.valueChanged();
        },
        valueChanged() {
            // Informiert die Elternkomponente über eine Änderung
            const updatedProfile = new DailyProfile(this.profileData);
            this.$emit('valueChanged', toRaw(updatedProfile));
        },
    },
    components: {
        InfoboxTooltip
    }
});
</script>

<template>
    <div class="daily-profile-editor">
        <InfoboxTooltip :description="description" :tooltip="tooltip" />
        <td><button @click="addEntry">Zeile hinzufügen</button></td>
        <td><button @click="removeEntry(1)">Entfernen</button></td>
        <th><button @click="valueChanged">Update Klassifizierung</button></th>
        <table>
            <thead>
                <tr>
                    <th>Zeit</th>
                    <th>Wert</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(entry, index) in profileData" :key="index">
                    <td><input v-model.number="entry[0]" type="number" @input="valueChanged" /></td>
                    <td><input v-model.number="entry[1]" type="number" @input="valueChanged" /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.daily-profile-editor button {
    margin-bottom: 10px;
}
</style>
