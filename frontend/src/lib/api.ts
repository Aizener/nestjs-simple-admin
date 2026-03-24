/**
 * RESTful API 封装 - 基于 fetch 的轻度封装
 */

const BASE_URL = '/api'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestConfig extends Omit<RequestInit, 'method' | 'body'> {
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

function buildUrl(path: string, params?: RequestConfig['params']): string {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  if (!params) return url

  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  })
  const query = search.toString()
  return query ? `${url}?${query}` : url
}

async function request<T>(
  method: HttpMethod,
  path: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, body, headers: customHeaders, ...init } = config
  const url = buildUrl(path, params)

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  const options: RequestInit = {
    method,
    headers,
    ...init,
  }

  if (body !== undefined && method !== 'GET') {
    options.body = JSON.stringify(body)
  }

  const res = await fetch(url, options)

  if (!res.ok) {
    const error: ApiError = {
      message: res.statusText,
      status: res.status,
    }
    try {
      const data = await res.json()
      error.message = data.message ?? data.error ?? error.message
      error.code = data.code
    } catch {
      // ignore
    }
    throw error
  }

  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>
  }
  return res.text() as unknown as T
}

export const api = {
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>('GET', path, config),

  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>('POST', path, { ...config, body }),

  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>('PUT', path, { ...config, body }),

  patch: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>('PATCH', path, { ...config, body }),

  delete: <T>(path: string, config?: RequestConfig) =>
    request<T>('DELETE', path, config),
}
