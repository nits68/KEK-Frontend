<template>
  <q-btn color="positive" data-cy="button" icon="edit" label="test emit" rounded @click="$emit('test')" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QuasarButton',
  emits: { test: () => true },
});
</script>
