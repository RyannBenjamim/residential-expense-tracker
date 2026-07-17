import { api } from "../api/api";

export const genericRequest = async <T>(url: string, method: string, data?: any): Promise<T> => {
  try {
    const response = await api.request({
      url,
      method,
      data,
    });
    return response.data;
  } catch (error: any) {
    const msg = error?.response?.data?.error || error.message || "Erro desconhecido";
    throw new Error(msg);
  }
}