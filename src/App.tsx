import { useEffect, useState, useRef, useMemo } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import { UsersList } from './components/UsersList.tsx'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const originalUsers = useRef<User[]>([])
  // useRef is to store a value
  // that we want to be preserved between renders
  // but when it change, do not render again the component
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const toogleColors = () => setShowColors(!showColors);
  const toogleSortByCountry = () => {
    const newSortingValue = sorting == SortBy.NONE ? SortBy.COUNTRY: SortBy.NONE  
    setSorting(newSortingValue);
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
    .then(res => res.json())
    .then(res => {
      setUsers(res.results)
      originalUsers.current = res.results
    })
    .catch(error => console.error(error))
  }, [])

  // Filter by country
  const filteredUsers = useMemo(() =>{ 
                        return filterCountry != null && filterCountry.length > 0 ? 
                              users.filter(user => user.location.country.toLocaleLowerCase().includes(filterCountry.toLocaleLowerCase())) 
                              : users
                        },
                        [users, filterCountry])

  // asc sort
  const compareProperties: Record<string, (user: User) => any> = {
    [SortBy.NAME] : user => user.name.first,
    [SortBy.LAST] : user => user.name.last,
    [SortBy.COUNTRY] : user => user.location.country
  }

  const sortedUsers = useMemo(() => {
      const compareFn = compareProperties[sorting]
      return sorting != SortBy.NONE ? 
            // Sort mutate the state so we need to copy 'users', could be with [...users]
            // or there is a new js function (maybe not supported everywhere, all browsers) toSorted that already makes the copy
            // Maybe there is a ts error cause the toSorted doesn't exists for them you could update the protorype of array.
            filteredUsers.toSorted((a, b) => compareFn(a).localeCompare(compareFn(b)))
            : filteredUsers
      },
      [filteredUsers, sorting]) 

  const handleDelete = (userId: string) => {
    const filteredUsers = users.filter(user => user.login.uuid != userId)
    setUsers(filteredUsers)
  }

  const handleResetUsers = () => setUsers(originalUsers.current)

  const handleSetSort = (sort: SortBy) => {
    setSorting(sort);
  }

  return (
    <>
      <div className='App'>
        <h1>Technical Test</h1>
        <header>
          <button onClick={toogleColors}>
            Color rows
          </button>

          <button onClick={toogleSortByCountry}>
            Sort by country
          </button>

          <button onClick={handleResetUsers}>
            Reset users
          </button>

          <input type="string" placeholder='Filter by country' onChange={(e) => setFilterCountry(e.target.value)}></input>
        </header>
        <UsersList sortColumn={handleSetSort} deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
      </div>
    </>
  )
}

export default App
