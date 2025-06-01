const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080, host: '0.0.0.0', path: '/ws' });

wss.on('connection', (ws) => {
    console.log('✅ Client connected');

    ws.on('message', (message) => {
        const jsonStr = message.toString();
        console.log('📩 Received from Java:', jsonStr);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(jsonStr);
            }
        });
    });
});
