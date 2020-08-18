const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const verifyId = (req, res, next) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).send();
  }

  return next();
}

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  if (!title || !url || !techs) {
    return res.status(400).send();
  }

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepo);

  return res.json(newRepo);
});

app.put("/repositories/:id", verifyId, (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  if (!Object.values(req.body).length) {
    return res.status(400).send();
  }

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if (indexRepo < 0) {
    return res.status(404).json({ error: "Repository not found" });
  }

  title ? repositories[indexRepo].title = title : "";
  url ? repositories[indexRepo].url = url : "";
  techs ? repositories[indexRepo].techs = techs : "";

  return res.json(repositories[indexRepo]);
});

app.delete("/repositories/:id", verifyId, (req, res) => {
  const { id } = req.params;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if (indexRepo < 0) {
    return res.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(indexRepo, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", verifyId, (req, res) => {
  const { id } = req.params;

  const indexRepo = repositories.findIndex(repo => repo.id === id);

  if (indexRepo < 0) {
    return res.status(404).json({ error: "Repository not found" });
  }

  repositories[indexRepo].likes += 1;

  return res.json(repositories[indexRepo]);
});

module.exports = app;
