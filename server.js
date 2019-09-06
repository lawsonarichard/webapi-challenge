const express = require("express");
const server = express();
server.use(express.json());

// Routers
const projectsRouter = require("./projects/projects-router");
server.use("/api/projects", projectsRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Hello Peeps</h2>`);
});

//custom middleware

// function logger(req, res, next) {
// console.log(req.method, req.url, Date.now());
// next();
// }

module.exports = server;
