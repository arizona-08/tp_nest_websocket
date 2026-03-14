
'use client';
import { ArrowLeft } from 'lucide-react'
import { useDiscussionListStore } from '../stores/DiscussionListStore'
import { useEffect, useState } from 'react';
import { messageSocketService } from '@/features/socket/socket';

function ChatSection() {
  const messages = [
    {
      id: "jnss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnsss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnssss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnsssss",
      sender: "test1",
      content: "hey"
    },
    {
      id: "jnsssssss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnssssssss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnsssssssss",
      sender: "test",
      content: "heyyyyyyyyyyyyyyyyyyyy"
    },
    {
      id: "jnssssssssss",
      sender: "test1",
      content: "hey"
    },
    {
      id: "jnsssssssssss",
      sender: "test1",
      content: "hey"
    },
    {
      id: "jnssssssssssss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnsssdffve",
      sender: "test1",
      content: "hey"
    },
    {
      id: "jnssdferfbgr",
      sender: "test",
      content: "hey"
    },
  ]

  const openDiscussionList = useDiscussionListStore((state) => state.open);

  const [message, setMessage] = useState<string>("");

  function handleSendMessage() {
    if(message.trim() !== "") {
      messageSocketService.sendMessage(message, "111");
      setMessage("");
      console.log("Message sent:", message);
    }
  }

  useEffect(() => {
    messageSocketService.connect();

    const unsubscribe = messageSocketService.onMessage((message) => {
      console.log("Received message:", message);
    });

    return () => {
      unsubscribe();
      messageSocketService.disconnect();
    };
  }, [])

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header de la conversation */}
      <div className="h-16 border-b bg-white flex items-center gap-4 px-6">
        <div className="flex items-center gap-4 cursor-pointer" onClick={openDiscussionList}>
          <ArrowLeft className="md:hidden"/>
          <p className="font-semibold">Daniel Garcia</p>
        </div>
      </div>

      {/* Zone des bulles de messages (Scrollable) */}
      <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`p-3 rounded-lg max-w-xs ${message.sender === 'test' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'}`}>
              {message.content}
            </div>
          ))}
      </div>

      {/* Input de message (Fixé en bas) */}
      <div className="p-4 bg-white border-t flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="w-full p-2 border rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

        <button className="bg-green-500 p-2 text-white rounded-md hover:bg-green-600" onClick={handleSendMessage}>
          Envoyer
        </button>
      </div>
    </div>
  )
}

export default ChatSection