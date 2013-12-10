/*

20131018
Live Web
Brain Blowing
Midterm, a interactive game, blowing your enemy's brain out

Kang Peng
ktp242@nyu.edu

1) set up a server.js
2) set up the function to receive peer ID from clients

20131210
3) added keyboard control functions

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
      socket.on('myPeerId', function(newPeerId) {
			console.log("Received: 'my peerId' " + newPeerId);
			// We can save this in the socket object if we like
			socket.peerId = newPeerId;
			console.log("Saved: " + socket.peerId);
			// We can loop through these if we like
			for (var i  = 0; i < io.sockets.clients().length; i++) {
				console.log("loop: " + i + " " + io.sockets.clients()[i].peerId);
			}
			// get previous peer ID			
			previousPeerId = io.sockets.clients()[io.sockets.clients.length-1].peerId;
			console.log("this is previous: " + previousPeerId);
			// emit 'peerId' with my peer id
			socket.broadcast.emit('peerId',newPeerId,previousPeerId);
		});

      socket.on('doKeyDown', function (changeNumber) {
			console.log(changeNumber);
		});


  // Once the client has left
	    socket.on ('disconnect', function() {
		console.log("One client has left");
	    });
	}
);