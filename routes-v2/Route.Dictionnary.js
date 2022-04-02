// import dictionnary ressources
const Dictionnary = require('../modules/Ressources.Dictionnary/Dictionnary.js');
const DictionnaryService = require('../modules/Ressources.Dictionnary/DictionnaryService.js');

// import decoder jwt
const jwtDecode = require("jwt-decode");
// import passport
//var passport = require('../../config/passport');

//import ErrorObject
const ErrorObject = require('../modules/error/ErrorObject.js');

module.exports = (app) => {
	
var dictionnaryService = new DictionnaryService();

	//Get all dictionnary
	app.get('/dictionnary', (req, res) =>{
		dictionnaryService.SELECT({},(dictionnarys) => {
			if (dictionnarys.code) {
				res.status(406).end();
				return;
			} else {
				let results = [];
				dictionnarys.forEach(item => { results.push(item.toObject(true, true, true));})
				res.status(200).json({'dictionnary': results});
			}
		})
	});

	//Get a dictionnary from its user
	app.get('/dictionnary/user', (req, res) =>{
		let criteria = {
			user_id: jwtDecode(req.get('Authorization').split(' ')[1]).sub.toString()
		};
		console.log(criteria.user_id);
		dictionnaryService.SELECT(criteria,(dictionnarys) => {
			if (dictionnarys.code) {
				res.status(406).end();
				return;
			} else {
				let results = [];
				dictionnarys.forEach(item => { results.push(item.toObject(true, true, true));})
				res.status(200).json({'dictionnary': results});
			}
		})
	});

	//Add a dictionnary
	app.post('/dictionnary', (req, res) =>{
		console.log(req.body);
		let bodyNewDictionnary = new Dictionnary(null, null, req.body);
		bodyNewDictionnary.user_id = jwtDecode(req.get('Authorization').split(' ')[1]).sub.toString();
		dictionnaryService.INSERT(bodyNewDictionnary, (newDictionnary) => {
			console.log(newDictionnary);
			if (newDictionnary.code) {
				res.statusMessage = newDictionnary.errorMessage;
				res.status(newDictionnary.code).end();
				return;
			} else {
				res.status(200).send(newDictionnary.id);
			}
		});
	});

	app.delete('/dictionnary/:id', (req, res)=> {
		let dictionnary = {
			dictionnary_id: req.params.id
		}
		dictionnaryService.DELETE(dictionnary, (dictionnarys) => {
			res.status(200).json({'dictionnary': dictionnarys});
		});
	});
}