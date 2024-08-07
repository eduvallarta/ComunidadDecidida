<template>
  <div v-if="visible" class="loading-overlay">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
