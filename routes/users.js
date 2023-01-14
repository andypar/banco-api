var express = require("express");
const User = require("../schemas/users");
var router = express.Router();
const mongoose = require("mongoose");


/* GET users listing. */
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
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
		"El usuario que se esta intentando de buscar es el qeu tiene el id: ",
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

	// TODO: create user
	user.save()
	.then(result => {
		res.json({
			user: result
		});
	});

	res.send(`User created :  ${user.userName}`);
}

function deleteUser(req, res, next) {
	console.log("deleteUser with id: ", req.params.id);

	if (!req.params.id) {
		res.status(500).send("The param id is not defined");
	}
	// TODO: delete user

	res.send(`User deleted :  ${req.params.id}`);
}

function updateUser(req, res, next) {
	console.log("updateUser with id: ", req.params.id);

	const user = req.body;

	// TODO: update user

	res.send(`User updated :  ${user.email}`);
}

module.exports = router;