<script setup lang="ts">
type Props = {
  name: string
  label: string
  component?: any
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  component: 'UInput',
  placeholder: '',
})

const { value, errorMessage, handleBlur, handleChange } = useField(
  () => props.name,
)
</script>

<template>
  <div class="relative">
    <component
      :is="component"
      v-model="value"
      v-bind="$attrs"
      :placeholder="placeholder"
      :ui="{ base: 'peer py-4' }"
      :error="!!errorMessage"
      @blur="handleBlur"
      @input="handleChange"
    >
      <label
        class="text-highlighted peer-focus:text-highlighted peer-placeholder-shown:text-dimmed pointer-events-none absolute -top-2.5 left-0 px-1.5 text-xs font-medium transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-medium"
      >
        <span class="bg-default inline-flex px-1">{{ label }}</span>
      </label>
    </component>
    <span v-if="errorMessage" class="-mt-4 text-xs text-red-500">
      {{ errorMessage }}
    </span>
  </div>
</template>
