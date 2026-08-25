import "server-only"
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set")
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
})
