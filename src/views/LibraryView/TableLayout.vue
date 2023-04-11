<script setup lang="ts">
import type { PropType } from 'vue'

import type { BookCover } from '@/types/book'
import { useBookStore } from '@/stores/book'
import NarrowButton from '@/components/NarrowButton.vue'
import { useRouter } from 'vue-router'

defineProps({ bookCoverList: Array as PropType<BookCover[]> })

const bookStore = useBookStore()

const router = useRouter()
const goReading = (cover: BookCover) => {
  bookStore.setOpenedBook(cover)
  router.push({ name: 'reading', query: { id: cover.id } })
}
</script>
<template>
  <div class="p-8 overflow-hidden">
    <div class="custom-scrollbar overflow-x-auto overflow-y-auto">
      <table>
        <thead>
          <th class="px-2 py-1.5">
            <button class="w-7 h-7 flex items-center justify-center">
              <i class="ri-checkbox-indeterminate-line" style="font-size: 24px"></i>
            </button>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-at-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">identifier</p>
            </div>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-attachment-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">title</p>
            </div>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-user-smile-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">creator</p>
            </div>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-file-zip-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">size</p>
            </div>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-mail-send-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">publisher</p>
            </div>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-calendar-check-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">pubdate</p>
            </div>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-inbox-archive-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">addedDate</p>
            </div>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-folder-open-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">lastOpenedDate</p>
            </div>
          </th>
          <th>
            <div class="flex items-center px-2 py-1.5 space-x-1.5">
              <i class="ri-command-line" style="font-size: 24px"></i>
              <p class="text-lg font-medium">operation</p>
            </div>
          </th>
        </thead>
        <tbody>
          <tr
            v-for="bookCover in bookCoverList"
            :key="bookCover.id"
            class="group transition-colors border-t-0"
            :class="
              bookCover.picked
                ? 'bg-apathetic-300/10 text-apathetic-400'
                : ' hover:text-zinc-50 group hover:bg-zinc-800 text-zinc-100'
            "
          >
            <td class="px-2 py-1.5">
              <button
                class="w-7 h-7 flex items-center justify-center transition-colors"
                @click="() => bookStore.pickBook(bookCover.id)"
                :class="
                  bookCover.picked
                    ? 'text-apathetic-400'
                    : 'group-hover:text-zinc-50 text-zinc-400/60'
                "
              >
                <i
                  style="font-size: 24px"
                  :class="bookCover.picked ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'"
                ></i>
              </button>
            </td>
            <td class="px-3 py-1.5">{{ bookCover.identifier }}</td>
            <td
              class="whitespace-nowrap max-w-[240px] px-3 py-1.5 overflow-x-auto custom-scrollbar"
            >
              {{ bookCover.title }}
            </td>
            <td
              class="px-3 py-1.5 overflow-x-auto custom-scrollbar whitespace-nowrap max-w-[240px]"
            >
              {{ bookCover.creator }}
            </td>
            <td class="px-3 py-1.5">{{ (bookCover.size / 1024).toFixed(2) }}KB</td>
            <td class="px-3 py-1.5 break-keep">
              {{ bookCover.publisher }}
            </td>
            <td class="px-3 py-1.5">{{ bookCover.pubdate }}</td>
            <td class="px-3 py-1.5">{{ bookCover.pubdate }}</td>
            <td class="px-3 py-1.5">{{ bookCover.pubdate }}</td>
            <td class="px-3 py-1.5">
              <div class="flex items-center space-x-3">
                <NarrowButton
                  icon-style="ri-play-line"
                  :action="() => goReading(bookCover)"
                  button-style="!bg-careless-400/20 !text-careless-400 hover:!text-careless-400 hover:!bg-careless-400/20 hover:!border-careless-400/60"
                />
                <NarrowButton
                  icon-style="ri-ball-pen-line"
                  :action="() => bookStore.deleteBook([bookCover.id])"
                  button-style="!bg-tea-400/20 !text-tea-400 hover:!text-tea-400  hover:!bg-tea-400/20 hover:!border-tea-400/60"
                />
                <NarrowButton
                  icon-style="ri-delete-bin-line"
                  :action="() => bookStore.deleteBook([bookCover.id])"
                  button-style="!bg-passion-400/20 !text-passion-400 hover:!text-passion-400  hover:!bg-passion-400/20 hover:!border-passion-400/60"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style>
table {
  border-collapse: separate !important;
  border-spacing: 0;
  @apply table-fixed;
}

thead {
  @apply border-zinc-700 bg-zinc-950 text-zinc-400 border;
}

th,
td {
  @apply border-zinc-700 border;
}

td:first-child,
th:first-child {
  z-index: 5;
  @apply bg-zinc-950 sticky left-0;
}

td:last-child,
th:last-child {
  z-index: 5;
  @apply bg-zinc-950 sticky right-0;
}
</style>
