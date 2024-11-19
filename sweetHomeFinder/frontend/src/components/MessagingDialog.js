import React, { useState, useEffect } from 'react';
import { SendHorizonal, RotateCw } from 'lucide-react';

const MessagingDialog = ({ isOpen, onClose, user, supabase }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState('');

  const fetchMessages = async () => {
    try {
      setSending('Fetching...');
      const { data, error } = await supabase
        .from('Msg')
        .select(`
          msg_id,
          clerk_user_id,
          clerk_user_name,
          content,
          timestamp,
          from_user
        `)
        .eq('clerk_user_id', user.id)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setMessages(data);
      setSending('');
    } catch (error) {
      console.error("Error fetching messages:", error);
      setSending('Error loading messages');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending('Sending...');
      const { error } = await supabase
        .from('Msg')
        .insert([{
          clerk_user_id: user.id,
          clerk_user_name: user.username,
          content: newMessage,
          timestamp: new Date(),
          from_user: 1,
        }]);

      if (error) throw error;

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content messages">
        <div className="modal-header">
          <h2>Your Messages</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        
        <div className="statusDiv">
          <button className="refreshBtn" onClick={fetchMessages}>
            <RotateCw size={20} />
            Refresh Messages
          </button>
          <p>{sending}</p>
        </div>

        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.msg_id} className={`message ${msg.from_user ? 'user' : 'admin'}`}>
              <div className={`message-content ${msg.from_user ? 'user' : 'admin'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingDialog;