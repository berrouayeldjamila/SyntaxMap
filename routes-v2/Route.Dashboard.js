// import dashboard ressources
const Dashboard = require('../modules/Ressources.Dashboard/Dashboard.js');
const DashboardService = require('../modules/Ressources.Dashboard/DashboardService.js');

// import decoder jwt
const jwtDecode = require("jwt-decode");
// import passport
//var passport = require('../../config/passport');

//import ErrorObject
const ErrorObject = require('../modules/error/ErrorObject.js');

module.exports = (app) => {
	
var dashboardService = new DashboardService();

	//Get all dashboard
	app.get('/dashboard', (req, res) =>{
		dashboardService.SELECT({},(dashboards) => {
			if (dashboards.code) {
				res.status(406).end();
				return;
			} else {
				let results = [];
				dashboards.forEach(item => { results.push(item.toObject(true, true, true));})
				res.status(200).json({'dashboard': results});
			}
		})
	});

	//Get a dashboard from its user
	app.get('/dashboard/user', (req, res) =>{
		console.log(req);
		let criteria = {
			user_id: jwtDecode(req.get('Authorization').split(' ')[1]).sub.toString()
		};
		dashboardService.SELECT(criteria,(dashboards) => {
			if (dashboards.code) {
				res.status(406).end();
				return;
			} else {
				let results = [];
				dashboards.forEach(item => { results.push(item.toObject(true, true, true));})
				res.status(200).json({'dashboard': results});
			}
		})
	});

	//Add a dashboard
	app.post('/dashboard', (req, res) =>{
		console.log(req.body);
		let bodyNewDashboard = new Dashboard(null, null, req.body);
		bodyNewDashboard.user_id = jwtDecode(req.get('Authorization').split(' ')[1]).sub.toString();
		dashboardService.INSERT(bodyNewDashboard, (newDashboard) => {
			console.log(newDashboard);
			if (newDashboard.code) {
				res.statusMessage = newDashboard.errorMessage;
				res.status(newDashboard.code).end();
				return;
			} else {
				res.status(200).send({'report_id': newDashboard.id});
			}
		});
	});

	app.delete('/dashboard/:id', (req, res)=> {
		let dashboard = {
			dashboard_id: req.params.id
		}
		dashboardService.DELETE(dashboard, (dashboards) => {
			res.status(200).json({'dashboard': dashboards});
		});
	});
}