import { url } from "..";
import { checkResponse, getToken } from "../authentication";

export async function findImports({ manhacungcap, manhanvien, tungay, denngay, tusotien, densotien }) {
  return fetch(url + `/api/warehouse/import?manhacungcap=${manhacungcap}&manhanvien=${manhanvien}&tungay=${tungay}&denngay=${denngay}&tusotien=${tusotien}&densotien=${densotien}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': getToken(),
    }
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function getFreeImport() {
  return fetch(url + `/api/warehouse/free-import/`, {
    method: 'GET',
    headers: {
      'Authorization': getToken(),
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function findImportProducts({ maphieunhap }, token) {
  return fetch(url + `/api/warehouse/import/${maphieunhap}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'authorization': getToken(),
    }
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function insertImport(imports) {
  return fetch(url + `/api/warehouse/import/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'authorization': getToken(),
    },
    body: JSON.stringify(imports)
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function updateImport(data) {
  return fetch(url + `/api/warehouse/import/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'authorization': getToken(),
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(checkResponse)
}