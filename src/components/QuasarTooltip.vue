<template>
  <q-btn color="primary" data-cy="button">
    Button
    <q-tooltip v-model="showTooltip" class="bg-red" data-cy="tooltip" :offset="[10, 10]"> Here I am! </q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'QuasarTooltip',
  setup() {
    const showTooltip = ref(true);

    return {
      showTooltip,
    };
  },
});
</script>
