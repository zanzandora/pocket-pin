<script setup lang="ts">
import type { InsertLocationLogInput } from '~~/shared/schemas/insert-location-log'
import type { FetchError } from 'ofetch'

import { insertLocationLogSchema } from '~~/shared/schemas/insert-location-log'

import { CENTER_VI } from '../../libs/constant'

const props = defineProps<{
  initialValues?: InsertLocationLogInput | null
  onSubmit: (location: InsertLocationLogInput) => Promise<any>
  isEditMode?: boolean
  submitButtonText?: string
  submitButtonIcon?: string
  showCancelButton?: boolean
  cancelRoute?: string
}>()
const { currentLocation } = useMyLocationsStore()
console.log('currentLocation :>> ', currentLocation)
const mapStore = useMyMapStore()

const router = useRouter()
const toast = useToast()

const {
  handleSubmit,
  setFieldValue,
  errors,
  meta,
  isSubmitting,
  controlledValues,
  resetForm,
  defineField,
} = useForm({
  validationSchema: toTypedSchema(insertLocationLogSchema),
  initialValues: {
    name: props.initialValues?.name || '',
    description: props.initialValues?.description || '',
    started_at: props.initialValues?.started_at || '',
    ended_at: props.initialValues?.ended_at || '',
    longitude: currentLocation?.data.longitude || CENTER_VI[0],
    latitude: currentLocation?.data.latitude || CENTER_VI[1],
    ...props.initialValues,
  },
})

// Define fields với two-way binding
const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [started_at, _started_atAttrs] = defineField('started_at')
const [ended_at, _ended_atAttrs] = defineField('ended_at')

function formatLatLon(value: number) {
  if (!value) return
  return value.toFixed(5)
}

// Computed property cho date range binding
const dateRange = computed({
  get() {
    return {
      start: started_at.value || undefined,
      end: ended_at.value || undefined,
    }
  },
  set(newValue: { start: string | undefined; end: string | undefined }) {
    started_at.value = newValue.start || ''
    ended_at.value = newValue.end || ''
  },
})

const submitForm = handleSubmit(async (data) => {
  try {
    await props.onSubmit(data)

    toast.add({
      title: `${props.isEditMode ? 'Location Log updated' : 'Location Log added'} successfully!`,
      description: `The location log "${data.name}" has been ${props.isEditMode ? 'updated' : 'added'} successfully.`,
      icon: 'lucide:check-check',
      close: {
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      },
    })

    // Reset form and wait for next tick to ensure form state is updated
    resetForm()
    await nextTick()

    mapStore.addedPoint = null

    // Navigate based on edit mode
    handleCancel()
  } catch (error) {
    const err = error as FetchError
    console.error('Error submitting location log:', error)
    toast.add({
      title: 'Error',
      description:
        err.data?.statusMessage || err.statusMessage || 'An error occurred.',
      close: {
        color: 'error',
        variant: 'outline',
        class: 'rounded-full',
      },
    })
    // Re-throw error to prevent form reset on failure
    throw error
  }
})

function handleCancel() {
  if (props.cancelRoute) {
    router.push(props.cancelRoute)
  } else {
    router.push('/dashboard')
  }
}

onMounted(() => {
  mapStore.addedPoint = {
    _id: 1,
    name: 'Added Point',
    description: '',
    longitude: currentLocation?.data.longitude || CENTER_VI[0],
    latitude: currentLocation?.data.latitude || CENTER_VI[1],
    zoom: 6,
  }
})

onBeforeRouteLeave(() => {
  if (meta.value.dirty && !isSubmitting.value) {
    // eslint-disable-next-line no-alert
    const answer = window.confirm(
      'You have unsaved changes. Are you sure you want to leave?',
    )
    if (!answer) {
      return false
    }
  }

  return true
})

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue('longitude', mapStore.addedPoint.longitude)
    setFieldValue('latitude', mapStore.addedPoint.latitude)
  }
})
</script>

<template>
  <form class="flex flex-col gap-8 p-4" @submit.prevent="submitForm">
    <!-- Name -->
    <UInput
      v-model="name"
      v-bind="nameAttrs"
      :disabled="isSubmitting"
      placeholder=""
      :ui="{ base: 'peer py-4 ' }"
      :error="!!errors.name"
    >
      <label
        class="text-highlighted peer-focus:text-highlighted peer-placeholder-shown:text-dimmed pointer-events-none absolute -top-2.5 left-0 px-1.5 text-xs font-medium transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium"
      >
        <span class="bg-default inline-flex px-1">Name</span>
      </label>
    </UInput>
    <span v-if="errors.name" class="-mt-4 text-xs text-red-500">{{
      errors.name
    }}</span>

    <!-- Description -->
    <UTextarea
      v-model="description"
      v-bind="descriptionAttrs"
      :disabled="isSubmitting"
      placeholder=""
      :ui="{ base: 'peer py-4' }"
      :error="!!errors.description"
    >
      <label
        class="text-highlighted peer-focus:text-highlighted peer-placeholder-shown:text-dimmed pointer-events-none absolute -top-2.5 left-0 px-1.5 text-xs font-medium transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium"
      >
        <span class="bg-default inline-flex px-1">Description</span>
      </label>
    </UTextarea>
    <span v-if="errors.description" class="-mt-4 text-xs text-red-500">{{
      errors.description
    }}</span>

    <!-- Date Range -->
    <DashboardDateRangePickerInput v-model="dateRange" />
    <span v-if="errors.started_at" class="-mt-4 text-xs text-red-500">{{
      errors.started_at
    }}</span>
    <span v-if="errors.ended_at" class="-mt-4 text-xs text-red-500">{{
      errors.ended_at
    }}</span>

    <div>
      <p class="-mt-2 text-sm text-gray-400">
        Current Locate: {{ formatLatLon(controlledValues.latitude!) }}
        {{ formatLatLon(controlledValues.longitude!) }}
      </p>
      <ul class="my-1 text-xl">
        To set the coordonates:
      </ul>
      <div class="ml-6 text-sm">
        <li>
          Drag the
          <UIcon class="text-warning cursor-pointer" name="i-picon:marker" />
          marker to your desired location.
        </li>
        <li>double click on the map.</li>
        <li>Search for a location and set it</li>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex flex-row items-center justify-end gap-4">
      <UButton
        v-if="showCancelButton !== false"
        type="button"
        variant="outline"
        class="px-6 py-2"
        icon="i-lucide:corner-up-left"
        :disabled="isSubmitting"
        @click="handleCancel"
      >
        Cancel
      </UButton>
      <UButton
        type="submit"
        color="primary"
        class="px-6 py-2"
        :trailing-icon="submitButtonIcon || 'i-lucide:circle-plus'"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        :trailing="true"
      >
        {{ submitButtonText || 'Add Location Log' }}
      </UButton>
    </div>
  </form>
</template>
