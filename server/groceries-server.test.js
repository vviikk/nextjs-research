const request = require('supertest')
const app = require('./groceries-server')

describe('Grocery API', () => {
  let server
  let serverAddress

  beforeAll((done) => {
    server = app(0)
    const { port } = server.address()
    serverAddress = `http://localhost:${port}`
    done()
  })
  afterAll((done) => {
    // Close the server after all tests are finished
    server.close(done)
  })

  it('should return the list of groceries', async () => {
    const response = await request(serverAddress).get('/api/groceries')
    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      { id: 1, name: 'Milk' },
      { id: 2, name: 'Eggs' },
      { id: 3, name: 'Bread' }
    ])
  })

  it('should create a new grocery', async () => {
    const newGrocery = { name: 'Apples' }
    const response = await request(serverAddress)
      .post('/api/groceries')
      .send(newGrocery)
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe(newGrocery.name)
  })

  it('should update an existing grocery', async () => {
    const updatedGrocery = { name: 'Cheese' }
    const response = await request(serverAddress)
      .put('/api/groceries/1')
      .send(updatedGrocery)
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(1)
    expect(response.body.name).toBe(updatedGrocery.name)
  })

  it('should delete an existing grocery', async () => {
    const response = await request(serverAddress).del('/api/groceries/1')
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(1)
  })

  it('should return 404 when deleting a non-existent grocery', async () => {
    const response = await request(serverAddress).del('/api/groceries/999')
    expect(response.status).toBe(404)
    expect(response.text).toBe('Grocery not found')
  })
})
