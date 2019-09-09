const express = require("express");
const router = express.Router();

const actModel = require("../data/helpers/actionModel");

router.get("/", (req, res) => {
  actModel
    .get()
    .then(project => {
      res.status(200).json(project);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Cannot get actions" });
    });
});

router.get("/:id", validateId, (req, res) => {
  const { id } = req.params;
  actModel.get(id).then(action => {
    if (action) {
      res.status(200).json(action);
    } else {
      res.status(401).json({ error: "Action with this ID does not exist" });
    }
  });
});

router.delete("/:id", validateId, (req, res) => {
  const { id } = req.params;
  actModel
    .remove(id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error deleting Action" });
    });
});

router.put("/:id", validateId, validatePost, (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const { notes } = req.body;
  const { completed } = req.body;
  actModel
    .update(id, { description }, { notes }, { completed })
    .then(() => {
      actModel
        .get(id)
        .then(action => res.status(200).json(action))
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "Error getting Action" });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error updating Action" });
    });
});

// custom middleware

function validateId(req, res, next) {
  const { id } = req.params.id;
  actModel.get(id).then(action => {
    if (action) {
      next();
    } else {
      res.status(404).json({ error: "Action with this id does not exist" });
    }
  });
}

function validatePost(req, res, next) {
  const { id } = req.params;
  const { description } = req.body;
  const { notes } = req.body;
  if (!req.body) {
    return res.status(400).json({ error: "Action requires body" });
  }
  if (!description) {
    return res.status(400).json({ error: "Action requires description" });
  }
  if (!notes) {
    return res.status(400).json({ error: "Action requires notes" });
  }
  req.body = { id, description, notes };
  next();
}
module.exports = router;
