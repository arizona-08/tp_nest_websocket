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

function ReactionSlot({ authUser, messageId, isOwnMessage, onAddReaction, reactions }: ReactionSlotProps) {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className={`absolute bottom-0 ${isOwnMessage ? 'right-0' : 'left-0'}`}>
      {/* Bouton déclencheur */}
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

        {reactions.length > 0 && (
          <div className="flex items-center gap-1">
            <Plus className="w-4 h-4"/>
            {reactions.map((reaction) => (
              <span key={reaction.id} className="text-sm">{reaction.reaction}</span>
            ))}
          </div>
        )}
      </div>

      {/* Menu de sélection des Emojis */}
      {isOpen && (
        <>
          {/* Overlay invisible pour fermer en cliquant ailleurs */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className={`absolute z-20 -top-24 ${isOwnMessage ? 'right-0' : 'left-0'} flex gap-2 p-2 bg-gray-800 border border-gray-700 rounded-full shadow-xl animate-in fade-in zoom-in duration-200`}>
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onAddReaction(messageId, emoji);
                  setIsOpen(false);
                }}
                className="hover:scale-125 transition-transform text-lg px-1"
              >
                {emoji}
              </button>
            ))}
          </div>

          {reactions.length > 0 && (
            <div className={`min-w-30 absolute top-12 ${isOwnMessage ? 'right-0' : 'left-0'} z-10 p-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm`} onClick={() => setIsOpen(false)}>
              <p>Réactions</p>

              <ul className="mt-2">
                {reactions.map((reaction) => (
                  <li key={reaction.id} className="flex items-center gap-2">
                    <span className="text-lg">{reaction.reaction}</span>
                    <span>1</span> {/* Ici on pourrait afficher le nombre de réactions pour chaque emoji */}
                  </li>
                ))}
              </ul>

            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReactionSlot