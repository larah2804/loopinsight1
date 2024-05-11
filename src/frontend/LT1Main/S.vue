<template>
    <div>
        <canvas id="signals2" width="800" height="200"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
    mounted() {
        this.renderChart();
    },
    methods: {
        renderChart() {
            const canvas = document.getElementById('signals2');
            const ctx = canvas.getContext('2d');

            // Daten für die Linie (Stützstellen)
            let data = [
                { x: 0, y: 0.05 },
                { x: 4, y: 0.04 },
                { x: 11, y: 0.08 },
                { x: 17, y: 0.1 },
                { x: 22, y: 0.085 },
                { x: 30, y: 0.05 }
            ];

            // Datenpunkte nach X-Koordinate sortieren
            data.sort((a, b) => a.x - b.x);

            // Chart zeichnen
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Probe',
                        data: data,
                        borderColor: 'blue',
                        fill: false
                    }]
                },
                options: {
                    layout: {
                        padding: { right: 20 },
                    },
                    responsive: false,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: { stepSize: 0.5 },
                            min: 0,
                            max: 30 // Bereich von 0 bis 10 auf der X-Achse
                        },
                        y: {
                            min: 0,
                            max: 0.15,
                            ticks: { stepSize: 0.01 },
                        }
                    },
                    plugins: {
                        tooltip: {
                            enabled: false
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });

            // Event Listener für Klicken auf den Canvas hinzufügen
            canvas.addEventListener('click', (event) => {
                // Klicken auf den Canvas-Element
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const scaledY = 1 - (y / rect.height);

                // Neuen Datenpunkt erstellen
                const newX = (x / rect.width) * 30; // x-Koordinate im Bereich von 0 bis 30
                const newY = scaledY * 0.15; // y-Koordinate im Bereich von 0 bis 100
                const newDataPoint = { x: newX, y: newY };

                // Neuen Datenpunkt einfügen oder aktualisieren
                this.addOrUpdateDataPoint(newDataPoint);
            });
        },
        addOrUpdateDataPoint(newDataPoint) {
            const chart = Chart.getChart('signals2');
            const dataset = chart.data.datasets[0];

            // Index des vorhandenen Datenpunkts mit einer größeren X-Koordinate als der neue Datenpunkt finden
            let index = dataset.data.findIndex(point => point.x > newDataPoint.x);

            // Wenn kein solcher Datenpunkt gefunden wird, füge den neuen Datenpunkt am Ende hinzu
            if (index === -1) {
                dataset.data.push(newDataPoint);
            } else {
                // Andernfalls füge den neuen Datenpunkt an der gefundenen Position ein
                dataset.data.splice(index, 0, newDataPoint);
            }

            // Chart aktualisieren
            chart.update();
        }
    }
};
</script>


<i18n locale="en">
    {
        "title":		"Try",
    }
    </i18n>
<i18n locale="de">
    {
        "title": 		"Versuch",
    }
    </i18n>