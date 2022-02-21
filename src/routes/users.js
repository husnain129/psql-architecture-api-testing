const express = require("express");
const UserRepo = require("../repos/user-repos");
const router = express.Router();

router.get("/users", async function getAllUsers(req, res) {
  const users = await UserRepo.find();
  res.send(users);
});

router.post("/user", async function addUser(req, res) {
  const { bio, username } = req.body;
  try {
    const user = await UserRepo.addUser(bio, username);
    res.send(user);
  } catch (error) {
    res.send("something went wrong", error.message);
  }
});

router.get("/user/:id", async function getOneUser(req, res) {
  const { id } = req.params;
  const user = await UserRepo.findOne(id);
  res.send(user);
});

router.put("/user/:id", async function updateUser(req, res) {
  const { id } = req.params;
  const { bio, username } = req.body;
  const user = await UserRepo.updateOne(id, bio, username);
  res.send(user);
});

router.delete("/user/:id", async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await UserRepo.delete(id);
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
