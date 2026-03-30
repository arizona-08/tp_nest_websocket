import { searchUsers } from '@/features/users/users';
import { User } from '@/types/user';
import React, { useEffect } from 'react'
import CTA from '../ui/CTA';
import { useAddUserModalStore } from '../stores/AddUserModal';
import { useAuthStore } from '../stores/AuthStore';
import { createPrivateDiscussion, createGroupDiscussion } from '@/features/discussion/create-discussion';
import { set } from 'zod';

interface AddUserModalProps {
  refetchDiscussions: () => void;
}

function AddUserModal({ refetchDiscussions }: AddUserModalProps) {

  const isAddUserModalOpen = useAddUserModalStore((state) => state.isAddUserModalOpen);
  const closeAddUserModal = useAddUserModalStore((state) => state.closeAddUserModal);

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<User[]>([]);

  const authUser = useAuthStore((state) => state.user);

  const [discussionType, setDiscussionType] = React.useState<"PRIVATE" | "GROUP">("PRIVATE");
  const [groupName, setGroupName] = React.useState<string>("");
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);
  const [historyMode, setHistoryMode] = React.useState<"all" | "from_join">("all");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if(searchQuery) {
        const response = await searchUsers(searchQuery);
        const result = await response.json();
        setResults(result);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);


  async function handleAddUser(userId: string){
    const response = await createPrivateDiscussion(userId);
    const result = await response.json();
    console.log(result);
    closeAddUserModal();
    refetchDiscussions();
  }

  function toggleSelectedUser(userId: string) {
    setSelectedUserIds((prev) => 
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function handleCreateGroup() {
    if(!groupName.trim())return;
    if(selectedUserIds.length === 0) return;
    const response = await createGroupDiscussion(groupName.trim(), selectedUserIds, historyMode);
    await response.json();
    setGroupName("");
    setSelectedUserIds([]);
    setHistoryMode("all");
    closeAddUserModal();
    refetchDiscussions();
  }

  return (
    <div className={`fixed z-50 inset-0 bg-black/25 bg-opacity-50 flex flex-col items-center justify-center ${isAddUserModalOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white p-4 rounded-md min-w-80 max-w-90 w-full">
        <div className=" flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-semibold">Ajouter un utilisateur</h1>
          <div className="flex gap-2 w-full"> 
            <button type="button" className={`px-3 py-1 rounded-md border ${discussionType === "PRIVATE" ? "bg-gray-900 text-white" : "bg-white"}`} onClick={() => setDiscussionType("PRIVATE")}>
              Privé
            </button>
            <button type="button" className={`px-3 py-1 rounded-md border ${discussionType === "GROUP" ? "bg-gray-900 text-white" : "bg-white"}`} onClick={() => setDiscussionType("GROUP")}>
              Groupe
            </button>
          </div>

          <input
            type="text"
            placeholder="Entrez un nom d'utilisateur"
            className="p-2 outline-none border border-gray-200 rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {discussionType === "GROUP" && (
            <div className="w-full space-y-2">
              <input type="text" placeholder="Nom du groupe" className="p-2 outline-none border border-gray-200 rounded-md w-full" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              <select className="p-2 outline-none border border-gray-200 rounded-md w-full" value={historyMode} onChange={(e) => setHistoryMode(e.target.value as "all" | "from_join")}>
                <option value="all">Les invités voient tout l'historique</option>
                <option value="from_join">Les invités voient seulement après leur arrivée</option>
              </select>
            </div>
          )}
        </div>
        <div className="suggested-users mt-4">
          {results && results.length > 0 && results.map((user) => (
            <div key={user.username} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className='w-6 h-6 bg-gray-400 rounded-full'>

                </div>
                <span className="inline-block">{user.username}</span>
              </div>

              <div>
                {authUser && authUser.username !== user.username && discussionType === "PRIVATE" &&(
                  <CTA type="button" color="primary" text="Ajouter" onClick={() => handleAddUser(user.id)}/>
                )}

                {authUser && authUser.username !== user.username && discussionType === "GROUP" &&(
                  <CTA type="button" color={selectedUserIds.includes(user.id) ? "secondary" : "primary"} text={selectedUserIds.includes(user.id) ? "Retirer" : "Sélectionner"} onClick={() => toggleSelectedUser(user.id)}/>
                )}
              </div>
            </div>
          ))}
        </div>

        {discussionType === "GROUP" && (
          <div className='flex justify-end mt-4'>
            <CTA type="button" color="primary" text="Créer le groupe" onClick={handleCreateGroup}/>
          </div>
        )}

        <div className='flex justify-end mt-8'>
          <CTA type="button" color="secondary" text="Fermer" onClick={closeAddUserModal}/>
        </div>
      </div>
    </div>
  )
}

export default AddUserModal