import axios from 'axios'

const API_URL = '/api/projects'

interface Project {
  _id: string
  title: string
  link: string
  description: string
}

const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('프로젝트 조회 실패:', error)
    throw error
  }
}

const createProject = async (
  projectData: Omit<Project, '_id'>
): Promise<Project> => {
  try {
    const response = await axios.post(API_URL, projectData)
    return response.data
  } catch (error) {
    console.error('프로젝트 생성 실패:', error)
    throw error
  }
}

const updateProject = async (
  id: string,
  projectData: Omit<Project, '_id'>
): Promise<Project> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, projectData)
    return response.data
  } catch (error) {
    console.error('프로젝트 수정 실패:', error)
    throw error
  }
}

const deleteProject = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`)
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error)
    throw error
  }
}

export { getProjects, createProject, updateProject, deleteProject }
export type { Project }
