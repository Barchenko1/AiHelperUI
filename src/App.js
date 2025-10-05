import React, { useState, useCallback } from 'react';
import { Layout } from 'antd';
import WebSocketHandler from './components/WebSocketHandler';
import Message from './components/Message';
import './App.css';
import LoginSection from './components/LoginSection';

const { Content } = Layout;

function getUserSession() {
  const raw = localStorage.getItem("usersession");
  return raw ? JSON.parse(raw) : {};
}

function App() {
  const [token, setToken] = useState(getUserSession().token || null);
  const [code, setCode] = useState(getUserSession().code || null);
  const [messages, setMessages] = useState([]);

  // const handleListNewMessage = useCallback((msg) => {
  //   setMessages(prev => [...prev, msg]);
  // }, []);

    const handleRerenderNewMessage = useCallback((msg) => {
        setMessages(() => [msg]);
    }, []);

  return (
    <Layout className="layout-container">
      <LoginSection code={code} setCode={setCode} token={token} setToken={setToken} />
      <Content style={{ background: '#1e1e1e' }}>
        <WebSocketHandler token={token} onMessage={handleRerenderNewMessage} />
        <Message token={token} messages={messages} />
      </Content>
    </Layout>
  );
}

export default App;
