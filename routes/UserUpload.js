const express = require("express");
const router = express.Router();
const getSyntaxe = require("../parser/syntaxePostgres.js")

const pool = require('../config/db_connect.js');

//Get all users upload
router.get('/userupload', (req, res) =>{
	pool.query('select * from user_upload')
	.then(result => {
		console.log(result.rows);
		res.send(result.rows);
	})
	.catch(err => {
		console.log(err);
		//callback(null);
	});
});

//Get upload from a user
router.get('/userupload/user/:username', (req, res) =>{
	pool.query('select * from user_upload where user_name = \'' + req.params.username + '\'')
	.then(result => {
		console.log(result.rows);
		res.send(result.rows);
	})
	.catch(err => {
		console.log(err);
		//callback(null);
	});
});

//Get upload from a user for a course
router.get('/userupload/user/:username/:course', (req, res) =>{
	pool.query('select * from user_upload where user_name = \'' + req.params.username + '\' and course_id = (select course_id from course_table where course_title = \'' + req.params.course + '\')')
	.then(result => {
		console.log(result.rows);
		res.send(result.rows);
	})
	.catch(err => {
		console.log(err);
		//callback(null);
	});
});

//Get an upload from its id
router.get('/userupload/:id', (req, res) =>{
	pool.query('select * from user_upload where id_upload = \'' + req.params.id + '\'')
	.then(result => {
		console.log(result.rows);
		res.send(result.rows);
	})
	.catch(err => {
		console.log(err);
		//callback(null);
	});
});

//Add a Post
router.post('/userupload', (req, res) =>{
	req.body.sentence = getSyntaxe(req.body.sentence);
	console.log(req.body.sentence);
	pool.query('insert into user_upload values(\'' + req.body.sentence + '\',\'' + req.body.img + '\',' + req.body.course_id + ', DEFAULT,\'' + req.body.user_name + '\')')
	.then(result => {
		console.log(result);
		res.send(result);
	})
	.catch(err => {
		console.log(err);
		//callback(null);
	});
});

//Modify an upload
router.put('/userupload/:id', (req, res)=>{
	pool.query('update user_upload set sentence = \'' + req.body.sentence + '\', img = \'' + req.body.img + '\' where id_upload = ' + req.params.id)
	.then(result => {
		console.log(result);
		res.send(result);
	})
	.catch(err => {
		console.log(err);
		//callback(null);
	});
});

//Delete an upload
router.delete('/userupload/:id', (req, res)=>{
	pool.query('delete from user_upload where id_upload = ' + req.params.id)
	.then(result => {
		console.log(result.rows);
		res.send(result.rows);
	})
	.catch(err => {
		console.log(err);
		//callback(null);
	});
});

module.exports = router