const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

// Create a new Koa app
const app = new Koa()
const router = new Router()
app.use(bodyParser())

// In-memory storage for groceries
let groceries = [
  { id: 1, name: 'Milk' },
  { id: 2, name: 'Eggs' },
  { id: 3, name: 'Bread' }
]
let nextId = 4

// Routes for CRUD operations on groceries
router.get('/api/groceries', (ctx) => {
  ctx.body = groceries
})

router.post('/api/groceries', (ctx) => {
  const { name } = ctx.request.body
  if (!name) {
    ctx.status = 400
    ctx.body = 'Name is required'
    return
  }

  const newGrocery = { id: nextId++, name }
  groceries.push(newGrocery)

  ctx.status = 201
  ctx.body = newGrocery
})

router.put('/api/groceries/:id', (ctx) => {
  const { id } = ctx.params
  const { name } = ctx.request.body
  if (!name) {
    ctx.status = 400
    ctx.body = 'Name is required'
    return
  }

  const grocery = groceries.find((item) => item.id === parseInt(id))
  if (!grocery) {
    ctx.status = 404
    ctx.body = 'Grocery not found'
    return
  }

  grocery.name = name

  ctx.body = grocery
})

router.del('/api/groceries/:id', (ctx) => {
  const { id } = ctx.params

  const index = groceries.findIndex((item) => item.id === parseInt(id))
  if (index === -1) {
    ctx.status = 404
    ctx.body = 'Grocery not found'
    return
  }

  const deletedGrocery = groceries.splice(index, 1)[0]

  ctx.body = deletedGrocery
})

// Attach the router to the app
app.use(router.routes())
app.use(router.allowedMethods())

// Start the server
const server = (port = 3000) =>
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })

module.exports = server
