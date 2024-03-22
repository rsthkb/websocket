const ws = new WebSocket('ws://localhost:4009');

ws.onopen = function() {
  console.log('WebSocket connection established.');
};

ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};

ws.onmessage = function(event) {
  console.log('Received message:', event.data);
};
