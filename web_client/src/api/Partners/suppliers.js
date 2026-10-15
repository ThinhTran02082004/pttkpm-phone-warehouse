import { url } from "..";
import { checkResponse, getToken } from "../authentication";

export async function getSuppliers(token = '') {
  return fetch(url + '/api/suppliers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': getToken()
    }
  })
    .then(res => res.json())
    .then(checkResponse)
}

export async function getSupplierCart({ manhacungcap }) {
  return fetch(url + `/api/customers/${manhacungcap}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken()
    }
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function insertSupplier(supplier, token = '') {
  return fetch(url + '/api/suppliers', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken()
    },
    body: JSON.stringify(supplier)
  })
    .then(res => res.json())
    .then(checkResponse)
}

export async function updateSupplier(supplier, token = '') {
  console.log(supplier)
  return fetch(url + '/api/suppliers', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken()
    },
    body: JSON.stringify(supplier)
  })
    .then(res => res.json())
    .then(checkResponse)
}

export async function deleteSupplier(supplier, token = '') {
  return fetch(url + '/api/suppliers', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken()
    },
    body: JSON.stringify(supplier)
  })
    .then(res => res.json())
    .then(checkResponse)
}