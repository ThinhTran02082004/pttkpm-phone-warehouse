import { url } from "..";
import {
  checkResponse,
  getToken
} from "../authentication";

export function getRoles() {
  return fetch(url + "/api/roles", {
    method: "GET",
    headers: {
      'authorization': getToken(),
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(checkResponse)
}

export function insertRole(role,) {
  return fetch(url + "/api/roles", {
    method: "POST",
    headers: {
      'authorization': getToken(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(role)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export function updateRole(role,) {
  return fetch(url + "/api/roles", {
    method: "PUT",
    headers: {
      'authorization': getToken(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(role)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export function deleteRole(role,) {
  return fetch(url + "/api/roles", {
    method: "DELETE",
    headers: {
      'authorization': getToken(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(role)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export function getPermissionData() {
  return fetch(url + "/api/roles/permissions", {
    method: "GET",
    headers: {
      'authorization': getToken(),
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(checkResponse)
}

export function getRolePermissions(role,) {
  return fetch(url + `/api/roles/${role}`, {
    method: "GET",
    headers: {
      'authorization': getToken(),
    }
  })
    .then(response => response.json())
    .then(checkResponse)
}

export function insertPermission(data) {
  return fetch(url + `/api/roles/update-permission`, {
    method: "POST",
    headers: {
      'authorization': getToken(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(checkResponse)
}