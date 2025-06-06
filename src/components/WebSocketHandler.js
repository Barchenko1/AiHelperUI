import { useEffect, useRef } from 'react';

const WebSocketHandler = ({ onMessage }) => {
    const socketRef = useRef(null);
    const retryInterval = useRef(1000);

    useEffect(() => {
        let isUnmounted = false;
        const connect = () => {
            const socket = new WebSocket("ws://192.168.1.22:8080/ws");
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("✅ WebSocket connected");
                retryInterval.current = 1000; // Reset retry on success
            };

            socket.onmessage = (event) => {
                onMessage(event.data);
            };

            socket.onerror = (err) => {
                console.error("❌ WebSocket error:", err);
            };

            socket.onclose = () => {
                console.warn("⚠️ WebSocket disconnected. Reconnecting...");
                if (!isUnmounted) {
                    setTimeout(() => {
                        retryInterval.current = Math.min(retryInterval.current * 2, 10000); // Max 10s
                        connect();
                    }, retryInterval.current);
                }
            };
        }

        connect();
        return () => {
            isUnmounted = true;
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [onMessage]);

    return null;
};

export default WebSocketHandler;
