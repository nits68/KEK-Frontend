<template>
  <q-card :dark="$q.dark.isActive" data-cy="dark-card"> {{ $q.dark.isActive ? 'Dark ' : 'Light' }} content </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QuasarDark',
});
</script>
