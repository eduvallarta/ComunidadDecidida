<template>
  <v-app>
    <LoadingOverlay :visible="loading" />
    <v-container>
      <v-card class="pa-5">
        <!-- Botón de Cerrar Sesión -->
        <v-layout row wrap>
          <v-flex xs12 sm3>
            <v-btn color="#43b0e0" dark @click="logout">Cerrar Sesión</v-btn>
          </v-flex>
        </v-layout>
        <!-- Logo -->
        <v-layout justify-center>
          <v-img src="@/assets/comunidad-decidida.png" class="logo"></v-img>
        </v-layout>
        <!-- Títulos -->
        <v-card-title class="headline text-center title">CONTROL DE TAGS PARA ASOCIADOS</v-card-title>
        <v-card-subtitle class="stylish-card-subtitle">
          Gestión de alta y bajas de tarjetas de acceso y APP.
        </v-card-subtitle>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <!-- Sección de Agregar Tag -->
              <v-card class="mb-4">
                <v-btn @click="toggleForm" color="primary" dark block>
                  {{ showForm ? 'Ocultar Formulario' : 'Agregar Tag' }}
                </v-btn>
                <v-form v-if="showForm" @submit.prevent="addTag" class="mt-4">
                  <v-radio-group v-model="tagType" label="Seleccione Tipo de Tag" class="mb-4" @change="handleTagTypeChange">
                    <v-radio value="fisica" class="radio-option">
                      <v-icon>mdi-card-outline</v-icon>
                      <span class="font-weight-bold ml-2">Física</span>
                    </v-radio>
                    <v-radio value="movil" class="radio-option">
                      <v-icon>mdi-cellphone</v-icon>
                      <span class="font-weight-bold ml-2">Móvil</span>
                    </v-radio>
                  </v-radio-group>
                  <template v-if="tagType">
                    <v-text-field
                      v-model="newTag.IDSAE"
                      label="IDSAE"
                      @input="fetchNombreAsociado"
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="newTag.Nombre"
                      label="Nombre del asociado"
                      :disabled="nombreEncontrado"
                      outlined
                      dense
                    ></v-text-field>
                    <p v-if="!nombreEncontrado && newTag.IDSAE" class="warning-text">
                      FAVOR DE INDICAR EL NOMBRE TAL CUAL APARECE EN LA FACTURA.
                    </p>
                    <v-select
                      v-model="newTag.TipoAlta"
                      :items="['TITULAR', 'ADICIONAL', 'REPOSICION', 'PROFESOR']"
                      label="Tipo de Alta"
                      outlined
                      dense
                    ></v-select>
                    <v-text-field
                      v-if="newTag.TipoAlta !== 'REPOSICION'"
                      v-model="newTag.Placa"
                      label="Placa"
                      outlined
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="newTag.Identificador"
                      :label="tagType === 'fisica' ? 'Número de Tag' : 'ID Aplicación'"
                      :disabled="tagType === 'fisica'"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-btn type="submit" color="blue" dark block>Agregar Tag</v-btn>
                </v-form>
              </v-card>
            </v-col>

            <!-- Tarjeta de Información Capturada -->
            <v-col cols="12" md="8" lg="6" v-if="showForm">
              <v-card class="captura-info-card">
                <v-card-title class="captura-info-title">Información Capturada</v-card-title>
                <v-card-text class="captura-info-text">
                  <p><strong>IDSAE:</strong> {{ newTag.IDSAE || 'N/A' }}</p>
                  <p><strong>Nombre del asociado:</strong> {{ newTag.Nombre || 'N/A' }}</p>
                  <p><strong>Tipo de Alta:</strong> {{ newTag.TipoAlta || 'N/A' }}</p>
                  <p v-if="newTag.TipoAlta !== 'REPOSICION'"><strong>Placa:</strong> {{ newTag.Placa || 'N/A' }}</p>
                  <p><strong>{{ tagType === 'fisica' ? 'Número de Tag' : 'ID Aplicación' }}:</strong> {{ newTag.Identificador || 'N/A' }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Sección de Buscadores -->
          <section v-if="!showForm" class="buscadores mb-4">
            <BuscadoresComponent
              :searchQueryIDSAE="searchQueryIDSAE"
              :searchQueryName="searchQueryName"
              @update:searchQueryIDSAE="val => searchQueryIDSAE = val"
              @update:searchQueryName="val => searchQueryName = val"
            />
          </section>

          <!-- Sección de Visualización de Tags -->
          <section class="visualizar-tags">
            <v-row v-if="paginatedTags.length > 0" class="mt-4">
              <v-col v-for="tag in paginatedTags" :key="tag.idAsociado + '-' + tag.etiqueta" cols="12" md="6">
                <v-card :class="{'tag-card-red': tag.activa === 1, 'tag-card': tag.activa === 0}" class="mb-2">
                  <v-row no-gutters>
                    <v-col cols="7" class="tag-info">
                      <v-card-title class="text-h5 font-weight-bold">
                        <v-icon left>mdi-account</v-icon>
                        {{ tag?.nombre || 'N/A' }}
                      </v-card-title>
                      <v-card-subtitle class="text-h6 font-weight-bold">
                        {{ tag?.idsae || 'N/A' }} - {{ tag?.calle || 'N/A' }} - {{ tag?.numInt || 'N/A' }} - {{ tag?.numExt || 'N/A' }} - {{ tag?.etiqueta || 'N/A' }}
                      </v-card-subtitle>
                    </v-col>
                    <v-col cols="5" class="tag-actions">
                      <v-card-title v-if="tag.activa === 0" class="text-h6 font-weight-bold">CANCELACIÓN</v-card-title>
                      <v-tooltip bottom v-if="tag.activa === 0">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @click="openWhatsAppCancel(tag)" color="red" dark icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-whatsapp</v-icon>
                          </v-btn>
                        </template>
                        <span>Cancelar por WhatsApp</span>
                      </v-tooltip>
                      <v-tooltip bottom v-if="tag.activa === 0">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @click="openPhysicalCancel(tag)" color="red" dark icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-account-off-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>Cancelar Físicamente</span>
                      </v-tooltip>
                      <v-tooltip bottom v-if="tag.activa === 1">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @click="viewDetail(tag)" color="green" dark icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>Ver Detalle</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- Dialogs for various actions (not affecting form behavior) -->
          <v-dialog v-model="showWhatsAppModal" max-width="500px">
            <v-card>
              <v-card-title class="headline">Cargar Imagen para Cancelación</v-card-title>
              <v-card-text>
                <v-file-input @change="(event) => handleImageUpload(event, selectedTag)" label="Subir Imagen" outlined dense></v-file-input>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="closeModal" color="blue" dark>Cerrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="showPhysicalModal" max-width="500px">
            <v-card>
              <v-card-title class="headline">Política de Cancelación</v-card-title>
              <v-card-text>
                <p>Este documento explica la política de cancelación. Por favor, firma al final para confirmar la cancelación.</p>
                <canvas ref="signatureCanvas" class="signature-canvas"></canvas>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="clearCanvas" color="blue" dark>Borrar Firma</v-btn>
                <v-btn @click="saveSignature" color="blue" dark>Guardar Firma</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="showDetailModal" max-width="800px">
            <v-card>
              <v-card-title class="headline">Detalle de Cancelación</v-card-title>
              <v-card-text>
                <template v-if="isImage">
                  <v-img :src="selectedTagPdf" width="100%" height="500px" />
                </template>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="!isImage" @click="openPdfInNewTab" color="green" dark>Descargar</v-btn>
                <v-btn @click="closeDetailModal" color="green" dark>Cerrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Custom modals for success messages -->
          <v-dialog v-model="showSuccessModal" persistent max-width="400">
            <v-card>
              <v-card-title class="headline">{{ successMessage }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeSuccessModal">Aceptar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import SignaturePad from 'signature_pad';
import useTags from '@/hooks/useTags';
import apiService from '@/infrastructure/apiService';
import { useRouter } from 'vue-router';
import AltaTagFisicoComponent from '@/components/AltaTagFisicoComponent.vue';
import AltaTagMovilComponent from '@/components/AltaTagMovilComponent.vue';
import BuscadoresComponent from '@/components/BuscadoresComponent.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue'; // Asegúrate de la ruta correcta

export default {
  name: 'TagsView',
  components: {
    AltaTagFisicoComponent,
    AltaTagMovilComponent,
    BuscadoresComponent,
    LoadingOverlay,
  },
  setup() {
    const { tags, ultimaTag, loading, error, fetchTags, fetchUltimaTag, agregarTag } = useTags();

    const newTag = ref({ IDSAE: '', Nombre: '', Identificador: '', Etiqueta: '', TipoAlta: '', Placa: '' });
    const tagType = ref('');
    const nombreEncontrado = ref(true);
    const searchQueryIDSAE = ref('');
    const searchQueryName = ref('');
    const showForm = ref(false);
    const showWhatsAppModal = ref(false);
    const showPhysicalModal = ref(false);
    const showDetailModal = ref(false);
    const showSuccessModal = ref(false); // Nuevo estado para el modal de éxito
    const successMessage = ref(''); // Nuevo estado para el mensaje de éxito
    const signaturePad = ref(null);
    const selectedTagImage = ref('');
    const selectedTag = ref(null);
    const selectedTagPdf = ref('');
    const isImage = ref(false);

    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const filteredTags = computed(() => {
      const searchLowerName = typeof searchQueryName.value === 'string' ? searchQueryName.value.toLowerCase() : '';
      return tags.value.filter(tag => {
        return (
          (searchQueryIDSAE.value && tag.idsae.toString() === searchQueryIDSAE.value) ||
          (searchLowerName && tag.nombre && tag.nombre.toLowerCase().includes(searchLowerName))
        );
      });
    });

    const paginatedTags = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredTags.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredTags.value.length / itemsPerPage.value);
    });

    const ultimaEtiqueta = ref(''); // Nueva constante para almacenar la última etiqueta

    onMounted(async () => {
      console.log('onMounted: llamando a fetchTags y fetchUltimaTag');
      await fetchTags();
      await fetchUltimaTag();
      ultimaEtiqueta.value = ultimaTag.value ? ultimaTag.value.etiqueta : '';
      console.log('onMounted: etiquetas obtenidas', tags.value);
    });

    watch(loading, (newVal) => {
      console.log(`El estado de loading ha cambiado a: ${newVal}`);
    });

    function toggleForm() {
      if (showForm.value) {
        clearForm();
        tagType.value = ''; // Limpiar el radio button
      } else {
        clearSearch();
      }
      showForm.value = !showForm.value;
    }

    async function addTag() {
      if (newTag.value.IDSAE && newTag.value.Nombre && newTag.value.Identificador) {
        const newTagData = {
          IDSAE: newTag.value.IDSAE,
          Identificador: newTag.value.Identificador
        };

        try {
          console.log('addTag: nueva tag', newTagData);
          loading.value = true; // Mostrar loader
          await agregarTag(newTagData);
          showForm.value = false;
          clearForm();
          tagType.value = '';
          await fetchTags();
          successMessage.value = 'Tag agregado exitosamente.';
          showSuccessModal.value = true;
        } catch (err) {
          alert('Error al agregar la tag: ' + err.message);
        } finally {
          console.log('addTag: ocultando loader');
          loading.value = false; // Ocultar loader
        }
      } else {
        alert('Todos los campos son requeridos.');
      }
    }

    function clearForm() {
      newTag.value = { IDSAE: '', Nombre: '', Identificador: '', Etiqueta: '', TipoAlta: '', Placa: '' };
      nombreEncontrado.value = true;
    }

    function clearSearch() {
      searchQueryIDSAE.value = '';
      searchQueryName.value = '';
    }

    function fetchNombreAsociado() {
      const asociado = tags.value.find(tag => tag.idsae.toString() === newTag.value.IDSAE);
      if (asociado) {
        newTag.value.Nombre = asociado.nombre;
        nombreEncontrado.value = true;
      } else {
        newTag.value.Nombre = '';
        nombreEncontrado.value = false;
      }
    }

    async function handleTagTypeChange() {
      clearForm();
      if (tagType.value === 'fisica') {
        loading.value = true; // Mostrar loader
        console.log('handleTagTypeChange: llamando a fetchUltimaTag');
        await fetchUltimaTag();
        newTag.value.Identificador = ultimaTag.value; // Usar la constante en lugar de llamar a la API
        console.log('handleTagTypeChange: ultima tag obtenida', ultimaTag.value);
        loading.value = false; // Ocultar loader
      }
    }

    const signatureCanvas = ref(null);

    watch(showPhysicalModal, newVal => {
      if (newVal === true) {
        if (signatureCanvas.value instanceof HTMLCanvasElement) {
          signaturePad.value = new SignaturePad(signatureCanvas.value);
          drawTestSignature(signaturePad.value);
        }
      }
    });

    function drawTestSignature(pad) {
      pad.clear();
      const context = pad._ctx;
      context.beginPath();
      context.moveTo(30, 50);
      context.lineTo(150, 50);
      context.moveTo(150, 50);
      context.lineTo(120, 90);
      context.moveTo(120, 90);
      context.lineTo(180, 90);
      context.stroke();
    }

    function openWhatsAppCancel(tag) {
      selectedTag.value = tag;
      showWhatsAppModal.value = true;
    }

    function openPhysicalCancel(tag) {
      selectedTag.value = tag;
      showPhysicalModal.value = true;
    }

    async function viewDetail(tag) {
      try {
        loading.value = true; // Mostrar loader
        console.log('viewDetail: llamando a apiService.get para obtener el detalle de cancelación');
        const response = await apiService.get(`/get-cancelacion-wa?id=${tag.idAsociado}&etiqueta=${tag.etiqueta}`);
        selectedTagPdf.value = response.data.path;
        isImage.value = response.data.isImage;
        if (!isImage.value) {
          openPdfInNewTab();
        } else {
          showDetailModal.value = true;
        }
      } catch (err) {
        alert('Error al obtener el recurso de cancelación: ' + err.message);
      } finally {
        console.log('viewDetail: ocultando loader');
        loading.value = false; // Ocultar loader
      }
    }

    function openPdfInNewTab() {
      window.open(selectedTagPdf.value, '_blank');
    }

    async function handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && selectedTag.value) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          loading.value = true; // Mostrar loader
          console.log('handleImageUpload: subiendo imagen');
          await apiService.post(`/upload-cancelacion-wa?id=${selectedTag.value.idsae}&etiqueta=${selectedTag.value.etiqueta}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          successMessage.value = 'Imagen subida exitosamente.';
          showSuccessModal.value = true;
          fetchTags();
          closeModal();
        } catch (err) {
          alert('Error al subir la imagen: ' + err.message);
        } finally {
          console.log('handleImageUpload: ocultando loader');
          loading.value = false; // Ocultar loader
        }
      } else {
        alert('No se ha seleccionado un tag.');
      }
    }

    function clearCanvas() {
      if (signaturePad.value) {
        signaturePad.value.clear();
      }
    }

    async function saveSignature() {
      let base64Image;

      if (signaturePad.value && !signaturePad.value.isEmpty()) {
        const dataUrl = signaturePad.value.toDataURL();
        base64Image = dataUrl.split(',')[1];
      } else {
        // Firma de muestra
        base64Image = 'data:image/png;base64,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'; 
        // Aquí debes colocar la firma de muestra en base64
      }

      try {
        if (!selectedTag.value) {
          selectedTag.value = { idsae: 'sample-id', etiqueta: 'sample-tag' };  // Ajusta esto según los valores esperados
        }

        loading.value = true; // Mostrar loader
        console.log('saveSignature: guardando firma');
        await apiService.post(
          `/upload-firma?id=${selectedTag.value.idsae}&etiqueta=${selectedTag.value.etiqueta}`,
          { FirmaBase64: base64Image },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        successMessage.value = 'Firma guardada exitosamente.';
        showSuccessModal.value = true;
        fetchTags();
        closeModal();
      } catch (err) {
        alert('Error al guardar la firma: ' + err.message);
      } finally {
        console.log('saveSignature: ocultando loader');
        loading.value = false; // Ocultar loader
      }
    }

    function closeModal() {
      showWhatsAppModal.value = false;
      showPhysicalModal.value = false;
    }

    function closeDetailModal() {
      showDetailModal.value = false;
    }

    function closeSuccessModal() {
      showSuccessModal.value = false;
      fetchTags(); // Opcional, actualizar los tags después de cerrar el modal
    }

    function handleSearch() {
      currentPage.value = 1;
    }

    const router = useRouter();

    const logout = () => {
      router.push({ name: 'login' });
    };

    watch([searchQueryIDSAE, searchQueryName], handleSearch);

    return {
      searchQueryIDSAE,
      searchQueryName,
      paginatedTags,
      currentPage,
      totalPages,
      itemsPerPage,
      openWhatsAppCancel,
      openPhysicalCancel,
      viewDetail,
      showWhatsAppModal,
      showPhysicalModal,
      showDetailModal,
      handleImageUpload,
      saveSignature,
      clearCanvas,
      closeModal,
      closeDetailModal,
      closeSuccessModal, // Añadir esta línea
      showSuccessModal, // Añadir esta línea
      successMessage, // Añadir esta línea
      signaturePad,
      addTag,
      newTag,
      showForm,
      toggleForm,
      tags,
      loading,
      error,
      fetchTags,
      selectedTagImage,
      selectedTagPdf,
      isImage, // Añadir esta línea
      openPdfInNewTab, // Añadir esta línea
      logout,
      tagType,
      fetchNombreAsociado,
      nombreEncontrado,
      fetchUltimaTag,
      handleTagTypeChange,
      ultimaEtiqueta
    };
  },
};
</script>

<style scoped>
.signature-canvas {
  border: 2px solid #ccc;
  border-radius: 8px;
  touch-action: none;
  width: 100%;
  height: 150px;
}

.tag-card {
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
  position: relative;
  overflow: hidden;
}

.tag-card-red {
 	background-color: rgba(255, 0, 0, 0.9);
	color: white;
	position: relative;
	overflow: hidden;
}

.tag-card::before {
  content: "";
  background: url('@/assets/comunidad-decidida.png') center center / 90% no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50%;
  opacity: 0.2;
  z-index: 0;
}

.tag-card > * {
  position: relative;
  z-index: 1;
}

.title {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  color: #1976D2;
  font-weight: 700;
}

.search-fields {
  justify-content: space-between;
}

.tag-info {
  padding-right: 20px;
}

.tag-actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.v-dialog__content {
  overflow-y: auto;
  max-height: 100vh;
}

iframe {
  width: 100%;
  height: 800px;
  border: none;
}

.logo {
  max-width: 300px;
  height: auto;
  margin: auto;
  border-radius: 40px;
  object-fit: contain;
}

.agregar-tag,
.buscadores,
.visualizar-tags {
  margin-bottom: 20px;
}

.radio-option {
  display: flex;
  align-items: center;
  margin-left: 70px; /* Ajusta este valor según sea necesario */
}

.captura-info-card {
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background-color: #f5f5f5;
  background-image: url('@/assets/comunidad-decidida.png');
  background-size: 0%;
  background-position: center;
 	background-repeat: no-repeat;
  opacity: 1;
  transition: all 0.3s ease-in-out;
}

.captura-info-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/comunidad-decidida.png') center center / 90% no-repeat;
  opacity: 0.1;
  z-index: 0;
}

.captura-info-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.captura-info-title {
  font-size: 1.2rem;
  color: #000;
  font-weight: bold;
  text-align: left;
}

.captura-info-text {
  text-align: left;
  font-size: 1rem;
  color: #000;
}

.captura-info-card p {
  margin: 0.5rem 0;
}

.captura-info-card p strong {
  font-weight: bold;
  color: #000;
}

.warning-text {
  color: red;
  font-weight: bold;
}

.v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.5); /* Ajusta esto para ver el overlay más claro u oscuro */
}
</style>