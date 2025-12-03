<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

type DateRange = {
  start: string | undefined
  end: string | undefined
}

const props = defineProps<{
  modelValue?: DateRange
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DateRange]
}>()

const inputDateRef = useTemplateRef('inputDateRef')

// Chuyển đổi từ ISO string sang CalendarDate
const toCalendarDate = (
  dateString: string | undefined,
): CalendarDate | undefined => {
  if (!dateString) return undefined

  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return undefined
    }
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    )
  } catch {
    return undefined
  }
}

// Chuyển đổi từ CalendarDate sang ISO 8601 string với thời gian
const fromCalendarDate = (
  calendarDate: CalendarDate | undefined,
  isEndDate: boolean = false,
): string | undefined => {
  if (!calendarDate) return undefined

  // Tạo Date object với thời gian mặc định:
  // Start date: 00:00:00.000
  // End date: 23:59:59.999
  const date = new Date(
    calendarDate.year,
    calendarDate.month - 1,
    calendarDate.day,
    isEndDate ? 23 : 0,
    isEndDate ? 59 : 0,
    isEndDate ? 59 : 0,
    isEndDate ? 999 : 0,
  )

  // Trả về ISO 8601 string
  return date.toISOString()
}

// Computed property để binding hai chiều
const dateRange = computed<{
  start: CalendarDate | undefined
  end: CalendarDate | undefined
}>({
  get() {
    return {
      start: props.modelValue?.start
        ? toCalendarDate(props.modelValue.start)
        : undefined,
      end: props.modelValue?.end
        ? toCalendarDate(props.modelValue.end)
        : undefined,
    }
  },
  set(newValue: {
    start: CalendarDate | undefined
    end: CalendarDate | undefined
  }) {
    emit('update:modelValue', {
      start: fromCalendarDate(newValue.start, false),
      end: fromCalendarDate(newValue.end, true),
    })
  },
})

onMounted(() => {
  // Chỉ khởi tạo nếu không có giá trị từ props
  if (!props.modelValue || (!props.modelValue.start && !props.modelValue.end)) {
    const now = new Date()
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    )
    const tomorrowEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      23,
      59,
      59,
      999,
    )

    emit('update:modelValue', {
      start: todayStart.toISOString(),
      end: tomorrowEnd.toISOString(),
    })
  }
})
</script>

<template>
  <UInputDate ref="inputDateRef" v-model="dateRange" range>
    <template #trailing>
      <UPopover :reference="inputDateRef?.inputsRef[0]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          aria-label="Select a date range"
          class="px-0"
        />

        <template #content>
          <UCalendar
            v-model="dateRange"
            class="p-2"
            :number-of-months="2"
            range
          />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
