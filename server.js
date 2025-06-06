const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080, host: '0.0.0.0', path: '/ws' });
const messageHistory = [];

wss.on('connection', (ws) => {
    console.log('✅ Client connected');

    messageHistory.forEach(msg => ws.send(msg));

    ws.on('message', (message) => {
        const jsonStr = message.toString();
        messageHistory.push(jsonStr);
        console.log('📩 Received from Java:', jsonStr);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(jsonStr);
            }
        });
    });
});
