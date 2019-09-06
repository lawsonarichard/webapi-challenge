const express = require("express");
const router = express.Router();
router.use(express.json());

const actModel = require("../data/helpers/actionModel");
const proModel = require("../data/helpers/projectModel");
router.get("/", (req, res) => {
  proModel
    .get()
    .then(project => {
      res.status(200).json(project);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Cannot get projects" });
    });
});

router.get("/:id", validateId, (req, res) => {
  const { id } = req.params;
  proModel.get(id).then(project => {
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(401).json({ error: "Project with this ID does not exist" });
    }
  });
});

router.delete("/:id", validateId, (req, res) => {
  const { id } = req.params;
  proModel
    .remove(id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error deleting Project" });
    });
});

router.put("/:id", validateId, (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const { name } = req.body;
  proModel
    .update(id, { description }, { name })
    .then(() => {
      proModel
        .get(id)
        .then(project => res.status(200).json(project))
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "Error getting Project" });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error updating Project" });
    });
});

// custom middleware

function validateId(req, res, next) {
  const { id } = req.params.id;
  proModel.get(id).then(project => {
    if (project) {
      next();
    } else {
      res.status(404).json({ error: "Project with this id does not exist" });
    }
  });
}

module.exports = router;
