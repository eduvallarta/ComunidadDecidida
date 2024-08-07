import axios from 'axios';


export async function getBlackList(token: string | null) {
  try {
    const baseURL = process.env.VUE_APP_API_URL;
    const response = await axios.get(`${baseURL}/blacklist/getBlackList`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error al obtener la lista negra');
    }
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message);
  }
}

export async function addBlackListItem(token: string | null, newItem: any) {
  try {
    const baseURL = process.env.VUE_APP_API_URL;
    const response = await axios.post(`${baseURL}/blacklist/addBlackList`, newItem, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error al agregar el nuevo cliente a la lista negra');
    }
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message);
  }
}


export async function updateBlackListItem(token: string | null, updatedItem: any) {
  try {
    const baseURL = process.env.VUE_APP_API_URL;
    const response = await axios.put(`${baseURL}/blacklist/updateBlackList`, updatedItem, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error al actualizar el cliente en la lista negra');
    }
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message);
  }
}


export async function deleteBlackListItem(token: string | null, id: number) {
  try {
    const baseURL = process.env.VUE_APP_API_URL;
    const response = await axios.delete(`${baseURL}/blacklist/deleteBlackList/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error al eliminar el cliente de la lista negra');
    }
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message);
  }
}
