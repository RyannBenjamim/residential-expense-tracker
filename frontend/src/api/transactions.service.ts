import type { Transaction, CreateTransaction } from "../types/transactions";
import { genericRequest } from "../utils/genericRequest";

export function create(data: CreateTransaction) {
  return genericRequest<Transaction>('/api/Transactions', 'POST', data);
}

export function findAll() {
  return genericRequest<Transaction[]>('/api/Transactions', 'GET');
}

export function findOne(id: string) {
  return genericRequest<Transaction>(`/api/Transactions/${id}`, 'GET');
}

export function findByPersonId(personId: string) {
  return genericRequest<Transaction[]>(`/api/Transactions/person/${personId}`, 'GET');
}

export function remove(id: string) {
  return genericRequest<void>(`/api/Transactions/${id}`, 'DELETE');
}