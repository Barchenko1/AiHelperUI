import React from 'react';
import { List } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

const MessageList = ({ messages }) => {
  const extractMessage = (msg) => {
    try {
      const parsed = JSON.parse(msg);
      if (parsed.choices?.[0]?.message?.content) {
        return parsed.choices[0].message.content;
      }
      if (typeof parsed === 'string') return parsed;
      return '[Unknown GPT format]';
    } catch {
      try {
        return JSON.parse(`"${msg}"`);
      } catch {
        return msg;
      }
    }
  };

  return (
    <div style={{
      background: '#1e1e1e',
      padding: '2px',
      borderRadius: '4px',
      color: '#fff',
      fontFamily: 'SFMono-Regular, Consolas, Menlo, monospace'
    }}>
      <List
        bordered
        dataSource={messages}
        renderItem={(item) => (
            <List.Item
                style={{
                    whiteSpace: 'pre-wrap',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #444',
                    marginBottom: '6px',
                    color: '#d4d4d4',
                    fontSize: '10px',
            }}
            >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                p: ({ children }) => (
                    <p>{children}</p>
                ),
                code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                    <div style={{
                        background: '#1f1f1f',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        marginTop: '2px',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        fontSize: '10px',
                        fontFamily: 'monospace'
                    }}>
                        <div style={{
                        background: '#2c2c2c',
                        padding: '1px 2px',
                        color: '#aaa',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #444'
                        }}>
                        Code
                        </div>
                        <div>
                            <code className={className} {...props}>
                                {children}
                            </code>
                        </div>
                    </div>
                    ) : (
                    <code style={{ background: '#333', borderRadius: '4px', fontSize: '10px' }}>
                        {children}
                    </code>
                    );
                }
                }}
            >
                {extractMessage(item)}
            </ReactMarkdown>
            </List.Item>
        )}
        style={{
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#1e1e1e',
            border: 'none',
        }}
      />
    </div>
  );
};

export default MessageList;
