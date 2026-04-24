'use client';
import React from 'react'
import ChatSection from './ChatSection'
import DiscussionList from './DiscussionList'
import { useDiscussionListStore } from '../stores/DiscussionListStore';

function ChatOrganism() {
  const activeDiscussion = useDiscussionListStore((state) => state.activeDiscussion);
  
  return (
    <>
      {activeDiscussion.id !== '' ? (
        <ChatSection />
      ): (
        <>
          <div className="flex-1 items-center justify-center p-6 border-r border-r-gray-200 overflow-x-hidden hidden md:flex">
            <p className="text-gray-500">Aucune discussion active</p>
          </div>
        </>
      )}
      
      <DiscussionList />
    </>
  )
}

export default ChatOrganism