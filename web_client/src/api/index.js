import { v4 } from "uuid"

export const url = ''

export async function wait(s) {
  return new Promise(a => setTimeout(a, s * 1000))
}

