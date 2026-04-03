import { MessageReaction } from '@/types/message';

import { on } from 'events';
import { Plus, Smile } from 'lucide-react'
import React, { useState } from 'react'
import { User } from '../stores/AuthStore';

interface ReactionSlotProps {
  authUser: User | null;
  messageId: string;
  isOwnMessage: boolean;
  reactions: MessageReaction[]
  onAddReaction: (messageId: string, emoji: string) => void;
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏'];

type ReactionWithCount = {
  reaction: string;
  count: number;
  users: {
    id: string;
    username: string;
  }[]
}

function ReactionSlot({ authUser, messageId, isOwnMessage, onAddReaction, reactions }: ReactionSlotProps) {
  const [isOpen, setIsOpen] = useState(false);

  const reactionsWithCount: ReactionWithCount[] = [];

  if(reactions){
    reactions.forEach((baseReaction) => {
      const isReactionIncluded = reactionsWithCount.find((reactWithcount) => reactWithcount.reaction === baseReaction.reaction);

      if(!isReactionIncluded){
        const reactionWithCount: ReactionWithCount = {
          reaction: baseReaction.reaction,
          count: 1,
          users: [baseReaction.user]
        }

        reactionsWithCount.push(reactionWithCount);
      } else {
        reactionsWithCount.forEach((reactWithCount) => {
          if(reactWithCount.reaction === baseReaction.reaction){
            reactWithCount.count += 1;
            reactWithCount.users.push(baseReaction.user);
          }
        })
      }

    })
  }

  return (
    <div className={`absolute bottom-0 ${isOwnMessage ? 'right-0' : 'left-0'}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded-full bg-gray-600 hover:bg-gray-500 cursor-pointer text-gray-400 text-sm flex items-center gap-1 translate-y-4 transition-colors`}
      >
        {reactions.length <= 0 && (
          <div className="flex items-center gap-0.5">
            <Plus className="w-4 h-4"/>
            <Smile className="w-4 h-4" />
          </div>
        )}

        {reactionsWithCount.length > 0 && (
          <div className="flex items-center gap-1">
            <Plus className="w-4 h-4"/>
            {reactionsWithCount.map((reaction) => (
              <span key={reaction.reaction} className="text-sm">{reaction.reaction}</span>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className={`absolute z-20 -top-24 ${isOwnMessage ? 'right-0' : 'left-0'} flex gap-2 p-2 bg-gray-800 border border-gray-700 rounded-full shadow-xl animate-in fade-in zoom-in duration-200`}>
            {EMOJIS.map((emoji) => {
              let isEmojiSelected = reactions.find((r) => r.reaction === emoji && r.user.id === authUser?.id) !== undefined;
              
              return (
                <button
                  key={emoji}
                  onClick={() => {
                    onAddReaction(messageId, emoji);
                    setIsOpen(false);
                  }}
                  className={`hover:scale-125 transition-transform text-lg px-1 ${isEmojiSelected ? 'bg-blue-500' : ''} rounded-full`}
                >
                  {emoji}
                </button>
              )
            }
            )}
          </div>

          {reactionsWithCount.length > 0 && (
            <div className={`min-w-30 max-w-50 w-full absolute -top-10 ${isOwnMessage ? 'right-full' : 'left-full'} z-10 p-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm`} onClick={() => setIsOpen(false)}>
              <p>Réactions</p>

              <ul className="mt-2 space-y-3">
                {reactionsWithCount.map((reactWithCount, index) => {
                  

                  return (
                    <li key={index} className="">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-lg">{reactWithCount.reaction}</span>
                        <span>{reactWithCount.count}</span> 
                      </div>
                      <ul className="space-y-0.5">
                        {reactWithCount.users.map((user, index) => (
                          <li key={index} className='text-right'>{user.username}</li>
                        ))}
                      </ul>
                    </li>
                  )
                })
              }
              </ul>

            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReactionSlot