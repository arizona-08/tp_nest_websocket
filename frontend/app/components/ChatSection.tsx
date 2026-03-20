
'use client';
import { ArrowLeft } from 'lucide-react'
import { useDiscussionListStore } from '../stores/DiscussionListStore'
import { useEffect, useRef, useState } from 'react';
import { messageSocketService } from '@/features/socket/socket';
import { getDiscussion } from '@/features/discussion/get-my-discussions';
import { formatDiscussionName } from '@/utils/discussion';
import { useAuthStore } from '../stores/AuthStore';
import { Message } from '@/types/message';
import { formatTime } from '@/utils/date';
import { set } from 'zod';


function ChatSection() {

  const openDiscussionList = useDiscussionListStore((state) => state.open);

  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  const activeDiscussion = useDiscussionListStore((state) => state.activeDiscussion);
  const setActiveDiscussion = useDiscussionListStore((state) => state.setActiveDiscussion);
  const authUser = useAuthStore((state) => state.user);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleMessageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);

    if(!typingTimeoutRef.current) {
      messageSocketService.isTyping(authUser?.username || "Unknown", activeDiscussion.id);
    } else {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      messageSocketService.stopTyping(authUser?.username || "Unknown", activeDiscussion.id);
      typingTimeoutRef.current = null;
    }, 2000);
  }

  async function handleSendMessage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    messageSocketService.stopTyping(authUser?.username || "Unknown", activeDiscussion.id);

    if(message.trim() !== "") {
      const dataToSend = {
        content: message,
        authorId: authUser?.id || "",
      }

      messageSocketService.sendMessage(dataToSend, activeDiscussion.id);
      setAllMessages((prevMessages) => [...prevMessages, { ...dataToSend, id: `temp-${Date.now()}`, discussionId: activeDiscussion.id, sendedAt: new Date().toISOString() }]);
      setMessage("");
    }
  }

  useEffect(() => {

    if(!activeDiscussion) return;
    messageSocketService.connect();
    messageSocketService.joinDiscussion(activeDiscussion.id);

    const unsubscribeOnMessage = messageSocketService.onMessage((message) => {
      setAllMessages((prevMessages) => [...prevMessages, message]);
    });

    const unsubscribeOnUserTyping = messageSocketService.onUserTyping((data) => {
      console.log(`${data.username} is typing...`);
      setUsersTyping((prev) => [...prev, data.username]);
    });

    const unsubscribeOnUserStopTyping = messageSocketService.onUserStopTyping((data) => {
      console.log(`${data.username} has stopped typing.`);
      setUsersTyping((prev) => prev.filter((username) => username !== data.username));
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnUserTyping();
      unsubscribeOnUserStopTyping();
      messageSocketService.leaveDiscussion(activeDiscussion.id);
      messageSocketService.disconnect();
    };
  }, [])

  useEffect(() => {
    async function fetchActiveDiscussion(){
      if(activeDiscussion.id) {
        const response = await getDiscussion(activeDiscussion.id);
        const fetchedDiscussion = await response.json();
        console.log("Active discussion:", fetchedDiscussion);

        setActiveDiscussion({
          id: fetchedDiscussion.id,
          name: formatDiscussionName(fetchedDiscussion, authUser?.id || "")
        });

        setAllMessages(fetchedDiscussion.messages); 
      }
    }

    fetchActiveDiscussion();
    console.log("Active discussion ID:", activeDiscussion.id);
  }, [activeDiscussion.id])

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Header de la conversation */}
      <div className="h-16 border-b bg-white flex items-center gap-4 px-6">
        <div className="flex items-center gap-4 cursor-pointer" onClick={openDiscussionList}>
          <ArrowLeft className="md:hidden"/>
          <p className="font-semibold">{activeDiscussion.name}</p>
        </div>
        {usersTyping.length > 0 && (
          <p className="text-sm text-gray-400">
            {usersTyping.join(", ")} {usersTyping.length === 1 ? "est" : "sont"} en train d'écrire...
          </p>
        )}
      </div>

      {/* Zone des bulles de messages (Scrollable) */}
      <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-4">
          {allMessages.map((message) => (
            <div key={message.id} className={`p-3 rounded-lg max-w-xs ${message.authorId === authUser?.id ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'}`}>
              {message.content}
              <p className="mt-1 text-xs text-gray-100/75 text-right">{formatTime(message.sendedAt)}</p>
            </div>
          ))}
      </div>

      {/* Input de message (Fixé en bas) */}
      <form className="p-4 bg-white border-t flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="w-full p-2 border rounded-lg"
            value={message}
            onChange={handleMessageChange}
          />

        <button className="bg-green-500 p-2 text-white rounded-md hover:bg-green-600" onClick={handleSendMessage}>
          Envoyer
        </button>
      </form>
    </div>
  )
}

export default ChatSection