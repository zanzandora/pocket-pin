<script setup lang="ts">
defineProps<{
  isOpen: boolean
  deleting: boolean
  title: string
  description?: string
  confirmLabel?: string
  confirmColor?:
    | 'neutral'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | undefined
}>()

const emit = defineEmits<{
  (e: 'close', value: boolean): void
  (e: 'onConfirm'): void
}>()
</script>

<template>
  <UModal
    :close="{
      onClick: () => {
        if (!deleting) emit('close', false)
      },
    }"
    :open="isOpen"
    :dismissible="true"
    :title="title"
    :description="description"
  >
    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          variant="soft"
          label="Dismiss"
          :loading="deleting"
          :disabled="deleting"
          @click="emit('close', false)"
        />
        <UButton
          :label="confirmLabel"
          variant="outline"
          :loading="deleting"
          :disabled="deleting"
          :color="confirmColor || 'neutral'"
          @click="
            () => {
              emit('onConfirm')
              emit('close', true)
            }
          "
        />
      </div>
    </template>
  </UModal>
</template>
