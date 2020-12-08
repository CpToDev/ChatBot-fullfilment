//https://sauravagtl-fulfillment.herokuapp.com/
const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const orders = require('./orders');
const PORT = process.env.PORT || 3000;

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
				if (order.payment) {
					if (order.shipment)
						agent.add(
							`Payment has been received and the order has been shipped and it has arrived ${order.currLocation}\nDo you have any feedback for us? `
						);
					else
						agent.add(
							`Hello ${order.orderer}, payment has been received but the order has not been shipped \n Any feedback? `
						);
				} else {
					agent.add(
						`Hello ${order.orderer},payment has not been received hence order not shipped\n Any feedback for us ?`
					);
				}
				check = true;
			}
		});
		if (!check) agent.add('No such Order Id Exists! Check your OrderId ');
	};
	const feedbackIntent = (agent) => {
		console.log(agent.query);
		agent.add('Thanks for your valuable feedback');
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
	};
	const complaintFeedbackIntent = (agent) => {
		agent.add(
			'We are really sorry to hear that , We will register this complain and try our best improve upon that '
		);
	};
	const reviewFeedbackIntent = (agent) => {
		agent.add('Thanks a lot for your review,Hope we met your expectation ');
	};
	const ratingFeedbackIntent = (agent) => {
		agent.add('Thanks for rating us ,Hope we met your expectation ');
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
				agent.add(
					`Hello ${order.orderer}, You will soon recive a returning confirmation on your mail\nDo you have any feedback for us?`
				);
				check = true;
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
				agent.add(
					`Hello ${order.orderer}, You will soon recive a exchange confirmation on your mail\n Do you have any feedback for us?`
				);
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
				agent.add(
					`Hello ${order.orderer}, You will soon recive a cancellation confirmation on your mail\nDo you have any feedback for us?`
				);

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

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
