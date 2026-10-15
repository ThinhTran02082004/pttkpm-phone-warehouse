import { url } from "..";
import { checkResponse, getToken } from "../authentication";

export async function getCustomers() {
  return fetch(url + '/api/customers', {
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

export async function getCustomerCart({ makhachhang }) {
  return fetch(url + `/api/customers/${makhachhang}`, {
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

export async function insertCustomer(customer) {
  return fetch(url + '/api/customers', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken()
    },
    body: JSON.stringify(customer)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function updateCustomer(customer, token = "") {
  return fetch(url + '/api/customers', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken()
    },
    body: JSON.stringify(customer)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function deleteCustomer(customer, token = "") {
  return fetch(url + '/api/customers', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken()
    },
    body: JSON.stringify(customer)
  })
    .then(response => response.json())
    .then(checkResponse)
}