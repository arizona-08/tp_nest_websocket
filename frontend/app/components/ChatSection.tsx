
'use client';
import { ArrowLeft } from 'lucide-react'
import { useDiscussionListStore } from '../stores/DiscussionListStore'
import { useEffect, useRef, useState } from 'react';
import { messageSocketService } from '@/features/socket/socket';
import { getDiscussion, getGeneralDiscussion } from '@/features/discussion/get-my-discussions';
import { formatDiscussionName } from '@/utils/discussion';
import { useAuthStore } from '../stores/AuthStore';
import { Message } from '@/types/message';
import { formatTime } from '@/utils/date';
import { set } from 'zod';
import ReactionSlot from './ReactionSlot';
import { useSearchParams } from 'next/navigation';


function ChatSection() {

  const searchParams = useSearchParams();
  const discussionTypeQuery = searchParams.get('type') || '';
  console.log("discussionTypeQuery");
  const openDiscussionList = useDiscussionListStore((state) => state.open);

  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  const activeDiscussion = useDiscussionListStore((state) => state.activeDiscussion);
  const setActiveDiscussion = useDiscussionListStore((state) => state.setActiveDiscussion);
  const authUser = useAuthStore((state) => state.user);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        author: {
          id: authUser?.id || "",
          username: authUser?.username || "Unknown",
        },
        reactions: [],
      }

      messageSocketService.sendMessage(dataToSend, activeDiscussion.id);
      setMessage("");
    }
  }

  async function handleAddReaction(messageId: string, emoji: string){
    const message = allMessages.find((msg) => msg.id === messageId);
    const existingReactions = message?.reactions || [];
    const hasReacted = existingReactions.some((reaction) => reaction.user.id === authUser?.id && reaction.reaction === emoji);

    const user = {
      id: authUser?.id || "",
      username: authUser?.username || "Unknown",
    }

    if(hasReacted) {
      const reactionToRemove = existingReactions.find((reaction) => reaction.user.id === authUser?.id && reaction.reaction === emoji);
      const reactionId = reactionToRemove?.id || "";
      messageSocketService.removeReaction({
        user,
        messageId,
        emoji,
        discussionId: activeDiscussion.id
      })

      setAllMessages((prevMessages) => prevMessages.map((msg) => {
        if(msg.id === messageId) {
          const existingReactions = msg.reactions || [];
          return {
            ...msg,
            reactions: existingReactions.filter((reaction) => !(reaction.id === reactionId))
          }
        }
        return msg;
      }))
    } else {
      messageSocketService.addReaction({
        user,
        messageId,
        emoji,
        discussionId: activeDiscussion.id
      })

      setAllMessages((prevMessages) => prevMessages.map((msg) => {
        if(msg.id === messageId) {
          const existingReactions = msg.reactions || [];

          return {
            ...msg,
            reactions: [
              ...existingReactions,
              { 
                id: `temp-${Date.now()}`,
                user,
                reaction: emoji,
                messageId: msg.id
              }
            ]
          }
        }
        return msg;
      }))
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

    const unsubscribeOnReactionAdded = messageSocketService.onReactionAdded((data) => {
      setAllMessages((prevMessages) => prevMessages.map((msg) => {
        if (msg.id === data.messageId) {
          const existingReactions = msg.reactions || [];
          const hasReacted = existingReactions.some((reaction) => reaction.user.id === data.user.id && reaction.reaction === data.reaction);

          if (!hasReacted) {
            return {
              ...msg,
              reactions: [
                ...existingReactions,
                { 
                  id: data.id,
                  user: data.user,
                  reaction: data.reaction,
                  messageId: msg.id
                }
              ]
            }
          }
        }
        return msg;
      }));
    });

    const unsubscribeOnReactionRemoved = messageSocketService.onReactionRemoved((data) => {
      setAllMessages((prevMessages) => prevMessages.map((msg) => {
        if (msg.id === data.messageId) {
          const existingReactions = msg.reactions || [];
          return {
            ...msg,
            reactions: existingReactions.filter((reaction) => !(reaction.user.id === data.user.id && reaction.reaction === data.reaction))
          }
        }
        return msg;
      }));
    });


    return () => {
      unsubscribeOnMessage();
      unsubscribeOnUserTyping();
      unsubscribeOnUserStopTyping();
      unsubscribeOnReactionAdded();
      unsubscribeOnReactionRemoved();
      messageSocketService.leaveDiscussion(activeDiscussion.id);
      messageSocketService.disconnect();
    };
  }, [])

  useEffect(() => {
    async function fetchActiveDiscussion(){
      if(activeDiscussion.id) {
        const response = await getDiscussion(activeDiscussion.id);

        if(response.ok) {
          const fetchedDiscussion = await response.json();
  
          setActiveDiscussion({
            id: fetchedDiscussion.id,
            name: formatDiscussionName(fetchedDiscussion, authUser?.id || "")
          });
  
          setAllMessages(fetchedDiscussion.messages); 
        } else {
          console.error("Failed to fetch discussion details");
          console.log(response.status)
        }
      }
    }

    fetchActiveDiscussion();
  }, [activeDiscussion.id])

  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
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

      
      <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-5">
          {allMessages.map((message) => 
            {
              const isOwnMessage = message.authorId === authUser?.id;
              return (
                <div key={message.id} className={`relative p-3 rounded-lg max-w-xs ${isOwnMessage ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 self-start'}`}>
                  <p className={`text-xs mb-1 font-semibold `} style={{ color: message.authorId === authUser?.id ? (authUser?.usernameColor) : (message.author?.usernameColor) }}>
                    {message.authorId === authUser?.id ? "" : (message.author?.username || "Utilisateur")}
                  </p>
                  {message.content}
                  <p className="mt-1 text-xs text-gray-100/75 text-right">{formatTime(message.sendedAt)}</p>
                  <ReactionSlot
                    authUser={authUser}
                    messageId={message.id}
                    isOwnMessage={isOwnMessage}
                    onAddReaction={handleAddReaction}
                    reactions={message.reactions}
                  />
                </div>
              )
            })
          }

          <div ref={messagesEndRef} />
      </div>

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