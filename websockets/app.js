const express = require('express')
       , http = require('http')
       , path = require('path')
       , WS   = require('ws');

const app    = express();
const server = http.createServer(app);



/* Configuration Websocket */

function sendAllClients(clients,type, msg){
	for(let i=0; i < clients.length; i++) {
		clients[i].send(JSON.stringify({type:type, content:msg}));
	}
}

const WebSocketServer = WS.Server;
const wss = new WebSocketServer({server});

let clients  = [];
let messages = [];

wss.on('connection', function(ws){
	clients.push(ws);
	ws.send(JSON.stringify({type:'messages', content:messages}));
  
	ws.on('message', function(msg){
		msg             = JSON.parse(msg);
		let currentDate = new Date();
		let msgDate     = currentDate.getHours() + ':' + (currentDate.getMinutes()<10?('0'+ currentDate.getMinutes()):currentDate.getMinutes());
		msg             = `<p>${msg.author}@${msgDate}----${msg.data}</p>`;
		messages.push(msg);
		sendAllClients(clients, 'message', msg);
	});

	ws.on('close', function(){
		let index = clients.indexOf(ws);
		clients.splice(index, 1);
	});
});



/* Configuration expressJS */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/chat.html');
});

server.listen(app.get('port'), function(){
  console.log("Server port " + app.get('port'));
});
