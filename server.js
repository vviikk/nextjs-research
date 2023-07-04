const jsonServer = require('json-server')
const next = require('next')

const { createProxyMiddleware } = require('http-proxy-middleware')

const port = parseInt(process.env.PORT, 10) || 3000
const jsonServerPort = parseInt(process.env.JSON_SERVER_PORT, 10) || 3001
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

console.log('jsonServerPort', process.env.JSON_SERVER_PORT)

const server = jsonServer.create()
const router = jsonServer.router('./server/groceries-db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use('/api', router)

app.prepare().then(() => {
  const runingJsonServer = server.listen(jsonServerPort, () => {
    console.log(`JSON Server is running at http://localhost:${jsonServerPort}`)
  })

  console.log(runingJsonServer.address().port)

  server.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${jsonServerPort}`,
      changeOrigin: true
    })
  )

  server.all('*', (req, res) => handle(req, res))

  const runningServer = server.listen(port, (err) => {
    if (err) throw err
    console.log(
      `> Server ready on http://localhost:${runningServer.address().port}`
    )
  })
})
