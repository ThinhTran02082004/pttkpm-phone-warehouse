import {url} from "..";
import {checkResponse, getToken} from "../authentication";

export async function getReturns() {
  return fetch(url + '/api/returns', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken(),
    }
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function getReturnProducts(maphieudoitra) {
  return fetch(url + `/api/returns/products?maphieudoitra=${maphieudoitra}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken(),
    }
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function insertReturn(returnData) {
  return fetch(url + '/api/returns', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken(),
    },
    body: JSON.stringify(returnData)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function updateReturn(returnData) {
  return fetch(url + '/api/returns', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken(),
    },
    body: JSON.stringify(returnData)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function deleteReturn(returns) {
  return fetch(url + '/api/returns', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': getToken(),
    },
    body: JSON.stringify(returns)
  })
    .then(response => response.json())
    .then(checkResponse)
}

