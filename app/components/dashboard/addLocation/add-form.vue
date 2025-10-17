<script setup lang="ts">
import type {
  InsertLocationInput,
  insertLocationResponse,
} from '@@/shared/schemas/insert-location'
import type { FetchError } from 'ofetch'

import { insertLocationSchema } from '../../../../shared/schemas/insert-location'

const toast = useToast()
const router = useRouter()
// Protect from CSRF attack
const { $csrfFetch } = useNuxtApp()

const { handleSubmit, resetForm, defineField, errors, meta, isSubmitting } =
  useForm<InsertLocationInput>({
    validationSchema: toTypedSchema(insertLocationSchema),
    initialValues: {
      name: '',
      description: '',
      latitude: 0,
      longitude: 0,
    },
  })

// Define fields với two-way binding
const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [latitude, latitudeAttrs] = defineField('latitude')
const [longitude, longitudeAttrs] = defineField('longitude')

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
      description: err.statusMessage || 'An error occurred.',
      color: 'error',
    })
  }
})

onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
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
    <UInput
      v-model="latitude"
      v-bind="latitudeAttrs"
      :disabled="isSubmitting"
      type="number"
      placeholder=""
      :ui="{ base: 'peer py-4' }"
      :error="!!errors.latitude"
    >
      <label
        class="text-highlighted peer-focus:text-highlighted peer-placeholder-shown:text-dimmed pointer-events-none absolute -top-2.5 left-0 px-1.5 text-xs font-medium transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium"
      >
        <span class="bg-default inline-flex px-1">Latitude</span>
      </label>
    </UInput>
    <span v-if="errors.latitude" class="-mt-4 text-xs text-red-500">{{
      errors.latitude
    }}</span>

    <UInput
      v-model="longitude"
      v-bind="longitudeAttrs"
      :disabled="isSubmitting"
      type="number"
      placeholder=""
      :ui="{ base: 'peer py-4' }"
      :error="!!errors.longitude"
    >
      <label
        class="text-highlighted peer-focus:text-highlighted peer-placeholder-shown:text-dimmed pointer-events-none absolute -top-2.5 left-0 px-1.5 text-xs font-medium transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium"
      >
        <span class="bg-default inline-flex px-1">Longitude</span>
      </label>
    </UInput>
    <span v-if="errors.longitude" class="-mt-4 text-xs text-red-500">{{
      errors.longitude
    }}</span>

    <!-- Buttons -->
    <div class="flex flex-row items-center justify-end gap-4">
      <UButton
        type="button"
        variant="outline"
        class="px-6 py-2"
        icon="i-lucide:corner-up-left"
        :disabled="isSubmitting"
        :loading="isSubmitting"
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
      >
        Add Location
      </UButton>
    </div>
  </form>
</template>
