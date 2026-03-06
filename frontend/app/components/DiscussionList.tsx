'use client';
import { useDiscussionListStore } from '../stores/DiscussionListStore'

function DiscussionList() {
  const discussions = [
    {
      id: '111',
      name: 'Daniel Garcia',
      lastMessage: 'Hey, comment ça va?'
    },
    {
      id: '111',
      name: 'tom tom',
      lastMessage: 'fdsfv?'
    },
    {
      id: '111',
      name: 'dingo',
      lastMessage: 'fdfdbdftg'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
    {
      id: '111',
      name: 'mickey',
      lastMessage: 'trfbgbnc'
    },
  ]

  const isDiscussionListOpen = useDiscussionListStore((state) => state.isDiscussionListOpen)
  const closeDiscussionList = useDiscussionListStore((state) => state.close)

  return (
    <aside className={`relative border-r border-gray-100 flex flex-col overflow-y-auto ${isDiscussionListOpen ? 'w-full' : 'w-0'} transition-all duration-300 md:w-1/3 lg:w-1/4`}>
      <div className="p-4 font-bold text-xl sticky top-0 bg-white">Messages</div>
      {/* Boucle sur vos discussions ici */}
      <div className="flex-1">
        {discussions.map((discussion) => (
          <div className='px-2 py-3 cursor-pointer hover:bg-gray-200' onClick={() => closeDiscussionList('111')}>
            <p className="font-semibold">{discussion.name}</p>
            <p className="text-sm text-gray-500">{discussion.lastMessage}</p>
          </div>
        ))}
          {/* Composant DiscussionItem... */}
      </div>
    </aside>
  )
}

export default DiscussionList