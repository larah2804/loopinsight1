<template>
    <div>
      <canvas ref="chartCanvas" width="800" height="200"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    props: ['daten'],
    data() {
      return {
        myChart: null, 
      };
    },
    mounted() {
      this.drawChart(); 
    },
    methods: {
      drawChart() {
        if (this.myChart) {
          this.myChart.destroy(); 
        }
        const ctx = this.$refs.chartCanvas.getContext('2d');
        this.myChart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [{
              label: 'Daten',
              data: this.daten.map(d => ({ x: parseFloat(d.parameter1), y: parseFloat(d.parameter2) })),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
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
                position: 'bottom'
              },
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    },
    watch: {
      daten: {
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.drawChart(); 
          }
        }
      }
    },
    beforeUnmount() {
      if (this.myChart) {
        this.myChart.destroy(); 
      }
    }
  }
  </script>
  
  
  