const jsonServer = require("json-server");
const next = require("next");

const { createProxyMiddleware } = require("http-proxy-middleware");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = jsonServer.create();
const router = jsonServer.router("./server/groceries-db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use("/api", router);

app.prepare().then(() => {
  server.listen(3001, () => {
    console.log("JSON Server is running at 3001");
  });

  server.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
    })
  );

  server.all("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
