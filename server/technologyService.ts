// src/api/technologyService.ts
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/technologies'

interface Technology {
  _id: string
  name: string
  category: string
  iconUrl?: string
}

const getTechnologies = async (): Promise<Technology[]> => {
  const response = await axios.get(API_URL)
  return response.data
}

const createTechnology = async (
  techData: Omit<Technology, '_id'>
): Promise<Technology> => {
  const response = await axios.post(API_URL, techData)
  return response.data
}

const updateTechnology = async (
  id: string,
  techData: Omit<Technology, '_id'>
): Promise<Technology> => {
  const response = await axios.put(`${API_URL}/${id}`, techData)
  return response.data
}

const deleteTechnology = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`)
}

export { getTechnologies, createTechnology, updateTechnology, deleteTechnology }
export type { Technology }
