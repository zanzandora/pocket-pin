<script setup lang="ts">
import { CENTER_VI } from '~/libs/constant'

const colorMode = useColorMode()
const style = computed(() =>
  colorMode.value === 'dark'
    ? '/styles/dark.json'
    : 'https://tiles.openfreemap.org/styles/liberty',
)
const zoom = 5
</script>

<template>
  <MglMap :map-style="style" :center="CENTER_VI" :zoom="zoom">
    <MglNavigationControl />
  </MglMap>
</template>
