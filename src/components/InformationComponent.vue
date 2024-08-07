<template>
  <v-app>
    <!-- Header -->
    <v-app-bar app color="white" flat class="elevation-4 large-header">
      <v-row align="center" justify="space-between" class="w-100">
        <v-col>
          <v-img src="@/assets/IMAGOTIPO-02.png" class="logo"></v-img>
        </v-col>
        <v-col cols="auto">
          <v-btn color="#43b0e0" dark @click="logout">Cerrar Sesión</v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <!-- Main Content -->
    <v-card flat class="elevation-2 my-5 stylish-card">
      <v-card-title class="headline stylish-card-title">
        COMUNIDAD DECIDIDA
      </v-card-title>
      <v-card-subtitle class="stylish-card-subtitle">
        Gestión de Clientes de Riesgo
      </v-card-subtitle>
      <v-card-title>
        <v-row align="center" justify="space-between" class="w-100">
          <v-col cols="auto">
            <v-btn color="#43b0e0" dark @click="openDialog">Agregar</v-btn>
          </v-col>
          <v-col>
            <v-text-field
              v-model="search"
              label="Buscar"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <div class="custom-table">
        <table>
          <thead>
            <tr>
              <th @click="sortBy('rfc')">RFC <v-icon small>mdi-chevron-up</v-icon></th>
              <th @click="sortBy('razonSocial')">RAZON SOCIAL <v-icon small>mdi-chevron-up</v-icon></th>
              <th>COMENTARIOS</th>
              <th>NIVEL</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedItems" :key="item.rfc">
              <td>{{ item.rfc }}</td>
              <td>{{ item.razonSocial }}</td>
              <td>{{ item.comentarios }}</td>
              <td>{{ item.nivel }}</td>
              <td>
                <v-icon small @click="editItem(item)" class="edit-icon">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="openDeleteDialog(item)" class="delete-icon">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </table>
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          class="my-4"
          color="primary"
        ></v-pagination>
      </div>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isEdit ? 'Editar Cliente' : 'Agregar Cliente' }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field 
                label="RFC" 
                v-model="editedItem.rfc" 
                @input="validateRFC" 
                maxlength="13"
                style="text-transform: uppercase;"
                required
              ></v-text-field>
              <span v-if="!rfcValid" class="error-message">RFC INCORRECTO.</span>
              <v-text-field label="Razón Social" v-model="editedItem.razonSocial" @input="validateForm" required></v-text-field>
              <v-textarea label="Comentarios" v-model="editedItem.comentarios" @input="validateForm" required></v-textarea>
              <v-select label="Nivel" v-model="editedItem.nivel" :items="['Alto', 'Medio', 'Bajo']" @change="validateForm" required></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
            <v-btn :disabled="!isFormValid" color="blue darken-1" text @click="saveItem">{{ isEdit ? 'Actualizar' : 'Guardar' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <v-icon color="red" large>mdi-alert-circle</v-icon>
            <span class="headline delete-title"> Confirmar Eliminación</span>
          </v-card-title>
          <v-card-text>
            <div>¿Estás seguro que deseas eliminar el cliente?</div>
            <div>RFC: {{ deletedItem.rfc }}</div>
            <div>Razón Social: {{ deletedItem.razonSocial }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDeleteDialog">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="confirmDeleteItem">Confirmar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-app>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBlackList } from '../modules/web/use-blackList';

export default {
  name: 'InformationComponent',
  setup() {
    const { fetchBlackList, addBlackList, updateBlackList, deleteBlackList, loading, result, error } = useBlackList();
    const search = ref('');
    const dialog = ref(false);
    const deleteDialog = ref(false);
    const isEdit = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 5;
    const editedItem = reactive({
      idBlackList: 0,
      rfc: '',
      razonSocial: '',
      comentarios: '',
      nivel: '',
    });
    const deletedItem = reactive({
      idBlackList: 0,
      rfc: '',
      razonSocial: '',
    });

    const rfcValid = ref(true);
    const isFormValid = ref(false);

    const validateRFC = () => {
      const regex = /^[A-Z0-9]+$/;
      rfcValid.value = editedItem.rfc.length >= 12 && editedItem.rfc.length <= 13 && regex.test(editedItem.rfc);
      validateForm();
    };

    const validateForm = () => {
      isFormValid.value = rfcValid.value &&
        editedItem.razonSocial !== '' &&
        editedItem.comentarios !== '' &&
        editedItem.nivel !== '';
    };

    watch([() => editedItem.rfc, () => editedItem.razonSocial, () => editedItem.comentarios, () => editedItem.nivel], validateForm, { immediate: true });

    const headers = ref([
      { text: 'RFC', value: 'rfc', sortable: true },
      { text: 'RAZON SOCIAL', value: 'razonSocial', sortable: true },
      { text: 'COMENTARIOS', value: 'comentarios', sortable: false },
      { text: 'NIVEL', value: 'nivel', sortable: false },
      { text: 'ACCIONES', value: 'acciones', sortable: false },
    ]);

    onMounted(() => {
      fetchBlackList();
    });

    const sortKey = ref('');
    const sortDesc = ref(false);

    const filteredItems = computed(() => {
      const searchTerm = search.value.toUpperCase();
      return result.value && result.value.data ? result.value.data.filter(item =>
        item.rfc.includes(searchTerm) ||
        item.razonSocial.toUpperCase().includes(searchTerm) ||
        item.comentarios.toUpperCase().includes(searchTerm) ||
        item.nivel.toUpperCase().includes(searchTerm)
      ) : [];
    });

    const sortedItems = computed(() => {
      if (!sortKey.value) return filteredItems.value;

      return [...filteredItems.value].sort((a, b) => {
        const result = a[sortKey.value].localeCompare(b[sortKey.value]);
        return sortDesc.value ? -result : result;
      });
    });

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return sortedItems.value.slice(start, end);
    });

    const totalPages = computed(() => Math.ceil(sortedItems.value.length / itemsPerPage));

    const sortBy = key => {
      if (sortKey.value === key) {
        sortDesc.value = !sortDesc.value;
      } else {
        sortKey.value = key;
        sortDesc.value = false;
      }
    };

    const router = useRouter();

    const openDialog = () => {
      isEdit.value = false;
      dialog.value = true;
      resetEditedItem();
    };

    const closeDialog = () => {
      dialog.value = false;
      resetEditedItem();
    };

    const openDeleteDialog = item => {
      deletedItem.idBlackList = item.idBlackList;
      deletedItem.rfc = item.rfc;
      deletedItem.razonSocial = item.razonSocial;
      deleteDialog.value = true;
    };

    const closeDeleteDialog = () => {
      deleteDialog.value = false;
      resetDeletedItem();
    };

    const confirmDeleteItem = async () => {
      await deleteBlackList(deletedItem.idBlackList);
      closeDeleteDialog();
    };

    const saveItem = async () => {
      if (isFormValid.value) {
        if (isEdit.value) {
          await updateBlackList(editedItem);
        } else {
          await addBlackList(editedItem);
        }
        closeDialog();
      } else {
        alert('Todos los campos son obligatorios.');
      }
    };

    const resetEditedItem = () => {
      editedItem.idBlackList = 0;
      editedItem.rfc = '';
      editedItem.razonSocial = '';
      editedItem.comentarios = '';
      editedItem.nivel = '';
      rfcValid.value = true; // resetear la validez del RFC
      validateForm();
    };

    const resetDeletedItem = () => {
      deletedItem.idBlackList = 0;
      deletedItem.rfc = '';
      deletedItem.razonSocial = '';
    };

    const editItem = item => {
      isEdit.value = true;
      editedItem.idBlackList = item.idBlackList;
      editedItem.rfc = item.rfc;
      editedItem.razonSocial = item.razonSocial;
      editedItem.comentarios = item.comentarios;
      editedItem.nivel = item.nivel;
      dialog.value = true;
      validateForm();
    };

    const logout = () => {
      console.log('Cerrando sesión');
      router.push({ name: 'login' });
    };

    return {
      search,
      dialog,
      deleteDialog,
      isEdit,
      editedItem,
      deletedItem,
      headers,
      filteredItems,
      paginatedItems,
      currentPage,
      totalPages,
      openDialog,
      closeDialog,
      openDeleteDialog,
      closeDeleteDialog,
      confirmDeleteItem,
      saveItem,
      editItem,
      logout,
      sortBy,
      loading,
      error,
      rfcValid,
      isFormValid,
      validateRFC,
      validateForm,
    };
  }
};
</script>

<style scoped>
.v-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.v-text-field,
.v-select,
.v-textarea {
  background-color: #f9f9f9;
  border-radius: 8px;
}

.custom-table {
  margin: 20px;
}

.custom-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-table th,
.custom-table td {
  padding: 16px;
  text-align: left;
  cursor: pointer;
}

.custom-table th {
  background-color: #43b0e0;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  user-select: none;
}

.custom-table td {
  border-bottom: 1px solid #e0e0e0;
}

.custom-table tbody tr:hover {
  background-color: #f9f9f9;
}

.v-icon {
  cursor: pointer;
  margin: 0 8px;
}

.edit-icon {
  color: #43b0e0;
}

.edit-icon:hover {
  color: #43b0e0;
}

.delete-icon {
  color: #f44336;
}

.delete-icon:hover {
  color: #d32f2f;
}

.v-app-bar.large-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  min-height: 70px;
}

.logo {
  max-width: 90px;
  height: auto;
  margin-top: 5px;
  border-radius: 8px;
  object-fit: contain;
}

.stylish-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.v-pagination {
  justify-content: center;
}

.stylish-card-title {
  color: #43b0e0;
  font-weight: bold;
  font-size: 34px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 30px;
}

.stylish-card-subtitle {
  color: #666666;
  margin-top: -16px;
  margin-bottom: 16px;
}

.v-btn {
  border-radius: 8px;
}

.v-card-title .headline {
  font-weight: bold;
  font-size: 1.5em;
}

.v-card-title .delete-title {
  color: red;
  font-weight: normal;
}

.v-card-actions .v-btn {
  font-weight: bold;
  text-transform: uppercase;
}

.error-message {
  color: red;
  font-size: 0.75em;
  margin-top: -10px;
}
</style>
