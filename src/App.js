import React, { useState, useCallback } from 'react';
import { Layout } from 'antd';
import WebSocketHandler from './components/WebSocketHandler';
import Message from './components/Message';

const { Header, Content } = Layout;

function App() {
  const [messages, setMessages] = useState([]);

  // const handleListNewMessage = useCallback((msg) => {
  //   setMessages(prev => [...prev, msg]);
  // }, []);

    const handleRerenderNewMessage = useCallback((msg) => {
        setMessages(() => [msg]);
    }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: '#1e1e1e' }}>
      <Header style={{ background: '#1f1f1f', color: '#fff', fontSize: '20px' }}>
        IDH Viewer
      </Header>
      <Content style={{ background: '#1e1e1e' }}>
        <WebSocketHandler onMessage={handleRerenderNewMessage} />
        <Message messages={messages} />
      </Content>
    </Layout>
  );
}

export default App;
