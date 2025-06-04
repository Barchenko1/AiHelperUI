import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import './Message.css';

const Message = ({ messages }) => {
    const containerRef = useRef(null);

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
        <div ref={containerRef} className="massages-container">
            {messages.map((item, index) => (
                <div className="message-wrap" key={index}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            code({ inline, className, children, ...props }) {
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {extractMessage(item)}
                    </ReactMarkdown>
                </div>
            ))}
        </div>
    );
};

export default Message;