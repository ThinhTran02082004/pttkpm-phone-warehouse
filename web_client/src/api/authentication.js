import { createContext } from "react"
import { url } from "."

export const UserContext = createContext()

export async function checkResponse(response) {
  console.log(response)
  if (response.success || document.location.pathname === '/dang-nhap') return response
  switch (response.message) {
    case 'Action is prohibited':
      document.location.replace('/')
      break
    case 'Invalid Token':
    case 'User is not authenticated.':
      sessionStorage.removeItem('Authorization')
      document.location.replace('/dang-suat')
      break
    default:
      return response
  }
}

export function getToken() {
  if (sessionStorage.getItem('Authorization') === null) return null
  return "Bearer " + sessionStorage.getItem('Authorization')
}

export async function loginAccount({ mail, password }) {
  return await fetch(url + `/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": getToken()
    },
    body: JSON.stringify({ mail, password })
  })
    .then(response => response.json())
    .then(checkResponse)
}

export async function registerAccount({ mail, password }) {
  return await fetch(url + `/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": getToken()
    },
    body: JSON.stringify({ mail, password })
  })
    .then(response => response.json())
    .then(checkResponse)
}

