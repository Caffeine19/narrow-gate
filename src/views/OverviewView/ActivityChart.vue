<script setup lang="ts">
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'

const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 }
]

const chartRef = ref<null | HTMLCanvasElement>(null)

onMounted(() => {
  if (!chartRef.value) return
  var ctx = chartRef.value.getContext('2d')
  if (!ctx) return
  var gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(250,174,50,1)')
  gradient.addColorStop(1, 'rgba(250,174,50,0)')

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
          backgroundColor: gradient, // Put the gradient here as a fill color
          fill: true,
          data: [25.0, 32.4, 22.2, 39.4, 34.2, 22.0, 23.2, 24.1, 20.0, 18.4, 19.1, 17.4]
        },
        {
          backgroundColor: gradient, // Put the gradient here as a fill color
          fill: true,
          data: [25.0, 32.4, 22.2, 39.4, 34.2, 22.0, 23.2, 24.1, 20.0, 18.4, 19.1, 17.4]
        }
      ]
    },

    options: {
      borderColor: '#0ff'
    }
  })
})
</script>
<template><canvas ref="chartRef"></canvas></template>
