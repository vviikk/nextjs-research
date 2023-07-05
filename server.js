const groceryServerPort = parseInt(process.env.SERVER_PORT, 10) || 3001
const nextServerPort = parseInt(process.env.PORT, 10) || 3000

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()
const groceryServer = require('./server/groceries-server')

app.prepare().then(() => {
  // Start the grocery server
  groceryServer.listen(groceryServerPort, () => {
    console.log(
      `Grocery server running on http://localhost:${groceryServerPort}`
    )
  })

  // Create a basic HTTP server
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(nextServerPort, (err) => {
    if (err) throw err
    console.log(
      `> Next.js server running on http://localhost:${nextServerPort}`
    )
  })
})
