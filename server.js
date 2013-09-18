process.on('uncaughtException', function (err) {
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
	console.error(err.stack)
	process.exit(1)
})

var restify = require('restify'),
	cv = require('opencv'),
	fs = require('fs');

var server = restify.createServer();
server.use(restify.bodyParser());

server.post('/api/face_detection', function create(req, res, next) {
	var buf = new Buffer(req.body, 'base64');
	cv.readImage(buf, function (err, im) {
		if (err) throw err;
		im.detectObject("node_modules/opencv/data/haarcascade_frontalface_alt.xml", {}, function (err, faces) {
			if (err) throw err;
			res.send(200, faces);
			return next();
		});
	});
});

server.get(/.*/, restify.serveStatic({
	directory: './www'
}));

server.listen(8080, function() {
	console.log('%s listening at %s', server.name, server.url);
});
