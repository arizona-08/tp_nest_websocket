'use client';
import { Discussion } from '@/types/discussion';
import { useDiscussionListStore } from '../stores/DiscussionListStore'
import { CircleUserRound, UserPlus } from 'lucide-react';
import AddUserModal from './AddUserModal';
import { useAddUserModalStore } from '../stores/AddUserModal';
import { useEffect, useState } from 'react';
import { fetchMyDiscussions, getGeneralDiscussion } from '@/features/discussion/get-my-discussions';
import { useAuthStore } from '../stores/AuthStore';
import { formatDiscussionName } from '@/utils/discussion';
import { formatDate } from '@/utils/date';
import { useSearchParams } from 'next/navigation';

function DiscussionList() {
  const isDiscussionListOpen = useDiscussionListStore((state) => state.isDiscussionListOpen)
  const closeDiscussionList = useDiscussionListStore((state) => state.close)
  const openAddUserModal = useAddUserModalStore((state) => state.openAddUserModal);7
  const authUser = useAuthStore((state) => state.user);
  const activeDiscussion = useDiscussionListStore((state) => state.activeDiscussion);
  const setActiveDiscussion = useDiscussionListStore((state) => state.setActiveDiscussion);
  const searchParams = useSearchParams();
  const typeQuery = searchParams.get("type");

  
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  const filteredDiscussions = discussions.filter((discussion) => {
    if(typeQuery === "group") return discussion.type === "GROUP";
    return discussion.type === "PRIVATE";
  });
 
  const getMydiscussions = async () => {
    const response = await fetchMyDiscussions(typeQuery || "messages");
    const result = await response.json();
    setDiscussions(result);
    setActiveDiscussion(result.length > 0 ? { id: result[0].id, name: result[0].name } : { id: "", name: "" }); // Set the first discussion as active by default
  };

  useEffect(() => {
    if(typeQuery === "general") return;
    getMydiscussions();
  }, [])

  useEffect(() => {
    if(typeQuery === "general") {
      
      const fetchGeneralDiscussion = async () => {
        const response = await getGeneralDiscussion();
        const generalDiscussion = await response.json();

        setActiveDiscussion({
          id: generalDiscussion.id,
          name: generalDiscussion.name
        });

      }

      fetchGeneralDiscussion();
    }
  }, [activeDiscussion.id])

  return (
    <aside className={`relative border-r border-gray-100 flex flex-col overflow-y-auto ${isDiscussionListOpen ? 'w-full' : 'w-0'} transition-all duration-300 md:w-1/3 lg:w-1/4`}>
      <AddUserModal refetchDiscussions={getMydiscussions}/>
      <div className="p-4 font-bold text-xl sticky top-0 bg-white flex items-center justify-between">
        <h2>Message</h2>
        <UserPlus className="w-10 h-10 p-2 hover:bg-gray-100 rounded-md" onClick={openAddUserModal}/>
      </div>
      <div className="flex-1">
        {filteredDiscussions.map((discussion) => {
          const discussionName = formatDiscussionName(discussion, authUser?.id || "");

          return (
            <div key={discussion.id} className={`px-2 py-3 cursor-pointer hover:bg-gray-200 flex items-center gap-3 ${activeDiscussion.id === discussion.id ? 'bg-gray-200' : ''}`}
              onClick={() => {
                closeDiscussionList()
                
                if(activeDiscussion.id !== discussion.id) {
                  setActiveDiscussion({ id: discussion.id, name: discussionName });
                }
              }}
            >
              <CircleUserRound />
              <div className="w-full">
                <div className=" flex items-center justify-between">
                  <p className="font-semibold">{discussionName}</p>
                  { discussion.messages.length > 0 ? (
                    <p className="text-xs text-gray-600">{formatDate(discussion.lastMessageAt)}</p>
                  ) : null }
                </div>
                {discussion.messages.length > 0 ? (
                  <p className="text-sm text-gray-500">{discussion.messages[0].content}</p>
                ) : (
                  <p>Aucun message pour le moment</p>
                ) }
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default DiscussionList