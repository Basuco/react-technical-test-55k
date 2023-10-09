import { SortBy, type User } from '../types.d.ts';

interface Props {
    users: User[],
    showColors: boolean,
    deleteUser: (userId: string) => void,
    sortColumn: (sort: SortBy) => void
}

export function UsersList({  users, showColors, deleteUser, sortColumn }: Props) {
    return (
        <table width='100%'>
            <thead>
                <th>Foto</th>
                <th className="pointer" onClick={() => sortColumn(SortBy.NAME)}>First name</th>
                <th className="pointer" onClick={() => sortColumn(SortBy.LAST)}>Last name</th>
                <th className="pointer" onClick={() => sortColumn(SortBy.COUNTRY)}>Country</th>
                <th>Actions</th>
            </thead>

            <tbody>
                {
                    users.map((user, index) => {
                        const backgroundColor = index % 2 === 0 ? '#333' : '#555'
                        const color = showColors ? backgroundColor : 'transparent' 
                        return (
                        <tr style={{backgroundColor: color}} key={user.login.uuid}>
                            <td>
                                <img src={user.picture.thumbnail} />
                            </td>
                            <td>{user.name.first}</td>
                            <td>{user.name.last}</td>
                            <td>{user.location.country}</td>
                            <td><button onClick={() => deleteUser(user.login.uuid)}>Delete</button></td>
                        </tr>)
                    })
                }
            </tbody>
        </table>
    )
}