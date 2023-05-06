<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Chart, { type ChartOptions } from 'chart.js/auto'

import dayjs from 'dayjs'

import { useRecordStore } from '@/stores/record'

import type { RecordActivity } from '@/types/record'

const chartRef = ref<null | HTMLCanvasElement>(null)

const chartOptions: ChartOptions = {
  scales: {
    times: {
      position: 'left',
      beginAtZero: true,

      ticks: { color: '#a1a1aa', font: { size: 14 }, padding: 12 },
      grid: { display: false }
      // Hide grid lines, otherwise you have separate grid lines for the 2 y axes
    },
    Duration: {
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

const recordStore = useRecordStore()
const monthlyRecordActivity = ref<RecordActivity[]>([])

onMounted(async () => {
  monthlyRecordActivity.value = await recordStore.getMonthlyRecordActivity(
    dayjs().format('YYYY-MM')
  )
  if (!chartRef.value) return
  const height = chartRef.value.clientHeight
  console.log('🚀 ~ file: ActivityChart.vue:33 ~ onMounted ~ height:', height)
  const ctx = chartRef.value.getContext('2d')

  if (!ctx) return
  const gradientApathetic = ctx.createLinearGradient(0, 0, 0, 324)

  gradientApathetic.addColorStop(0, 'rgba(139,145,238,0.6)')
  gradientApathetic.addColorStop(0.9, 'rgba(139,145,238,0)')
  const gradientTea = ctx.createLinearGradient(0, 0, 0, 324)
  gradientTea.addColorStop(0, 'rgba(106,166,97,0.6)')
  gradientTea.addColorStop(0.9, 'rgba(106,166,97,0)')

  const chartLabel = monthlyRecordActivity.value.map((day) => day.key)
  const chartDataTimes = monthlyRecordActivity.value.map((day) => day.val?.times || 0)
  const chartDataDuration = monthlyRecordActivity.value.map((day) => day.val?.duration || 0)

  new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: chartLabel,
      datasets: [
        {
          backgroundColor: gradientApathetic, // Put the gradient here as a fill color
          fill: true,
          data: chartDataTimes,
          borderColor: '#8B91EE',
          yAxisID: 'times',
          label: 'times'
        },
        {
          backgroundColor: gradientTea, // Put the gradient here as a fill color
          fill: true,
          data: chartDataDuration,
          borderColor: '#6AA661',
          yAxisID: 'Duration',
          label: 'Duration'
        }
      ]
    },
    options: chartOptions
  })
})
</script>
<template><canvas ref="chartRef" class="max-h-[33.3vh]"></canvas></template>
