// Common types used across the application

export type Language = 'en' | 'fa'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  featured?: boolean
  order?: number
  contentType?: 'portfolio' | 'discover'
  published?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon?: string
  order?: number
}

export interface Experience {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  description: string
  current: boolean
  order?: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  published: boolean
  tags: string[]
  readTime: number
  createdAt?: string
  updatedAt?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  createdAt: string
}

export interface NavItem {
  key: string
  name: string
  href: string
}

export interface StatCard {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: string
}
