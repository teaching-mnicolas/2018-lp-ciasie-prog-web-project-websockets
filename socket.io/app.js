const express = require('express')
       , http = require('http')
       , path = require('path');
       

const app    = express();
const server = http.createServer(app);

/* Configuration Socket.IO */

const io = require('socket.io')(server);
let messages = [];

io.on('connection', function(socket){
	socket.emit('messages', messages);

	socket.on('message', function(content){
		let currentDate = new Date();
		let msgDate     = currentDate.getHours() + ':' + (currentDate.getMinutes()<10?('0'+ currentDate.getMinutes()):currentDate.getMinutes());
		msg             = `<p>${content.author}@${msgDate}----${content.data}</p>`;
		messages.push(msg);
		io.sockets.emit('message', msg);
	});
});


/* Configuration expressJS */
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.get('/', function(req, res){
	res.sendfile('views/chat.html');
});

server.listen(app.get('port'), function(){
  console.log("Server port " + app.get('port'));
});
