const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const orders = require('./orders');

app.get('/', (req, res) => {
	res.send('Hello from chatbot');
});

app.post('/', express.json(), (req, res) => {
	const agent = new dfff.WebhookClient({ request: req, response: res });
	const mapIntent = new Map();

	//Normal Intents

	const welcomeIntent = (agent) => {
		agent.add('Hello , How can I help You?');
	};

	const shipmentIntent = (agent) => {
		const possibleResponse = ['What is your Order Id?', 'Can I get your Order Id?', "What's  your Order Id?"];

		const pick = Math.floor(Math.random() * possibleResponse.length);

		const response = possibleResponse[pick];
		agent.add(response);
	};

	const orderIdIntent = (agent) => {
		const id = agent.parameters['number'];
		let check = false;
		orders.forEach((order) => {
			if (order.id == id) {
				if (order.payment) agent.add('Payment has been received');
				else agent.add('Payment is due!');

				if (order.shipment) agent.add(`The order has been shipped and it has arrived ${order.currLocation}`);
				else agent.add('Order has not been shipped');
				check = true;
				agent.add('Do you have any feedback for us?');
			}
		});
		if (!check) agent.add('No such Order Id Exists! Check your OrderId ');
	};
	const feedbackIntent = (agent) => {
		console.log(agent.query);
		agent.add('Thanks for your valuable feedback');
		agent.setContext({ name: Welcome, lifespanCount: -1 });
	};
	// Normal Intents
	mapIntent.set('Feedback', feedbackIntent);
	mapIntent.set('Shipment', shipmentIntent);
	mapIntent.set('Welcome', welcomeIntent);
	mapIntent.set('Order', orderIdIntent);

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Feedback
	const noFeedbackIntent = (agent) => {
		agent.add('No problem, Have a nice day');
		agent.setContext({ name: Welcome, lifespanCount: -1 });
	};
	const complaintFeedbackIntent = (agent) => {
		agent.add(
			'We are really sorry to hear that , We will register this complain and try our best improve upon that '
		);
		agent.setContext({ name: Welcome, lifespanCount: -1 });
	};
	const reviewFeedbackIntent = (agent) => {
		agent.add('Thanks a lot for your review,Hope we met your expectation ');
		agent.setContext({ name: Welcome, lifespanCount: -1 });
	};
	const ratingFeedbackIntent = (agent) => {
		agent.add('Thanks for rating us ,Hope we met your expectation ');
		agent.setContext({ name: Welcome, lifespanCount: -1 });
	};

	//Feedback Intents

	mapIntent.set('Complain', complaintFeedbackIntent);
	mapIntent.set('Review', reviewFeedbackIntent);
	mapIntent.set('Rating', ratingFeedbackIntent);

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//operation
	const returnIntent = (agent) => {
		agent.add('What is your orderId ?');
	};
	const returnReplyIntent = (agent) => {
		console.log(agent.parameters);
		let check = false;
		orders.forEach((order) => {
			if (order.id === agent.query) {
				agent.add(`Hello ${order.orderer}, You will soon recive a returning confirmation on your mail`);
				check = true;
				agent.add('Do you have any feedback for us?');
			}
		});
		if (!check) agent.add('No such Order Id Exists! Check your OrderId ');
	};
	const exchangeIntent = (agent) => {
		agent.add('What is your orderId?');
	};
	const exchangeReplyIntent = (agent) => {
		let check = false;
		orders.forEach((order) => {
			if (order.id === agent.query) {
				agent.add(`Hello ${order.orderer}, You will soon recive a exchange confirmation on your mail`);
				agent.add('Do you have any feedback for us?');
				check = true;
			}
		});
		if (!check) agent.add('No such Order Id Exists! Check your OrderId ');
	};
	const cancelIntent = (agent) => {
		console.log(agent.query);
		agent.add('What is your orderId?');
	};
	const cancelReplyIntent = (agent) => {
		let check = false;
		orders.forEach((order) => {
			if (order.id === agent.query) {
				agent.add(`Hello ${order.orderer}, You will soon recive a cancellation confirmation on your mail`);
				agent.add('Do you have any feedback for us?');
				check = true;
			}
		});
		if (!check) agent.add('No such Order Id Exists! Check your OrderId ');
	};

	//Operation Intent
	mapIntent.set('Return', returnIntent);
	mapIntent.set('ReturnReply', returnReplyIntent);
	mapIntent.set('Cancel', cancelIntent);
	mapIntent.set('CancelReply', cancelReplyIntent);
	mapIntent.set('Exchange', exchangeIntent);
	mapIntent.set('ExchangeReply', exchangeReplyIntent);

	agent.handleRequest(mapIntent);
});

app.listen(3000, () => {
	console.log('Server started at port 3000');
});
