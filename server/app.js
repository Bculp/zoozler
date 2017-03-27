const fs = require('fs');
const express = require('express');
const router = express.Router();
module.exports = router;

let fileNames = [];

fs.realpath(__dirname, function(err, path) {
	if (err) {
		console.log(err);
		return;
	}
});

fs.readdir(__dirname, function(err, files) {
	if (err) return;
	files.forEach(file => {
		if (file.includes('test')) {
			fileNames.push(file);
		}
	});
});

router.get('/', (req, res, next) => {
	res.send(fileNames);
});
