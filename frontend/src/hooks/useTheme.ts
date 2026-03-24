import { useEffect } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'

/**
 * 应用主题到 document，监听系统主题变化
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const isDark = mq.matches
      document.documentElement.classList.toggle('dark', isDark)
      useThemeStore.setState({ resolvedTheme: isDark ? 'dark' : 'light' })
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return { theme, setTheme, resolvedTheme }
}
