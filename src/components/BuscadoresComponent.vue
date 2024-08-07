<template>
  <v-row class="mt-4 search-fields">
    <v-col cols="12" md="6">
      <v-text-field 
        v-model="localSearchQueryIDSAE" 
        @input="updateIDSAE" 
        label="Buscar por IDSAE" 
        outlined 
        dense 
        prepend-inner-icon="mdi-magnify" 
        class="search-field">
      </v-text-field>
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field 
        v-model="localSearchQueryName" 
        @input="updateName" 
        label="Buscar por Nombre" 
        outlined 
        dense 
        prepend-inner-icon="mdi-magnify" 
        class="search-field">
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'BuscadoresComponent',
  props: {
    searchQueryIDSAE: {
      type: String,
      required: true,
    },
    searchQueryName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localSearchQueryIDSAE: this.searchQueryIDSAE,
      localSearchQueryName: this.searchQueryName,
    };
  },
  watch: {
    searchQueryIDSAE(newVal) {
      this.localSearchQueryIDSAE = newVal;
    },
    searchQueryName(newVal) {
      this.localSearchQueryName = newVal;
    },
  },
  methods: {
    updateIDSAE() {
      this.$emit('update:searchQueryIDSAE', this.localSearchQueryIDSAE);
    },
    updateName() {
      this.$emit('update:searchQueryName', this.localSearchQueryName);
    }
  }
};
</script>

<style scoped>
.search-field {
  background-color: #f5f5f5;
  border-radius: 25px;
  padding: 10px;
}
</style>
