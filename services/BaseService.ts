```
plan
- [x] Add `getNestedService` method to create nested services
- [x] Add `buildUrl` method to build the URL
- [x] Add `request` method to make the request
- [x] Add `get`, `post`, `patch` and `delete` methods to make the requests
- [x] Add `headers` property to set the headers

// Create the base service with the baseURL
const postsService = new BaseService({ baseURL: 'http://localhost/api/posts' });

// Use the base service
console.log(postsService.buildUrl()); // Output: 'http://localhost/api/posts'

// Create a nested service
const commentsService = postsService.getNestedService(':postId/comments');

// Use the nested service
console.log(commentsService.buildUrl()); // Output: 'http://localhost/api/posts/:postId/comments'

```
interface BaseServiceOptions {
  baseURL: string
}

class BaseService {
  private baseURL: string = process.env.BASE_URL || ''
  private headers: Record<string, string>

  constructor(options: BaseServiceOptions) {
    this.baseURL = options.baseURL
    this.headers = {
      'Content-Type': 'application/json',
    }

    // You can set additional headers if needed
    // this.headers['Authorization'] = 'Bearer <your-token>'

    // Bind all methods to the instance to preserve the correct context of `this`
    Object.getOwnPropertyNames(BaseService.prototype)
      .filter((key) => typeof this[key as keyof BaseService] === 'function')
      .forEach((key) => {
        this[key as keyof BaseService] = (
          this[key as keyof BaseService] as Function
        ).bind(this)
      })
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<T> {
    const url = this.buildUrl(endpoint)

    const options: RequestInit = {
      method,
      headers: this.headers,
      body: JSON.stringify(body),
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data: T = await response.json()
    return data
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint)
  }

  public async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>('POST', endpoint, body)
  }

  public async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, body)
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint)
  }

  public getNestedService(nestedEndpoint: string): BaseService {
    const nestedURL = `${this.buildUrl()}/${nestedEndpoint}`
    return new BaseService({ baseURL: nestedURL })
  }
}

export default BaseService
