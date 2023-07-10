import BaseService, { BaseServiceOptions } from './BaseService'

// Mock fetch function
const mockFetch = jest.fn()

// Mock response data
const mockResponseData = {
  message: 'Mock data',
}

// Create a mock implementation of the request method
jest.mock('./BaseService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      request: mockFetch,
    }
  })
})

describe('BaseService', () => {
  const baseOptions: BaseServiceOptions = {
    baseURL: 'http://localhost/api',
    slug: '',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Child Service', () => {
    const childService = new BaseService(baseOptions)
    const childOptions: BaseServiceOptions = {
      baseURL: 'http://localhost/api',
      slug: 'posts',
    }
    const nestedService = childService.getNestedService(':postId/comments')

    test('Child service should have the correct base URL', () => {
      expect(childService.buildUrl()).toBe('http://localhost/api/posts')
    })

    test('Nested service should have the correct base URL', () => {
      expect(nestedService.buildUrl()).toBe(
        'http://localhost/api/posts/:postId/comments'
      )
    })

    test('Nested service should make a GET request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      })

      const response = await nestedService.get<any>('')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/posts/:postId/comments',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      expect(response).toEqual(mockResponseData)
    })
  })

  describe('Grandchild Service', () => {
    const parentService = new BaseService(baseOptions)
    const parentOptions: BaseServiceOptions = {
      baseURL: 'http://localhost/api',
      slug: 'posts',
    }
    const childService = parentService.getNestedService(':postId/comments')
    const childOptions: BaseServiceOptions = {
      baseURL: 'http://localhost/api/posts/:postId/comments',
      slug: ':commentId/replies',
    }
    const grandchildService = childService.getNestedService(':replyId')

    test('Parent service should have the correct base URL', () => {
      expect(parentService.buildUrl()).toBe('http://localhost/api/posts')
    })

    test('Child service should have the correct base URL', () => {
      expect(childService.buildUrl()).toBe(
        'http://localhost/api/posts/:postId/comments'
      )
    })

    test('Grandchild service should have the correct base URL', () => {
      expect(grandchildService.buildUrl()).toBe(
        'http://localhost/api/posts/:postId/comments/:commentId/replies/:replyId'
      )
    })

    test('Grandchild service should make a PATCH request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      })

      const requestBody = {
        content: 'Updated reply',
      }

      const response = await grandchildService.patch<any>('', requestBody)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/posts/:postId/comments/:commentId/replies/:replyId',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      )
      expect(response).toEqual(mockResponseData)
    })
  })
})
