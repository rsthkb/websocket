const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4009 });

wss.on('connection', function connection(ws) {
  console.log('New WebSocket connection');

  ws.on('message', function incoming(message) {
    console.log('Received:', message);
    // Echo the message back to the client
    ws.send(message);
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });
});

console.log('WebSocket server started on port 4009');
