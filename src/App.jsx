import React, { useState, useEffect } from 'react'
import { Briefcase, Code, Link, Github, Zap } from 'lucide-react'

/**
 * @typedef {object} Project
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {string} liveUrl
 * @property {string} githubUrl
 * @property {string[]} technologies
 * @property {string} imageUrl
 * @property {boolean} isFeatured
 */

/**
 * @typedef {object} Technology
 * @property {string} _id
 * @property {string} name
 * @property {string} category
 * @property {string} [iconUrl]
 */

const App = () => {
  const [projects, setProjects] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = 'http://localhost:5000/api'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const projectsResponse = await fetch(`${API_BASE_URL}/projects`)
        if (!projectsResponse.ok) {
          throw new Error('프로젝트 데이터 호출 실패.')
        }
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)

        const technologiesResponse = await fetch(`${API_BASE_URL}/technologies`)
        if (!technologiesResponse.ok) {
          throw new Error('기술 스택 데이터를 호출 실패.')
        }
        const technologiesData = await technologiesResponse.json()
        setTechnologies(technologiesData)
      } catch (err) {
        console.error('API 호출 오류:', err)
        setError('서버가 실행 확인 필요.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-medium text-blue-600">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-red-300">
          <h1 className="text-2xl font-bold text-red-600 mb-2">연결 오류</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  const groupedTechnologies = technologies.reduce((acc, tech) => {
    const category = tech.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(tech)
    return acc
  }, {})

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="h-48 overflow-hidden">
        <img
          src={
            project.imageUrl ||
            'https://placehold.co/600x400/CCCCCC/333333?text=No+Image'
          }
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          {project.title}
          {project.isFeatured && (
            <Zap className="w-5 h-5 ml-2 text-yellow-500 fill-yellow-500" />
          )}
        </h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex space-x-4 pt-3 border-t border-gray-100">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Link className="w-4 h-4 mr-1" /> 라이브
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4 mr-1" /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )

  const TechnologySection = () => (
    <section className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
        <Code className="w-7 h-7 mr-3 text-blue-600" />
        기술 스택
      </h2>

      {Object.entries(groupedTechnologies).map(([category, techList]) => (
        <div key={category} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-blue-100 pb-1">
            {category}
          </h3>
          <div className="flex flex-wrap gap-4">
            {techList.map((tech) => (
              <div
                key={tech._id}
                className="flex items-center p-3 bg-white rounded-lg shadow-md border border-gray-100 transition-transform hover:scale-105"
              >
                {tech.iconUrl ? (
                  <img
                    src={tech.iconUrl}
                    alt={tech.name}
                    className="w-6 h-6 mr-3 rounded"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = `https://placehold.co/50x50/DDDDDD/333333?text=${tech.name.substring(
                        0,
                        1
                      )}`
                    }}
                  />
                ) : (
                  <span className="w-6 h-6 mr-3 flex items-center justify-center bg-gray-200 text-gray-600 font-bold rounded text-xs">
                    {tech.name.substring(0, 0)}
                  </span>
                )}
                <span className="font-medium text-gray-800">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {technologies.length === 0 && <p className="text-gray-500">추가 요함</p>}
    </section>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900">포트폴리오</h1>
          <nav>
            <a
              href="#projects"
              className="text-gray-600 hover:text-blue-600 font-medium px-4"
            >
              Projects
            </a>
            <a
              href="#technologies"
              className="text-gray-600 hover:text-blue-600 font-medium px-4"
            >
              Skills
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16 py-12 bg-white rounded-2xl shadow-xl">
          <div className="inline-block p-4 bg-blue-500 rounded-full mb-4">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            개발자 [고연우]
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Node.js, MongoDB 등을 기반으로 백엔드 시스템 구축
          </p>
        </section>

        <section id="projects" className="pt-10 border-t border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
            <Briefcase className="w-7 h-7 mr-3 text-blue-600" />
            주요 프로젝트
          </h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">추가 요함</p>
          )}
        </section>

        <div id="technologies">
          <TechnologySection />
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} [고연우]. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
