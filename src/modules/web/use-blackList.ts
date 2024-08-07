import { ref } from 'vue';
import { getBlackList, addBlackListItem, updateBlackListItem, deleteBlackListItem   } from '../infrastructure/blackList';

export function useBlackList() {
  const loading = ref(false);
  const result = ref(null);
  const error = ref<Error | null>(null);

  const fetchBlackList = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = sessionStorage.getItem('authToken');
      result.value = await getBlackList(token);
    } catch (err) {
      error.value = err as Error;
      result.value = null;
    } finally {
      loading.value = false;
    }
  };

  const addBlackList = async (newItem: any) => {
    loading.value = true;
    error.value = null;
    try {
      const token = sessionStorage.getItem('authToken');
      await addBlackListItem(token, newItem);
      await fetchBlackList(); // Refresca la lista después de agregar el nuevo item
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  const updateBlackList = async (updatedItem: any) => {
    loading.value = true;
    error.value = null;
    try {
      const token = sessionStorage.getItem('authToken');
      await updateBlackListItem(token, updatedItem);
      await fetchBlackList(); // Refresca la lista después de actualizar el item
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };


  const deleteBlackList = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const token = sessionStorage.getItem('authToken');
      await deleteBlackListItem(token, id);
      await fetchBlackList(); // Refresca la lista después de eliminar el item
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    result,
    error,
    fetchBlackList,
    addBlackList,
    updateBlackList,
    deleteBlackList,
  };
}
