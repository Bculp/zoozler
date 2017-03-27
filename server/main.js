// ** Temporary solution that uses webcam **
const express = require('express');
const { resolve } = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use(require('volleyball'));

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(resolve(__dirname, '..', 'public')));

app.use('/videos', require('./app.js'));

// Send HTML file for anything else
app.get('/*', (req, res) => {
	res.sendFile(resolve(__dirname), '..', 'public', 'index.html');
});

// Error handling
app.use((err, req, res, next) => {
	console.error(err, typeof next);
	console.error(err.stack);
	res.status(err.status || 500).send(err.message || 'Internal server error');
});

// Start server
app.listen(PORT, err => {
	if (err) {
		return console.log('Error:', err);
	}
	console.log('Server listening on port ', PORT);
});
