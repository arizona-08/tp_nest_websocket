
'use client';
import { ArrowLeft } from 'lucide-react'
import { useDiscussionListStore } from '../stores/DiscussionListStore'

function ChatSection() {
  const messages = [
    {
      id: "jnss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test1",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test",
      content: "heyyyyyyyyyyyyyyyyyyyy"
    },
    {
      id: "jnss",
      sender: "test1",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test1",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test1",
      content: "hey"
    },
    {
      id: "jnss",
      sender: "test",
      content: "hey"
    },
  ]
  const openDiscussionList = useDiscussionListStore((state) => state.open)

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
      <div className="p-4 bg-white border-t">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="w-full p-2 border rounded-lg"
          />
      </div>
    </div>
  )
}

export default ChatSection