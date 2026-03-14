'use client';
import { Discussion } from '@/types/discussion';
import { useDiscussionListStore } from '../stores/DiscussionListStore'

function DiscussionList() {
  const discussions: Discussion[] = [
    // {
    //   id: '111',
    //   name: 'Daniel Garcia',
    //   lastMessage: 'Hey, comment ça va?'
    // },
    // {
    //   id: '111cd',
    //   name: 'tom tom',
    //   lastMessage: 'fdsfv?'
    // },
    // {
    //   id: '11dsdvc1',
    //   name: 'dingo',
    //   lastMessage: 'fdfdbdftg'
    // },
    // {
    //   id: '11fdg1ee',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11fvgb1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11fbfgf1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11dfg1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11fdgdf1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11fdg1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '1fg11',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11sdfgr1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '1sfrg11',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '1fdght11',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11fgbf1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11fdgt1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11fdddg1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
    // {
    //   id: '11gfhyre1',
    //   name: 'mickey',
    //   lastMessage: 'trfbgbnc'
    // },
  ]

  const isDiscussionListOpen = useDiscussionListStore((state) => state.isDiscussionListOpen)
  const closeDiscussionList = useDiscussionListStore((state) => state.close)

  return (
    <aside className={`relative border-r border-gray-100 flex flex-col overflow-y-auto ${isDiscussionListOpen ? 'w-full' : 'w-0'} transition-all duration-300 md:w-1/3 lg:w-1/4`}>
      <div className="p-4 font-bold text-xl sticky top-0 bg-white">Messages</div>
      {/* Boucle sur vos discussions ici */}
      <div className="flex-1">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => closeDiscussionList(discussion.id)}>
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