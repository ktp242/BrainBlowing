/*

20131018
Live Web
Brain Blowing
Midterm, a interactive game, blowing your enemy's brain out

Kang Peng
ktp242@nyu.edu

1) set up a server.js
2) set up the function to receive peer ID from clients

*/

// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/index.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}


// WebSocket Portion
// import socket.io library
var io = require('socket.io').listen(httpServer);

// if the user connects to the socket
io.sockets.on('connection',
   function (socket) {
      console.log("We have a new client: " + socket.id);
  
      // retrieve peer ID from the client
      socket.on('myPeerId', function(myPeerId) {
			console.log("Received: 'my peerId' " + myPeerId);
			// We can save this in the socket object if we like
			socket.peerId = myPeerId;
			console.log("Saved: " + socket.peerId);
			// We can loop through these if we like
			for (var i  = 0; i < io.sockets.clients().length; i++) {
				console.log("loop: " + i + " " + io.sockets.clients()[i].peerId);
			}			
			// emit 'peerId' with my peer id
			io.sockets.emit('peerId',myPeerId);
		});

  // Once the client has left
	    socket.on ('disconnect', function() {
		console.log("One client has left");
	    });
	}
);