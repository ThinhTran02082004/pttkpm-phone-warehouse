import { url } from "..";
import {
  checkResponse,
  getToken
} from "../authentication";


export async function getAccounts(token = "") {
  return fetch(url + "/api/accounts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'authorization': getToken(),
    },

  })
    .then(response => response.json())
    .then(checkResponse)
}


export async function insertAccount(account) {
  return fetch(url + "/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'authorization': getToken(),
    },
    body: JSON.stringify(account)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function updateAccount(account) {
  return fetch(url + "/api/accounts", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'authorization': getToken(),
    },
    body: JSON.stringify(account)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function deleteAccount(account) {
  return fetch(url + "/api/accounts", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'authorization': getToken(),
    },
    body: JSON.stringify(account)
  })
    .then(response => response.json())
    .then(checkResponse)
}
