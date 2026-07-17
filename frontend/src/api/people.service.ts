import type { Person, CreatePerson, Dashboard } from "../types/people";
import { genericRequest } from "../utils/genericRequest";

export function create(data: CreatePerson) {
  return genericRequest<Person>('/api/People', 'POST', data);
}

export function findAll() {
  return genericRequest<Person[]>('/api/People', 'GET');
}

export function findOne(id: string) {
  return genericRequest<Person>(`/api/People/${id}`, 'GET');
}

export function remove(id: string) {
  return genericRequest<void>(`/api/People/${id}`, 'DELETE');
}

export function getDashboard() {
  return genericRequest<Dashboard>('/api/People/dashboard', 'GET');
}