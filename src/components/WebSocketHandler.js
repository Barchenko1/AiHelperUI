import { useEffect } from 'react';

const WebSocketHandler = ({ onMessage }) => {
    useEffect(() => {
        const socket = new WebSocket("ws://192.168.1.22:8080/ws");

        socket.onmessage = (event) => {
            onMessage(event.data);
        };

        socket.onopen = () => {
            console.log("WebSocket connected.");
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        return () => {
            socket.close();
        };
    }, [onMessage]);

    return null;
};

export default WebSocketHandler;
