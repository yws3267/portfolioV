'use client'

import React from 'react'
import { Lock } from 'lucide-react'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'

type Page = 'portfolio' | 'admin'

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

export default function Navbar({
  currentPage,
  setCurrentPage,
  isAdmin,
  onAdminExit,
}: NavbarProps) {
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

    // 이미 관리자 페이지면 → 포트폴리오로 복귀 + 로그아웃
    if (currentPage === 'admin') {
      await onAdminExit()
      setCurrentPage('portfolio')
      return
    }

    // 관리자 페이지 진입: 로그인 + 관리자 계정 둘 다 필요
    if (!isSignedIn) {
      // 로그인 안 되어 있으면: 아래 SignInButton이 대신 처리하므로 여기서는 막기만
      alert('로그인이 필요합니다.')
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
          {/* 항상 이 자리에 하나의 버튼만:
              - 로그아웃 상태: Sign in
              - 로그인+관리자: Admin/Portfolio 토글 버튼 */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center text-sm font-medium text-gray-700 border px-3 py-1 rounded-lg hover:bg-gray-50">
                <Lock className="w-4 h-4 mr-1" />
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {isAdmin ? (
              <>
                {/* 관리자 계정이면: Admin/Portfolio 토글 버튼 + 오른쪽에 UserButton */}
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
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              // 일반 계정이면: Admin 버튼 없이 UserButton만
              <UserButton afterSignOutUrl="/" />
            )}
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
