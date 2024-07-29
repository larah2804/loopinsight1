<script lang="ts">
import { defineComponent, PropType, toRaw } from 'vue';
import DailyProfile from '../../common/DailyProfile.js';
import InfoboxTooltip from './InfoboxTooltip.vue';
import { ParameterDescription } from '../../types/ParametricModule.js'

export default defineComponent({
    props: {
        config: {
            type: Object as PropType<ParameterDescription>,
            required: true,
        },
        defaultValue: {
            type: Object as PropType<DailyProfile>,
            default: () => new DailyProfile([[0, 0]])  // Standardmäßig leeres DailyProfile, falls nichts übergeben wird
        },
        id: String,
        description: String,
        tooltip: String,
    },
    data() {
        return {
            profileData: [] as Array<[number, number]>,
            addInput: 0,
            removeInput: 0
        };
    },

    mounted() {
        // Prüfen, ob defaultValue eine Instanz von DailyProfile ist und entsprechend initialisieren
        if (this.defaultValue instanceof DailyProfile) {
            this.profileData = JSON.parse(JSON.stringify(this.defaultValue.getProfile()));
        }
    },


    methods: {
        addEntry() {
            const index = Math.max(0, Math.min(this.profileData.length, this.addInput));
            this.profileData.splice(index, 0, [0, 0]); 
            this.valueChanged();
        },

        removeEntry() {
            const index = Math.max(0, Math.min(this.profileData.length - 1, Number(this.removeInput)));
            if (this.profileData.length > 0 && index >= 0 && index < this.profileData.length) {
                this.profileData.splice(index, 1);
            }
            this.valueChanged();
        },

        valueChanged() {
            const updatedProfile = JSON.parse(JSON.stringify(this.profileData));
            console.log(updatedProfile);
            const dailyProfileInstance = new DailyProfile(updatedProfile);
            this.$emit('valueChanged', dailyProfileInstance);  // Übertragen als Instanz von DailyProfile
        }

    },
    components: {
        InfoboxTooltip
    }
});
</script>

<template>
    <div class="daily-profile-editor">
        <table>
            <thead>
                <tr>
                   <td><button @click="addEntry">Zeile hinzufügen</button></td>
                   <td><button @click="removeEntry">Entfernen</button></td>                    
                </tr>
                <tr>
                    <td><input type="number" v-model.number="addInput" placeholder="Add row"></td>
                    <td><input type="number" v-model.number="removeInput" placeholder="Remove row"></td>
                </tr>
                <tr>
                    <th>Zeit</th>
                    <th>Wert</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(entry, index) in profileData" :key="index" class="input-row">
                    <td><input v-model.number="entry[0]" type="number" @input="valueChanged" /></td>
                    <td><input v-model.number="entry[1]" type="number" @input="valueChanged" /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>



<style scoped>
.daily-profile-editor {
    width: 100%; /* Nimmt die volle Breite des übergeordneten Elements ein */
    text-align: center; /* Zentriert den Text und die Inhalte */
}

.daily-profile-editor table {
    width: 100%; /* Stellt sicher, dass die Tabelle die volle verfügbare Breite nutzt */
    margin: auto; /* Zentriert die Tabelle horizontal */
}

.daily-profile-editor .button-container {
    display: flex;
    justify-content: center; /* Zentriert die Inhalte im Container */
    align-items: center; /* Stellt sicher, dass die Inhalte vertikal zentriert sind */
    gap:40px; /* Abstand zwischen den Buttons */
    margin-bottom: 10px; /* Abstand unter dem Container */

}

.daily-profile-editor button {
    padding: 8px 16px; /* Erhöht die Größe der Buttons für bessere Klickbarkeit */
}

.daily-profile-editor th, .daily-profile-editor td {
    text-align: center; /* Zentriert den Text in den Kopfzeilen und Datenzellen */
}

.daily-profile-editor input[type="number"] {
    width: 90%; 
    box-sizing: border-box; /* Box-Model für die Eingabefelder, einschließlich Padding und Border */
}
</style>

