import { useState, useCallback } from 'react'
import type { ApiError } from '@/lib/api'

interface UseFetchState<T> {
  data: T | null
  error: ApiError | null
  loading: boolean
}

/**
 * 封装数据请求的通用 hook
 */
export function useFetch<T>() {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    loading: false,
  })

  const execute = useCallback(async (fetcher: () => Promise<T>) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await fetcher()
      setState({ data, error: null, loading: false })
      return data
    } catch (err) {
      const error = err as ApiError
      setState({ data: null, error, loading: false })
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false })
  }, [])

  return { ...state, execute, reset }
}
