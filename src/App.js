import React, { useState, useCallback } from 'react';
import { Layout } from 'antd';
import WebSocketHandler from './components/WebSocketHandler';
import MessageList from './components/MessageList';

const { Header, Content } = Layout;

function App() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = useCallback((msg) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: '#1e1e1e' }}>
      <Header style={{ background: '#1f1f1f', color: '#fff', fontSize: '20px' }}>
        IDH GPT Viewer
      </Header>
      <Content style={{ background: '#1e1e1e' }}>
        <WebSocketHandler onMessage={handleNewMessage} />
        <MessageList messages={messages} />
      </Content>
    </Layout>
  );
}

export default App;
