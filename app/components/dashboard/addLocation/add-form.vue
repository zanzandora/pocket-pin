<script setup lang="ts">
import type {
  InsertLocationInput,
  insertLocationResponse,
} from '@@/shared/schemas/insert-location'
import type { FetchError } from 'ofetch'

import { insertLocationSchema } from '../../../../shared/schemas/insert-location'
import { CENTER_VI } from '../../../libs/constant'

const toast = useToast()
const router = useRouter()

const mapStore = useMyMapStore()
// Protect from CSRF attack
const { $csrfFetch } = useNuxtApp()

const {
  handleSubmit,
  resetForm,
  defineField,
  errors,
  meta,
  isSubmitting,
  setFieldValue,
  controlledValues,
} = useForm<InsertLocationInput>({
  validationSchema: toTypedSchema(insertLocationSchema),
  initialValues: {
    name: '',
    description: '',
    longitude: CENTER_VI[0],
    latitude: CENTER_VI[1],
  },
})

// Define fields với two-way binding
const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')

const submitForm = handleSubmit(async (data) => {
  try {
    await $csrfFetch<insertLocationResponse>('/api/location', {
      method: 'POST',
      body: data,
    })
    // console.log('data: ', inserted)

    toast.add({
      title: 'Create location successfully!',
      description: 'Your new location has been added.',
      icon: 'check_circle',
    })

    resetForm()

    await router.push('/dashboard')
  } catch (error) {
    const err = error as FetchError
    console.error('Error inserting location:', error)
    toast.add({
      title: 'Error',
      description:
        err.data?.statusMessage || err.statusMessage || 'An error occurred.',
      color: 'error',
    })
  }
})

function formatLatLon(value: number) {
  if (!value) return

  return value.toFixed(5)
}
onMounted(() => {
  mapStore.addedPoint = {
    _id: 1,
    name: 'Added Point',
    description: '',
    longitude: CENTER_VI[0],
    latitude: CENTER_VI[1],
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
      <p class="text-xl">
        Drag the
        <UIcon class="text-warning cursor-pointer" name="i-picon:marker" />
        marker to your desired location.
      </p>
      <p>Or double click on the map.</p>
      <p class="mt-2 text-sm text-gray-400">
        Current Locate: {{ formatLatLon(controlledValues.latitude) }}
        {{ formatLatLon(controlledValues.longitude) }}
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex flex-row items-center justify-end gap-4">
      <UButton
        type="button"
        variant="outline"
        class="px-6 py-2"
        icon="i-lucide:corner-up-left"
        :disabled="isSubmitting"
        @click="router.push('/dashboard')"
      >
        Cancel
      </UButton>
      <UButton
        type="submit"
        color="primary"
        class="px-6 py-2"
        trailing-icon="i-lucide:circle-plus"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        :trailing="true"
      >
        Add Location
      </UButton>
    </div>
  </form>
</template>
