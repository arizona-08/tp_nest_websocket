import { searchUsers } from '@/features/users/users';
import { User } from '@/types/user';
import React, { useEffect } from 'react'
import CTA from '../ui/CTA';
import { useAuthStore } from '../stores/AuthStore';

function AddUserModal() {
  const suggestedUsers = [
    {
      username: "danielgarcia",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      username: "diegomontana",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
  ]

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<User[]>([]);

  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if(searchQuery) {
        const response = await searchUsers(searchQuery);
        const result = await response.json();
        setResults(result);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery])

  return (
    <div className="fixed z-50 inset-0 bg-black/25 bg-opacity-50 flex flex-col items-center justify-center ">
      <div className="bg-white p-4 rounded-md min-w-80 max-w-90 w-full">
        <div className=" flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-semibold">Ajouter un utilisateur</h1>

          <input
            type="text"
            placeholder="Entrez un nom d'utilisateur"
            className="p-2 outline-none border border-gray-200 rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                {authUser && authUser.username !== user.username && (
                  <CTA type="button" color="primary" text="Ajouter" onClick={() => console.log("Ajouter", user.username)}/>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AddUserModal