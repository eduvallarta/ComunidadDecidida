<template>
  <div>
    <v-text-field v-model="newTag.Nombre" label="Nombre del asociado" outlined dense class="mb-4"></v-text-field>
    <v-text-field v-model="newTag.NumeroTag" label="Número de Tag" outlined dense class="mb-4"></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'AltaTagFisicoComponent',
  props: {
    newTag: {
      type: Object,
      required: true,
    },
  },
};
</script>
