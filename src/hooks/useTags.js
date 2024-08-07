import { ref } from 'vue';
import apiService from '@/infrastructure/apiService';

const tags = ref([]);
const ultimaTag = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchTags = async () => {
  loading.value = true;
  try {
    const response = await apiService.get('/asociados-tags');
    tags.value = response.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const fetchUltimaTag = async () => {
  try {
    const response = await apiService.get('/ultima-tag');
    ultimaTag.value = response.data;
  } catch (err) {
    error.value = err.message;
  } finally {
  }
};

const agregarTag = async (newTag) => {
  try {
    const response = await apiService.post('/agregar-tag', newTag);
    tags.value.push(response.data); // Opcional, si deseas agregar la nueva tag a la lista actual
  } catch (err) {
    error.value = err.message;
  } finally {
  }
};

export default function useTags() {
  return {
    tags,
    ultimaTag,
    loading,
    error,
    fetchTags,
    fetchUltimaTag,
    agregarTag,
  };
}
