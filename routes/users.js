const express = require("express");
const User = require("../schemas/users");
const router = express.Router();
const mongoose = require("mongoose");
const validator = require('../validator');

/* GET users listing. */
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validator.createUserValidator, createUser);
router.put("/:id", validator.createUserValidator, updateUser);
router.delete("/:id", deleteUser);


function getAllUsers(req, res) {

	const users = User.find()
		.select("userName")
		.then((users) => {
			res.json({users})
		})
		.catch(err => console.log(err));
		
}


async function getUserById(req, res, next) {
	console.log("getUserById with id: ", req.params.id);

	if (!req.params.id) {
		res.status(404).send("Id not found");
	}

	console.log(
		"El usuario que se esta intentando de buscar es el que tiene el id: ",
		req.params.id
	);

	const user = await User.findById(req.params.id);

	if (!user) {
		res.status(404).send("user not found");
	}

	res.send(user);
}


function createUser(req, res, next) {
	console.log("createUser: ", req.body);

	const user = new User (req.body);

	user.save()
	.then(result => {
		res.json({
			user: result
		});
	});

	res.send(`User created :  ${user.userName}`);
}


async function deleteUser(req, res) {
	console.log("deleteUser with id: ", req.params.id);

	if (!req.params.id) {
		res.status(500).send("The param id is not defined");
	}
	
	const userToDelete = await User.findById(req.params.id);

	if (!userToDelete) {
		res.status(404).send("user not found");
	}

	await User.deleteOne({ _id: userToDelete._id })

	res.send(`User deleted :  ${req.params.id}`);
}


async function updateUser(req, res) {

	console.log("updateUser with id: ", req.params.id);

	const user = req.body
	const userToUpdate = await User.findById(req.params.id);

	if (!userToUpdate) {
		res.status(404).send("user not found");
	}

    userToUpdate.userName = user.userName
	userToUpdate.password = user.password
    await userToUpdate.save()
	res.send(userToUpdate)

	res.send(`User updated :  ${user.userName}`);
};


module.exports = router;