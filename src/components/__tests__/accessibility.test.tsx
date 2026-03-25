import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock framer-motion to render plain elements
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      // Return a component that renders the HTML element
      return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const Element = prop as keyof JSX.IntrinsicElements
        // Filter out framer-motion specific props
        const { initial, animate, variants, transition, whileHover, whileTap, ...htmlProps } = props as Record<string, unknown>
        void initial; void animate; void variants; void transition; void whileHover; void whileTap;
        return <Element {...htmlProps as Record<string, unknown>}>{children}</Element>
      }
    }
  }),
  AnimatePresence: ({ children }: React.PropsWithChildren) => children,
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light' }),
}))

// Mock page animation
vi.mock('@/lib/page-animation', () => ({
  usePageAnimation: () => true,
}))

describe('Navigation accessibility', () => {
  it('has aria-label on nav element', async () => {
    const { Navigation } = await import('@/components/navigation')
    const { container } = render(<Navigation />)
    const nav = container.querySelector('nav')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('has aria-current on active link', async () => {
    const { Navigation } = await import('@/components/navigation')
    render(<Navigation />)
    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  it('has role=separator on decorative divider', async () => {
    const { Navigation } = await import('@/components/navigation')
    const { container } = render(<Navigation />)
    const separator = container.querySelector('[role="separator"]')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('Particle background accessibility', () => {
  it('has aria-hidden and role=presentation on canvas', async () => {
    const { ParticleBackground } = await import('@/components/particle-background')
    const { container } = render(<ParticleBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas).toHaveAttribute('role', 'presentation')
  })
})

describe('Section accessibility', () => {
  it('hero section has aria-label', async () => {
    const { Hero } = await import('@/components/sections/hero')
    const { container } = render(<Hero shouldAnimate={false} />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-label', 'Introduction')
  })

  it('experience section has aria-label', async () => {
    const { Experience } = await import('@/components/sections/experience')
    const { container } = render(<Experience shouldAnimate={false} />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-label', 'Work experience')
  })

  it('skills section has aria-label', async () => {
    const { Skills } = await import('@/components/sections/skills')
    const { container } = render(<Skills shouldAnimate={false} />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-label', 'Skills')
  })

  it('education section has aria-label', async () => {
    const { Education } = await import('@/components/sections/education')
    const { container } = render(<Education shouldAnimate={false} />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-label', 'Education')
  })

  it('external links indicate they open in new tab', async () => {
    const { Hero } = await import('@/components/sections/hero')
    render(<Hero shouldAnimate={false} />)
    const githubLink = screen.getByLabelText('GitHub (opens in new tab)')
    expect(githubLink).toBeInTheDocument()
    const linkedinLink = screen.getByLabelText('LinkedIn (opens in new tab)')
    expect(linkedinLink).toBeInTheDocument()
  })
})
