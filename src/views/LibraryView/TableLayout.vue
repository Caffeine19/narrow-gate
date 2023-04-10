<script setup lang="ts">
import type { PropType } from 'vue'

import type { BookCover } from '@/types/book'
import { useBookStore } from '@/stores/book'

defineProps({ bookCoverList: Array as PropType<BookCover[]> })

const bookStore = useBookStore()
</script>
<template>
  <div class="custom-scrollbar p-8 overflow-x-auto">
    <table class="">
      <thead class="border-zinc-700 bg-zinc-950 text-zinc-200 border">
        <th class="px-2 py-1.5 border-r border-zinc-700">
          <button class="w-7 h-7 flex items-center justify-center">
            <i class="ri-checkbox-indeterminate-line" style="font-size: 24px"></i>
          </button>
        </th>
        <th class="border-zinc-700 border-r">
          <div class="flex items-center px-2 py-1.5 space-x-1.5">
            <i class="ri-at-line" style="font-size: 24px"></i>
            <p class="text-lg font-medium">identifier</p>
          </div>
        </th>
        <th class="border-zinc-700 border-r">
          <div class="flex items-center px-2 py-1.5 space-x-1.5">
            <i class="ri-attachment-line" style="font-size: 24px"></i>
            <p class="text-lg font-medium">title</p>
          </div>
        </th>
        <th class="border-zinc-700 border-r">
          <div class="flex items-center px-2 py-1.5 space-x-1.5">
            <i class="ri-user-smile-line" style="font-size: 24px"></i>
            <p class="text-lg font-medium">creator</p>
          </div>
        </th>
        <th class="border-zinc-700 border-r">
          <div class="flex items-center px-2 py-1.5 space-x-1.5">
            <i class="ri-file-zip-line" style="font-size: 24px"></i>
            <p class="text-lg font-medium">size</p>
          </div>
        </th>
        <th class="border-zinc-700 border-r">
          <div class="flex items-center px-2 py-1.5 space-x-1.5">
            <i class="ri-mail-send-line" style="font-size: 24px"></i>
            <p class="text-lg font-medium">publisher</p>
          </div>
        </th>
        <th class="border-zinc-700 border-r">
          <div class="flex items-center px-2 py-1.5 space-x-1.5">
            <i class="ri-calendar-check-line" style="font-size: 24px"></i>
            <p class="text-lg font-medium">pubdate</p>
          </div>
        </th>
        <th class="border-zinc-700 border-r">
          <div class="flex items-center px-2 py-1.5 space-x-1.5">
            <i class="ri-inbox-archive-line" style="font-size: 24px"></i>
            <p class="text-lg font-medium">addedDate</p>
          </div>
        </th>
        <th class="border-zinc-700 border-r">
          <div class="flex items-center px-2 py-1.5 space-x-1.5">
            <i class="ri-folder-open-line" style="font-size: 24px"></i>
            <p class="text-lg font-medium">lastOpenedDate</p>
          </div>
        </th>
      </thead>
      <tbody>
        <tr
          v-for="bookCover in bookCoverList"
          :key="bookCover.id"
          class="border-zinc-700 group transition-colors border border-t-0"
          :class="
            bookCover.picked
              ? 'bg-indigo-400/10 text-indigo-300'
              : ' hover:text-zinc-50 group hover:bg-zinc-800 text-zinc-100'
          "
        >
          <th class="px-2 py-1.5 border-r border-zinc-700">
            <button
              class="w-7 h-7 text-zinc-400/60 flex items-center justify-center transition-colors"
              @click="() => bookStore.pickBook(bookCover.id)"
              :class="bookCover.picked ? 'text-indigo-300' : 'group-hover:text-zinc-50'"
            >
              <i
                style="font-size: 24px"
                :class="bookCover.picked ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'"
              ></i>
            </button>
          </th>
          <td class="px-3 py-1.5 border-r border-zinc-700">{{ bookCover.identifier }}</td>
          <td
            class="whitespace-nowrap max-w-[240px] px-3 py-1.5 overflow-x-auto custom-scrollbar border-r border-zinc-700"
          >
            {{ bookCover.title }}
          </td>
          <td
            class="px-3 py-1.5 border-r overflow-x-auto custom-scrollbar border-zinc-700 whitespace-nowrap max-w-[240px]"
          >
            {{ bookCover.creator }}
          </td>
          <td class="px-3 py-1.5 border-r border-zinc-700">
            {{ (bookCover.size / 1024).toFixed(2) }}KB
          </td>
          <td class="px-3 py-1.5 border-r border-zinc-700 break-keep">{{ bookCover.publisher }}</td>
          <td class="px-3 py-1.5 border-r border-zinc-700">{{ bookCover.pubdate }}</td>
          <td class="px-3 py-1.5 border-r border-zinc-700">{{ bookCover.pubdate }}</td>
          <td class="px-3 py-1.5 border-r border-zinc-700">{{ bookCover.pubdate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
