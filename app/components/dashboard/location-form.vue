<script setup lang="ts">
import type { InsertLocationInput } from '@@/shared/schemas/insert-location'
import type { FetchError } from 'ofetch'

import type { NominatimLocationsType } from '@/types/map.type'

import { insertLocationSchema } from '../../../shared/schemas/insert-location'
import { CENTER_VI } from '../../libs/constant'

const props = defineProps<{
  initialValues?: InsertLocationInput | null
  onSubmit: (location: InsertLocationInput) => Promise<any>
  isEditMode?: boolean
  submitButtonText?: string
  submitButtonIcon?: string
  showCancelButton?: boolean
  cancelRoute?: string
}>()

const router = useRouter()
const route = useRoute()
const toast = useToast()

const mapStore = useMyMapStore()

const {
  handleSubmit,
  defineField,
  errors,
  meta,
  isSubmitting,
  setFieldValue,
  controlledValues,
  resetForm,
} = useForm<InsertLocationInput>({
  validationSchema: toTypedSchema(insertLocationSchema),
  initialValues: {
    name: props.initialValues?.name || '',
    description: props.initialValues?.description || '',
    longitude: props.initialValues?.longitude || CENTER_VI[0],
    latitude: props.initialValues?.latitude || CENTER_VI[1],
  },
})

// Define fields với two-way binding
const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')

const submitForm = handleSubmit(async (data) => {
  try {
    await props.onSubmit(data)

    toast.add({
      title: `${
        props.isEditMode ? 'Location updated' : 'Location added'
      } successfully!`,
      description: `The location "${
        data.name
      }" has been ${props.isEditMode ? 'updated' : 'added'} successfully.`,
      icon: 'lucide:check-check',
      close: {
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      },
    })

    resetForm()

    // nếu không có initaionValue thì navigateTo dashboard, có thì navigateTo dashboard-location-slug với parama slug
    if (!props.initialValues) {
      router.push('/dashboard')
    } else {
      router.push({
        name: 'dashboard-location-slug',
        params: { slug: route.params.slug },
      })
    }
  } catch (error) {
    const err = error as FetchError
    console.error('Error inserting location:', error)
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

function searchResultSelected(result: NominatimLocationsType) {
  setFieldValue('name', result.name)
  mapStore.addedPoint = {
    _id: 1,
    name: 'Added Point',
    description: '',
    longitude: Number(result.lon),
    latitude: Number(result.lat),
  }
}

function formatLatLon(value: number) {
  if (!value) return
  return value.toFixed(5)
}

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
    longitude: props.initialValues?.longitude || CENTER_VI[0],
    latitude: props.initialValues?.latitude || CENTER_VI[1],
  }
})

onBeforeRouteLeave((to) => {
  if (meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const answer = window.confirm(
      'You have unsaved changes. Are you sure you want to leave?',
    )
    if (!answer) {
      return false
    }
  }

  // Reset addedPoint when leaving add page to restore map functionality
  if (to.path !== '/dashboard/add') {
    mapStore.addedPoint = null
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

    <!-- Latitude & Longitude -->
    <div>
      <p class="-mt-2 text-sm text-gray-400">
        Current Locate: {{ formatLatLon(controlledValues.latitude) }}
        {{ formatLatLon(controlledValues.longitude) }}
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
        {{ submitButtonText || 'Add Location' }}
      </UButton>
    </div>
  </form>
  <div class="mx-4 flex justify-end">
    <DashboardFormsSearchPlace @results-selected="searchResultSelected" />
  </div>
</template>
