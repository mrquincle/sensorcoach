/*
 * Create an object, we use new here.
 */
var coach_api = new function() {
	self = this;
	self.endpoint = '/api';


	self.endpoint_gps = '/gps';

	// Data of this very moment of a single person, not the history
	self.data = {
		'gps': 45,
		'age': 22,
		'gender': 'male'
	};

	/**
	 * There are several predefined motivational messages, if you just think of them without much depth, you can 
	 * think of a challenge, promise, encouragement, reward, punishment, or competitive, goal-oriented,
	 * habit-oriented, or collaborative message, a social or emotional reward, a reminder, historic record, or
	 * a self-written message (to your future self).
	 *
	 * The type of motivation come from "Value Priorities and Behaviour: Applying a Theory of Integrated Value 
	 * Systems" by Schwartz. He distinghishes:
	 *  - power
	 *  - achievement
	 *  - hedonism
	 *  - stimulation
	 *  - self-direction
	 *  - universalism
	 *  - benevolence
	 *  - tradition
	 *  - conformity
	 *  - security
	 * A person who loves stimulation, would thrive from a sudden recommendation to start running at night. A 
	 * person who likes self-direction, probably benefits from own goals to set, and sending messages to a future
	 * self. A hedonist wants to be reminded how good and happy he feels after a run. Someone who appreciates
	 * achievements loves rankings or competitions with others.
	 *
	 * There is one more type of motivation which is 'free-form', a yet not futher defined motivational message
	 * which can not be classified as one of the above.
	 *
	 * Every recommendation is this system is considered a motivational message. Hence, the words are used 
	 * interchangeably. The classifier behind this REST API will learn from training data what type of messages
	 * do work for what type of people. A person might benefit from a combination of messages that target 
	 * hedonism as well as tradition for example.
	 */
	self.recommendation = {
		'type': 'challenge',
		'timestamp': 0,
		'content': ''
	};

	self.train = {
		'recommendation': null,
		'data': null,
		'success': true
	}

	// Create the API routes
	this.createAPI = function(app) {
		
		app.get(self.endpoint, function(req, res) {
			res.send('There are individual REST API endpoints you can use. Check the documentation on <a href="https://github.com/mrquincle/sensorcoach">github</a>.');
		});

		/**
		 * The GPS location is an important part of the type of data we would like from the user because it 
		 * allows us (combined with time data) to retrieve weather conditions at that location. The weather can
		 * have a big influence on someone's willingness to get active.
		 *
		 * Moreover, it might very well be that people react upon motivational messages in certain parts of the
		 * world in a way that correlates with their geological region. This does not only need to do with 
		 * character traits that are shared by certain nationalities, but also habbits, such as when to eat or
		 * when to sleep.
		 */
		app.get(self.endpoint + self.endpoint_gps, function(req, res) {
			console.log('Send GPS location ' + self.data.gps + ' to user');
			res.send('' + self.data.gps);
		});

		// POST GPS
		app.post(self.endpoint + self.endpoint_gps, function(req, res) {
			var gps = req.body.gps;
			if (gps) {
				console.log('Post GPS location ' + gps);
				self.data.gps = gps;
				res.send('Success');
			} else {
				console.log('Post GPS location, but no gps data object in request body');
				console.log('Request body: ', req.body);
				res.send('Failure');
			}
		});

		/*
		 * Another distinctive factor might be age. It might very well be that people that are older, but who
		 * are able to run long distances are especially sensitive to motivational messages that make them 
		 * feel old. 
		 *
		 * It might also be the case that sleeping habbits consistently change over someone's lifetime and 
		 * comparisons between people from the same age are considered more fair by people who like
		 * achievements.
		 */
		app.get(self.endpoint + self.endpoint_age, function(req, res) {
			console.log('Send age ' + self.data.age + ' to user');
			res.send('' + self.data.age);
		});

		// POST age
		app.post(self.endpoint + self.endpoint_age, function(req, res) {
			var age = req.body.age;
			if (age) {
				console.log('Post age' + age);
				self.data.age = age;
				res.send('Success');
			} else {
				console.log('Post age, but no age data object in request body');
				console.log('Request body: ', req.body);
				res.send('Failure');
			}
		});

		/*
		 * Security might be an issue for suggestions to run at certain times of the day that have to do with
		 * gender.
		 */
		app.get(self.endpoint + self.endpoint_gender, function(req, res) {
			console.log('Send gender ' + self.data.gender + ' to user');
			res.send('' + self.data.gender);
		});

		// POST gender
		app.post(self.endpoint + self.endpoint_gender, function(req, res) {
			var gender = req.body.gender;
			if (gender) {
				console.log('Post gender ' + gender);
				self.data.gender = gender;
				res.send('Success');
			} else {
				console.log('Post gender, but no gender data object in request body');
				console.log('Request body: ', req.body);
				res.send('Failure');
			}
		});

		/**
		 * A training sample should have the following fields:
		 *
		 	self.train = {
				recommendation = {
					'type': 'challenge',
					'timestamp': 0,
					'content': ''
				},
				'data' = {
					'gps': 45,
					'age': 22,
					'gender': 'male',
					'sense-id': 'for previous CommonSense records',
					'twitter-id': 'for public messages'
					'facebook-id': 'for public messages'
				},
				'success': true
			}
		 *
		 */
		app.post(self.endpoint + self.endpoint_train, function(req, res) {
			var train = req.body.train;
			if (!gender) {
				console.log('Post train, but there is no training data object in request body');
				console.log('Request body: ', req.body);
				res.send('Failure');
				return;
			}
			console.log('Post train: ', train);
			self.data.train = train;
			res.send('Success');
		});
	}
}

exports.interface = coach_api;
