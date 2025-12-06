'use client'

import {
  Cpu,
  Code,
  Database,
  Server,
  GitBranch,
  Terminal,
  LayoutList,
  Rocket,
  User,
  Lock,
  LogOut,
  PlusCircle,
  Edit,
  Trash2,
  Link,
  Save,
  AlertTriangle,
  Menu,
  X,
  Briefcase,
  TrendingUp,
  Mail,
  Layers,
} from 'lucide-react'

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from 'react'

import {
  useUser,
  useClerk,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

type Page = 'portfolio' | 'admin'

interface Project {
  _id: string
  title: string
  link: string
  description: string
}

interface Technology {
  _id: string
  name: string
  iconName: string
}

const ADMIN_EMAILS = ['yws3267@gmail.com']

const isAdminEmail = (email?: string | null) =>
  !!email && ADMIN_EMAILS.includes(email)

const IconMap: { [key: string]: React.FC<any> } = {
  Cpu,
  Code,
  Database,
  Server,
  GitBranch,
  Terminal,
  LayoutList,
  Rocket,
  User,
  Lock,
  LogOut,
  PlusCircle,
  Edit,
  Trash2,
  Link,
  Save,
  AlertTriangle,
  Menu,
  X,
  Briefcase,
  TrendingUp,
  Mail,
  Layers,
}
type IconKey = keyof typeof IconMap

const getIcon = (iconName: string): React.FC<any> => {
  return IconMap[iconName as IconKey] || Code
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  onClick: (href: string) => void
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        onClick(href)
      }}
      className="text-gray-600 hover:text-cyan-600 transition-colors px-2 py-1 rounded-md"
    >
      {children}
    </a>
  )
}

const NAV_LINKS = [
  { href: '#home', label: 'HOME' },
  { href: '#skills', label: 'TECHNOLOGY' },
  { href: '#projects', label: 'PROJECTS' },
  { href: '#contact', label: 'CONTACT' },
]

interface NavbarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  isAdmin: boolean
  onAdminExit: () => Promise<void>
}

const Navbar = ({
  currentPage,
  setCurrentPage,
  isAdmin,
  onAdminExit,
}: NavbarProps) => {
  const { isLoaded, isSignedIn } = useUser()

  const handleScrollLinkClick = (href: string) => {
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.pushState(null, '', href)
      return
    }

    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', href)
    }
  }

  const handleAdminClick = async () => {
    if (!isLoaded) return

    if (currentPage === 'admin') {
      await onAdminExit()
      setCurrentPage('portfolio')
      return
    }

    if (!isSignedIn) {
      alert('먼저 로그인해 주세요.')
      return
    }

    if (!isAdmin) {
      alert('관리자 권한이 없습니다.')
      return
    }

    setCurrentPage('admin')
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <nav className="flex space-x-4 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              onClick={handleScrollLinkClick}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center text-sm font-medium text-gray-700 border px-3 py-1 rounded-lg hover:bg-gray-50">
                <Lock className="w-4 h-4 mr-1" />
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {isAdmin && (
              <button
                onClick={handleAdminClick}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-red-500 transition-colors px-3 py-1 border border-gray-300 rounded-lg bg-gray-50 hover:bg-red-50"
                title={
                  currentPage === 'portfolio'
                    ? '관리자 모드'
                    : '포트폴리오 보기'
                }
              >
                {currentPage === 'portfolio' ? (
                  <>
                    <Lock className="w-4 h-4 mr-1" />
                    Admin
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 mr-1 inline-block rounded-sm border border-gray-400" />
                    Portfolio
                  </>
                )}
              </button>
            )}

            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

interface SectionProps {
  id: string
  title: string
  children: ReactNode
}

const Section = ({ id, title, children }: SectionProps) => (
  <section id={id} className="pt-24 pb-12 min-h-[40vh]">
    <h2 className="text-2xl font-bold border-b-2 border-cyan-600 pb-2 mb-8 text-gray-900">
      {title}
    </h2>
    {children}
  </section>
)

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <div className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
    <h3 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h3>
    <p className="text-sm text-gray-600 mb-4">{project.description}</p>
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-600 hover:text-cyan-700 transition duration-150 text-base font-medium underline flex items-center"
    >
      <Link className="w-4 h-4 mr-1" />
      VIEW PROJECT →
    </a>
  </div>
)

interface PortfolioLayoutProps {
  techStack: Technology[]
  projects: Project[]
  isLoading: boolean
  hasError: boolean
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({
  techStack,
  projects,
  isLoading,
  hasError,
}) => {
  const techItems = techStack.map((tech) => {
    const IconComponent = getIcon(tech.iconName)
    return (
      <div
        key={tech._id}
        className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 transition-transform duration-300 hover:scale-[1.03] shadow-sm border border-gray-200 hover:border-cyan-600"
      >
        <IconComponent className="w-5 h-5 text-cyan-600 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-800">{tech.name}</span>
      </div>
    )
  })

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-semibold">데이터 로딩에 실패.</p>
        <p className="text-gray-500 text-sm">
          백엔드 API 서버를 확인하거나 잠시 후 다시 시도 요망.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <section
        id="home"
        className="min-h-[80vh] flex flex-col justify-center items-center pt-20 pb-8"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-snug text-gray-900">
            PORTFOLIO
          </h1>
          <p className="mt-4 text-base max-w-2xl text-gray-700">
            중부대학교 정보보호학과
          </p>
          <p className="mt-3 text-xl font-semibold text-gray-800">고연우</p>
        </div>
      </section>

      <Section id="skills" title="TECHNOLOGY">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {techItems}
        </div>
      </Section>

      <Section id="projects" title="PROJECTS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </Section>

      <Section id="contact" title="CONTACT">
        <div className="text-gray-500 text-sm flex items-center space-x-4">
          <a
            href="https://github.com/yws3267"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center space-x-1"
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://vercel.com/yws3267s-projects"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center space-x-1"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Vercel</span>
          </a>
        </div>

        <div className="mt-3 text-gray-500 text-sm flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          <span>yws3267@gmail.com</span>
        </div>
      </Section>

      <footer className="py-6 text-center text-xs text-gray-500 border-t border-gray-200 mt-16">
        © 2025 Portfolio. Rebuilt with Next.js & Tailwind CSS.
      </footer>
    </div>
  )
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  currentProject: Project | null
  onSave: (project: Omit<Project, '_id'> & { _id?: string }) => void
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onSave,
}) => {
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const isEditing = !!currentProject

  useEffect(() => {
    if (isOpen && currentProject) {
      setTitle(currentProject.title ?? '')
      setLink(currentProject.link ?? '')
      setDescription(currentProject.description ?? '')
    } else if (isOpen && !currentProject) {
      setTitle('')
      setLink('')
      setDescription('')
    }
    if (!isOpen) {
      setTitle('')
      setLink('')
      setDescription('')
      setError('')
    }
  }, [isOpen, currentProject])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !link.trim() || !description.trim()) {
      setError('모든 정보를 입력해주세요.')
      return
    }

    onSave({
      _id: currentProject?._id,
      title: title.trim(),
      link: link.trim(),
      description: description.trim(),
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {isEditing ? '프로젝트 수정' : '새 프로젝트 추가'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="project-title"
              className="block text-sm font-medium text-gray-700"
            >
              제목
            </label>
            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="프로젝트 이름"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-description"
              className="block text-sm font-medium text-gray-700"
            >
              설명
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 min-h-[70px]"
              placeholder="설명 입력"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-link"
              className="block text-sm font-medium text-gray-700"
            >
              링크 (URL)
            </label>
            <div className="relative">
              <Link className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                id="project-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="https://..."
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition duration-150"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? '변경 사항 저장' : '프로젝트 등록'}
          </button>
        </form>
      </div>
    </div>
  )
}

interface TechnologyModalProps {
  isOpen: boolean
  onClose: () => void
  currentTech: Technology | null
  onSave: (tech: Omit<Technology, '_id'> & { _id?: string }) => void
}

const TechnologyModal: React.FC<TechnologyModalProps> = ({
  isOpen,
  onClose,
  currentTech,
  onSave,
}) => {
  const [name, setName] = useState('')
  const [iconName, setIconName] = useState<IconKey | ''>('')
  const [error, setError] = useState('')
  const isEditing = !!currentTech

  useEffect(() => {
    if (isOpen && currentTech) {
      setName(currentTech.name ?? '')
      setIconName((currentTech.iconName as IconKey) || '')
    } else if (isOpen && !currentTech) {
      setName('')
      setIconName('')
    }
    if (!isOpen) {
      setName('')
      setIconName('')
      setError('')
    }
  }, [isOpen, currentTech])

  if (!isOpen) return null

  const ICON_OPTIONS: { key: IconKey; label: string }[] = useMemo(
    () => [
      { key: 'Code', label: 'Language' },
      { key: 'Server', label: 'Backend' },
      { key: 'Database', label: 'Database' },
      { key: 'GitBranch', label: 'DevOps / Git' },
      { key: 'Terminal', label: 'CLI / Tools' },
      { key: 'Cpu', label: 'System / OS' },
      { key: 'LayoutList', label: 'UI / Design' },
      { key: 'Layers', label: 'Other' },
    ],
    []
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !iconName) {
      setError('기술 이름과 아이콘을 모두 선택.')
      return
    }

    if (!IconMap[iconName]) {
      setError(`선택한 아이콘 "${iconName}"을 찾을 수 없습니다.`)
      return
    }

    onSave({
      _id: currentTech?._id,
      name: name.trim(),
      iconName: iconName as string,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {isEditing ? '기술 스택 수정' : '새 기술 추가'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="tech-name"
              className="block text-sm font-medium text-gray-700"
            >
              기술 이름
            </label>
            <input
              id="tech-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="예: React, Next.js, Python"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              아이콘 선택 (클릭)
            </label>

            <div className="flex items-center space-x-2 mb-2">
              {iconName && IconMap[iconName] && (
                <>
                  {React.createElement(IconMap[iconName], {
                    className: 'w-5 h-5 text-cyan-600',
                  })}
                </>
              )}
              <input
                type="text"
                readOnly
                value={iconName}
                className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700"
                placeholder="아래에서 아이콘을 선택."
              />
            </div>

            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {ICON_OPTIONS.map((opt) => {
                const IconComponent = IconMap[opt.key]
                const selected = iconName === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setIconName(opt.key)}
                    className={`flex flex-col items-center justify-center p-2 rounded-md border text-[11px] ${
                      selected
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                        : 'border-gray-200 hover:border-cyan-400 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition duration-150"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? '변경 사항 저장' : '기술 등록'}
          </button>
        </form>
      </div>
    </div>
  )
}

interface ProjectListProps {
  projects: Project[]
  onAdd: () => void
  onEdit: (project: Project) => void
  onDelete: (_id: string) => void
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          프로젝트 목록 ({projects.length})
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg shadow-md hover:bg-cyan-700 transition duration-150"
        >
          <PlusCircle className="w-5 h-5 mr-2" />새 항목 추가
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <Rocket className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">
            등록된 프로젝트 없음. 새 항목을 추가해주세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150"
            >
              <div className="flex flex-col space-y-1 min-w-0 flex-grow pr-4">
                <span className="text-lg font-medium text-gray-800 truncate">
                  {project.title}
                </span>
                <span className="text-sm text-gray-500 truncate">
                  {project.description}
                </span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-600 flex items-center hover:underline truncate"
                >
                  <Link className="w-3 h-3 mr-1 flex-shrink-0" />
                  {project.link}
                </a>
              </div>
              <div className="space-x-2 flex items-center flex-shrink-0">
                <button
                  onClick={() => onEdit(project)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                  title="수정"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('이 프로젝트를 삭제하시겠습니까?'))
                      onDelete(project._id)
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                  title="삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface TechnologyListProps {
  techStack: Technology[]
  onAdd: () => void
  onEdit: (tech: Technology) => void
  onDelete: (_id: string) => void
}

const TechnologyList: React.FC<TechnologyListProps> = ({
  techStack,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          기술 스택 목록 ({techStack.length})
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg shadow-md hover:bg-cyan-700 transition duration-150"
        >
          <PlusCircle className="w-5 h-5 mr-2" />새 항목 추가
        </button>
      </div>

      {techStack.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <Code className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">
            등록된 기술 스택 없음. 새 항목을 추가해주세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech) => {
            const IconComponent = getIcon(tech.iconName)
            return (
              <div
                key={tech._id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6 text-cyan-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-800">
                    {tech.name}
                  </span>
                </div>
                <div className="space-x-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(tech)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                    title="수정"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('이 기술 스택을 삭제하시겠습니까?'))
                        onDelete(tech._id)
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                    title="삭제"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface AdminPageProps {
  projects: Project[]
  techStack: Technology[]
  handleSaveProject: (project: Omit<Project, '_id'> & { _id?: string }) => void
  handleDeleteProject: (_id: string) => void
  handleSaveTechnology: (
    techData: Omit<Technology, '_id'> & { _id?: string }
  ) => void
  handleDeleteTechnology: (_id: string) => void
}

const AdminPage: React.FC<AdminPageProps> = ({
  projects,
  techStack,
  handleSaveProject,
  handleDeleteProject,
  handleSaveTechnology,
  handleDeleteTechnology,
}) => {
  const [currentTab, setCurrentTab] = useState<'tech' | 'projects'>('projects')
  const [isTechModalOpen, setIsTechModalOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<Technology | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleOpenAddTechModal = () => {
    setEditingTech(null)
    setIsTechModalOpen(true)
  }
  const handleOpenEditTechModal = (tech: Technology) => {
    setEditingTech(tech)
    setIsTechModalOpen(true)
  }
  const handleCloseTechModal = () => {
    setIsTechModalOpen(false)
    setEditingTech(null)
  }

  const handleOpenAddProjectModal = () => {
    setEditingProject(null)
    setIsProjectModalOpen(true)
  }
  const handleOpenEditProjectModal = (project: Project) => {
    setEditingProject(project)
    setIsProjectModalOpen(true)
  }
  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false)
    setEditingProject(null)
  }

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-12 px-4">
      <div className="flex justify-between items-center border-b-4 border-cyan-600 pb-2 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">대시보드</h1>
      </div>

      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setCurrentTab('projects')}
            className={`px-6 py-3 text-lg font-medium transition-colors ${
              currentTab === 'projects'
                ? 'border-b-4 border-cyan-600 text-cyan-600'
                : 'text-gray-500 hover:text-cyan-600'
            }`}
          >
            프로젝트 관리
          </button>
          <button
            onClick={() => setCurrentTab('tech')}
            className={`px-6 py-3 text-lg font-medium transition-colors ${
              currentTab === 'tech'
                ? 'border-b-4 border-cyan-600 text-cyan-600'
                : 'text-gray-500 hover:text-cyan-600'
            }`}
          >
            기술 스택 관리
          </button>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        {currentTab === 'projects' && (
          <ProjectList
            projects={projects}
            onAdd={handleOpenAddProjectModal}
            onEdit={handleOpenEditProjectModal}
            onDelete={handleDeleteProject}
          />
        )}

        {currentTab === 'tech' && (
          <TechnologyList
            techStack={techStack}
            onAdd={handleOpenAddTechModal}
            onEdit={handleOpenEditTechModal}
            onDelete={handleDeleteTechnology}
          />
        )}
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        currentProject={editingProject}
        onSave={handleSaveProject}
      />
      <TechnologyModal
        isOpen={isTechModalOpen}
        onClose={handleCloseTechModal}
        currentTech={editingTech}
        onSave={handleSaveTechnology}
      />
    </div>
  )
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('portfolio')

  const [projects, setProjects] = useState<Project[]>([])
  const [techStack, setTechStack] = useState<Technology[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const EXPRESS_API_BASE_URL =
    process.env.NEXT_PUBLIC_EXPRESS_API_BASE_URL ?? 'http://localhost:5000'

  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()

  const isAdmin = useMemo(() => {
    if (!isLoaded || !isSignedIn) return false
    const email = user?.primaryEmailAddress?.emailAddress
    return isAdminEmail(email)
  }, [isLoaded, isSignedIn, user])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setHasError(false)

      const fetchApi = async <T,>(path: string): Promise<T[]> => {
        try {
          const url = `${EXPRESS_API_BASE_URL}${path}`
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status} from ${url}`
            )
          }
          return (await response.json()) as T[]
        } catch (error) {
          console.error(`Failed to fetch data from ${path}:`, error)
          setHasError(true)
          return [] as T[]
        }
      }

      const [fetchedProjects, fetchedTechStack] = await Promise.all([
        fetchApi<Project>('/projects'),
        fetchApi<Technology>('/technologies'),
      ])

      setProjects(fetchedProjects)
      setTechStack(fetchedTechStack)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const handleApiCall = useCallback(
    async <T,>(url: string, method: string, data?: any): Promise<T> => {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
        })

        if (!response.ok) {
          const errorDetail = await response.text()
          throw new Error(
            `API call failed with status ${response.status} on ${url}. Detail: ${errorDetail}`
          )
        }

        if (method === 'DELETE') {
          return {} as T
        }

        return (await response.json()) as T
      } catch (error) {
        console.error('CRUD API Error:', error)
        alert(
          '데이터 저장/삭제 중 오류 발생. Express 서버와 네트워크를 확인 요망.'
        )
        throw error
      }
    },
    []
  )

  const handleSaveProject = useCallback(
    async (projectData: Omit<Project, '_id'> & { _id?: string }) => {
      const url = `${EXPRESS_API_BASE_URL}/projects`
      try {
        if (projectData._id) {
          await handleApiCall<Project>(
            `${url}/${projectData._id}`,
            'PUT',
            projectData
          )
          setProjects((prev) =>
            prev.map((p) =>
              p._id === projectData._id
                ? {
                    ...p,
                    title: projectData.title,
                    link: projectData.link,
                    description: projectData.description,
                  }
                : p
            )
          )
        } else {
          const newProject = await handleApiCall<Project>(
            url,
            'POST',
            projectData
          )
          setProjects((prev) => [...prev, newProject])
        }
      } catch (e) {
        console.error('프로젝트 저장 실패:', e)
      }
    },
    [handleApiCall]
  )

  const handleDeleteProject = useCallback(
    async (_id: string) => {
      const url = `${EXPRESS_API_BASE_URL}/projects/${_id}`
      try {
        await handleApiCall<{}>(url, 'DELETE')
        setProjects((prev) => prev.filter((p) => p._id !== _id))
      } catch (e) {
        console.error('프로젝트 삭제 실패:', e)
      }
    },
    [handleApiCall]
  )

  const handleSaveTechnology = useCallback(
    async (techData: Omit<Technology, '_id'> & { _id?: string }) => {
      const url = `${EXPRESS_API_BASE_URL}/technologies`
      try {
        if (techData._id) {
          await handleApiCall<Technology>(
            `${url}/${techData._id}`,
            'PUT',
            techData
          )
          setTechStack((prev) =>
            prev.map((t) =>
              t._id === techData._id
                ? {
                    ...t,
                    name: techData.name,
                    iconName: techData.iconName,
                  }
                : t
            )
          )
        } else {
          const newTech = await handleApiCall<Technology>(url, 'POST', techData)
          setTechStack((prev) => [...prev, newTech])
        }
      } catch (e) {
        console.error('기술 스택 변경 실패:', e)
      }
    },
    [handleApiCall]
  )

  const handleDeleteTechnology = useCallback(
    async (_id: string) => {
      const url = `${EXPRESS_API_BASE_URL}/technologies/${_id}`
      try {
        await handleApiCall<{}>(url, 'DELETE')
        setTechStack((prev) => prev.filter((t) => t._id !== _id))
      } catch (e) {
        console.error('Delete Technology Failed:', e)
      }
    },
    [handleApiCall]
  )

  const handleAdminExit = useCallback(async () => {
    await signOut()
  }, [signOut])

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        onAdminExit={handleAdminExit}
      />
      <div className="pt-16">
        {currentPage === 'portfolio' ? (
          <PortfolioLayout
            projects={projects}
            techStack={techStack}
            isLoading={isLoading}
            hasError={hasError}
          />
        ) : isAdmin ? (
          <AdminPage
            projects={projects}
            techStack={techStack}
            handleSaveProject={handleSaveProject}
            handleDeleteProject={handleDeleteProject}
            handleSaveTechnology={handleSaveTechnology}
            handleDeleteTechnology={handleDeleteTechnology}
          />
        ) : (
          <div className="max-w-6xl mx-auto pt-24 pb-12 px-4 text-center text-sm text-red-500">
            관리자 권한 없음. 관리자 계정으로 로그인 필요.
          </div>
        )}
      </div>
    </div>
  )
}
