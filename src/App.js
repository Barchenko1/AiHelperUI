import React, { useState, useCallback } from 'react';
import { Layout } from 'antd';
import WebSocketHandler from './components/WebSocketHandler';
import Message from './components/Message';
import './App.css';

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
    <Layout className="layout-container">
      <Header className="header-container">Helper UI</Header>
      <div className="header-container">
        SQL JOIN: SELECT b.title, a.name, l.library_name
        FROM books b
        JOIN authors a ON b.author_id = a.id
        JOIN libraries l ON b.id = l.book_id;
      </div>
      <Content style={{ background: '#1e1e1e' }}>
        <WebSocketHandler onMessage={handleRerenderNewMessage} />
        <Message messages={messages} />
      </Content>
    </Layout>
  );
}

export default App;
