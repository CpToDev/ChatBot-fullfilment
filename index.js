const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const orders = require('./orders');

app.get('/', (req, res) => {
	res.send('Hello from chatbot');
});

app.post('/', express.json(), (req, res) => {
	const agent = new dfff.WebhookClient({ request: req, response: res });

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
		let check = false;
		orders.forEach((order) => {
			if (order.id === agent.query) {
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
		agent.add('Thanks for your valuable feedback!');
	};
	//operation
	const returnIntent = (agent) => {
		agent.add('What is your orderId?');
	};
	const returnReplyIntentfallback = (agent) => {
		orders.forEach((order) => {
			if (order.id === agent.query) {
				agent.add(`Hello ${order.orderer}, You will soon recive a exchange confirmation mail`);
				agent.add('Do you have any feedback for us?');
			}
		});
		if (!check) agent.add('No such Order Id Exists! Check your OrderId ');
	};
	const exchangeIntent = (agent) => {
		agent.add('What is your orderId?');
	};
	const exchangeReplyIntentfallback = (agent) => {
		orders.forEach((order) => {
			if (order.id === agent.query) {
				agent.add(`Hello ${order.orderer}, You will soon recive a exchange confirmation mail`);
				agent.add('Do you have any feedback for us?');
			}
		});
		if (!check) agent.add('No such Order Id Exists! Check your OrderId ');
	};
	const cancelIntent = (agent) => {
		agent.add('What is your orderId?');
	};
	const cancelReplyIntentfallback = (agent) => {
		orders.forEach((order) => {
			if (order.id === agent.query) {
				agent.add(`Hello ${order.orderer}, You will soon recive a exchange confirmation mail`);
				agent.add('Do you have any feedback for us?');
			}
		});
		if (!check) agent.add('No such Order Id Exists! Check your OrderId ');
	};

	const mapIntent = new Map();

	// Intents
	mapIntent.set('Feedback', feedbackIntent);
	mapIntent.set('Shipment', shipmentIntent);
	mapIntent.set('Welcome', welcomeIntent);
	mapIntent.set('OrderId', orderIdIntent);

	//Operation Intent
	mapIntent.set('Return', returnIntent);
	mapIntent.set('ReturnFallback', returnReplyIntentfallback);
	mapIntent.set('Cancel', cancelIntent);
	mapIntent.set('CancelFallback', cancelReplyIntentfallback);
	mapIntent.set('Exchange', exchangeIntent);
	mapIntent.set('Exchange', exchangeReplyIntentfallback);

	agent.handleRequest(mapIntent);
});

app.listen(3000, () => {
	console.log('Server started at port 3000');
});
