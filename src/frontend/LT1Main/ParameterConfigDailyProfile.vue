<script lang="ts">
import { defineComponent, PropType } from 'vue';
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
            editedProfile: new DailyProfile(this.defaultValue || [])
        };
    },
    watch: {
    defaultValue: {
        handler: function(newVal: Array<[number, number]>) {
            // Überprüfen, ob das neue Array anders ist als das aktuelle Profil
            if (JSON.stringify(newVal) !== JSON.stringify(this.editedProfile.profile)) {
                this.editedProfile.profile = newVal; // Kopie des Arrays, um reaktive Updates zu erzwingen
                this.valueChanged();  // Emitted ein Update-Event, falls nötig
            }
        },
        immediate: true,  // Führt den Handler sofort beim Initialisieren aus
        deep: true  // Achtet auf tiefe Änderungen im Objekt/Array
        },
    },

    methods: {
        addEntry() {
            this.editedProfile.addEntry();
            this.valueChanged();
        },
        removeEntry(index: number) {
            this.editedProfile.removeEntry();
            this.valueChanged();
        },
        valueChanged() {
            // Informiert die Elternkomponente über eine Änderung
            this.$emit('valueChanged', this.editedProfile.profile);
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
                <tr v-for="(entry, index) in editedProfile.profile" :key="index">
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
