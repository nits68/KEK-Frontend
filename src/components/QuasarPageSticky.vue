<template>
  <q-page-sticky :offset="[18, 18]" position="bottom-right">
    <q-btn color="accent" data-cy="button" icon="arrow_forward" rounded>
      {{ title }}
    </q-btn>
  </q-page-sticky>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QuasarPageSticky',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>
