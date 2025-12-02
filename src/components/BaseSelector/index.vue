<template>
  <BaseSelector :t="$t" :baseToken="baseToken" @change="onChange" />
</template>

<script lang="ts" setup>
import { createReactWrapper } from '../ReactWrapper'
import ReactBaseSelector from './reactComponent'

defineProps<{
  baseToken: string;
  onChange: (baseToken: string) => void;
}>();

const BaseSelector = createReactWrapper(ReactBaseSelector)
</script>