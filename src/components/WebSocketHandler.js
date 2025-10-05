import { useEffect, useRef } from 'react';

const WebSocketHandler = ({ token, onMessage }) => {
    const socketRef = useRef(null);
    const retryInterval = useRef(1000);

    useEffect(() => {
        let isUnmounted = false;
        if (!token) return;
        const connect = () => {
            const socketUrl = new URL(`${process.env.REACT_APP_AI_SOCKET}`);
            socketUrl.searchParams.set("token", token);
            const socket = new WebSocket(socketUrl.toString());
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("✅ WebSocket connected");
                retryInterval.current = 1000;
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
    }, [token, onMessage]);

    // return null;
};

export default WebSocketHandler;
