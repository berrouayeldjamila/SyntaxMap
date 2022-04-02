// import mistakeQuestion ressources
const MistakeQuestion = require('../modules/Ressources.MistakeQuestion/MistakeQuestion.js');
const MistakeQuestionService = require('../modules/Ressources.MistakeQuestion/MistakeQuestionService.js');

// import decoder jwt
const jwtDecode = require("jwt-decode");

// import passport
//var passport = require('../../config/passport');

//import ErrorObject
const ErrorObject = require('../modules/error/ErrorObject.js');

module.exports = (app) => {
	
var mistakeQuestionService = new MistakeQuestionService();

	//Get all mistakeQuestion
	app.get('/mistakeQuestion', (req, res) =>{
		mistakeQuestionService.SELECT({},(mistakeQuestions) => {
			if (mistakeQuestions.code) {
				res.status(406).end();
				return;
			} else {
				let results = [];
				mistakeQuestions.forEach(item => { results.push(item.toObject(true, true, true));})
				res.status(200).json({'mistakeQuestions': results});
			}
		})
	});

	//Get a mistakeQuestion from a user
	app.get('/mistakeQuestion/user', (req, res) =>{
		let criteria = {
			user_id:  jwtDecode(req.get('Authorization').split(' ')[1]).sub.toString()
		};
		console.log(req.body);
		mistakeQuestionService.SELECT(criteria,(mistakeQuestions) => {
			if (mistakeQuestions.code) {
				res.status(406).end();
				return;
			} else {
				let results = [];
				mistakeQuestions.forEach(item => { results.push(item.toObject(true, true, true));})
				res.status(200).json({'mistakeQuestions': results});
			}
		})
	});

	//Add a mistakeQuestion
	app.post('/mistakeQuestion', (req, res) =>{
		//console.log(req.body);
		let bodyNewMistakeQuestion = new MistakeQuestion(null, null, req.body);
		bodyNewMistakeQuestion.user_id = jwtDecode(req.get('Authorization').split(' ')[1]).sub.toString();
		mistakeQuestionService.INSERT(bodyNewMistakeQuestion, (newMistakeQuestion) => {
			console.log(newMistakeQuestion);
			if (newMistakeQuestion.code) {
				res.statusMessage = newMistakeQuestion.errorMessage;
				res.status(newMistakeQuestion.code).end();
				return;
			} else {
				res.status(200).send({'mistake_id':newMistakeQuestion.id});
			}
		});
	});

	// Delete a mistakeQuestion
	app.delete('/mistakeQuestion/:id', (req, res)=> {
		let mistakeQuestion = {
			mistakeQuestion_id: req.params.id
		}
		mistakeQuestionService.DELETE(mistakeQuestion, (mistakeQuestions) => {
			res.status(200).json({'mistakeQuestions': mistakeQuestions});
		});
	});
}