<template>
  <q-checkbox v-model="checked" data-cy="checkbox" />
  <q-toggle v-model="toggled" data-cy="toggle" />

  <q-radio v-model="selected" data-cy="radio-1" val="Value1">Value1</q-radio>
  <q-radio v-model="selected" data-cy="radio-2" val="Value2">Value2</q-radio>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'QuasarCheckboxAndToggle',
  setup() {
    const checked = ref();
    const toggled = ref();
    const selected = ref();

    return {
      checked,
      toggled,
      selected,
    };
  },
});
</script>
