<script setup lang="ts">
import type { FetchError } from 'ofetch'

import { searchSchema } from '@@/shared/schemas/search'
import { useDebounceFn } from '@vueuse/core'

import type { ApiResponeType } from '@/types/api-respone.type'
import type { NominatimLocationsType } from '@/types/map.type'

// <eventName>: <expected arguments>
const emit = defineEmits<{
  resultsSelected: [result: NominatimLocationsType]
}>()

const toast = useToast()

const searchTerm = ref('')
const debouncedSearchTerm = ref('')
const open = ref(false)

// Computed để validate search term
const validatedSearchTerm = computed(() => {
  try {
    const result = searchSchema.safeParse({ q: searchTerm.value })
    return result.success ? debouncedSearchTerm.value : ''
  } catch {
    return ''
  }
})

// Fetch data từ API của bạn
const {
  data: searchResults,
  pending: isLoading,
  execute,
} = useAsyncData(
  'search-places',
  async () => {
    if (!validatedSearchTerm.value) {
      return []
    }

    try {
      const res = await $fetch<ApiResponeType<NominatimLocationsType[]>>(
        '/api/search',
        {
          params: { q: validatedSearchTerm.value },
          // Thêm timeout để tránh request treo
          timeout: 10000,
        },
      )

      return res?.data.map((place) => ({
        id: place.place_id,
        label: place.display_name,
        suffix: `${place.lat}, ${place.lon}`,
        onSelect() {
          emit('resultsSelected', place)
          searchTerm.value = ''
          debouncedSearchTerm.value = ''
          searchResults.value = []
          open.value = false
        },
      }))
    } catch (error) {
      const err = error as FetchError
      console.error('Lỗi tìm kiếm:', error)
      toast.add({
        title: 'Error',
        description:
          err.data?.statusMessage || err.statusMessage || 'An error occurred.',
        color: 'error',
      })
      searchTerm.value = ''
      debouncedSearchTerm.value = ''
      searchResults.value = []
      open.value = false
      return []
    }
  },
  {
    server: false, // Chỉ chạy trên client
    immediate: false, // Không chạy ngay lập tức
  },
)

// Tạo debounce function với thời gian chờ 300ms
const debouncedSearch = useDebounceFn((value: string) => {
  debouncedSearchTerm.value = value
}, 300)

// Watch searchTerm và áp dụng debounce
watch(searchTerm, (newValue) => {
  debouncedSearch(newValue)
})

// Watch validatedSearchTerm để trigger fetch khi có valid input đã debounce
watch(validatedSearchTerm, (newVal) => {
  if (newVal && newVal.length > 0) {
    execute()
  } else {
    // Clear results khi search term rỗng
    debouncedSearchTerm.value = ''
    searchResults.value = []
  }
})

const groups = computed(() => [
  {
    id: 'places',
    label: searchTerm.value
      ? `Places matching "${searchTerm.value}"...`
      : 'Search place',
    items: searchResults.value || [],
    ignoreFilter: true,
  },
])
</script>

<template>
  <UModal v-model:open="open">
    <UButton
      label="Search place..."
      color="neutral"
      variant="subtle"
      class="px-6 py-2"
      trailing-icon="i-lucide-search"
    />

    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="isLoading"
        :groups="groups"
        class="h-80"
        placeholder="Search place..."
        @update:open="open = $event"
        @update:search-term="
          (value) => {
            // Xử lý clear ngay lập tức
            if (!value) {
              searchResults = []
            }
          }
        "
      />
    </template>
  </UModal>
</template>
