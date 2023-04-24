<script setup lang="ts">
import Chart, { type ChartOptions } from 'chart.js/auto'
import { onMounted, ref } from 'vue'

const chartRef = ref<null | HTMLCanvasElement>(null)

const chartOptions: ChartOptions = {
  scales: {
    A: {
      position: 'left',
      beginAtZero: true,

      ticks: { color: '#a1a1aa', font: { size: 14 }, padding: 12 },
      grid: { display: false }
      // Hide grid lines, otherwise you have separate grid lines for the 2 y axes
    },
    B: {
      position: 'right',
      ticks: { color: '#a1a1aa', font: { size: 14 }, padding: 12 },
      grid: { display: true, color: '#27272a' }
    },
    x: {
      grid: { display: true, color: '#27272a' },
      ticks: { color: '#a1a1aa', font: { size: 14 }, padding: 12 }
    }
  },
  plugins: {}
}
onMounted(() => {
  if (!chartRef.value) return
  const height = chartRef.value.clientHeight
  console.log('🚀 ~ file: ActivityChart.vue:33 ~ onMounted ~ height:', height)
  const ctx = chartRef.value.getContext('2d')

  if (!ctx) return
  const gradientApathetic = ctx.createLinearGradient(0, 0, 0, 224)

  gradientApathetic.addColorStop(0, 'rgba(139,145,238,0.6)')
  gradientApathetic.addColorStop(0.9, 'rgba(139,145,238,0)')
  const gradientTea = ctx.createLinearGradient(0, 0, 0, 224)
  gradientTea.addColorStop(0, 'rgba(106,166,97,0.6)')
  gradientTea.addColorStop(0.9, 'rgba(106,166,97,0)')
  new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: [
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00',
        '00:00'
      ],
      datasets: [
        {
          backgroundColor: gradientApathetic, // Put the gradient here as a fill color
          fill: true,
          data: [25.0, 32.4, 22.2, 39.4, 34.2, 22.0, 23.2, 24.1, 20.0, 18.4, 19.1, 17.4],
          borderColor: '#8B91EE',
          yAxisID: 'A',
          label: 'A'
        },
        {
          backgroundColor: gradientTea, // Put the gradient here as a fill color
          fill: true,
          data: [
            120.0, 109.1, 122.2, 139.4, 125.0, 134.2, 118.4, 122.0, 123.2, 132.4, 124.1, 117.4
          ],
          borderColor: '#6AA661',
          yAxisID: 'B',
          label: 'B'
        }
      ]
    },
    options: chartOptions
  })
})
</script>
<template><canvas ref="chartRef" class="max-h-64"></canvas></template>
