import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [users, setUsers] = useState([])

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then((res) => {
      // console.log(res.data)
      setUsers(res.data)
    })
  }
  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <>
      <div className="container">
        <h3>CRUD App</h3>
        <div className="input-sreach">
          <input type="search" name="" id="" />
          <button type="button">Add</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {users &&
              users.map((users, index) => {
                return (
                  <tr key={users.id}>
                    <td> {index +1} </td>
                    <td> {users.name} </td>
                    <td> {users.age} </td>
                    <td> {users.city} </td>
                    <td>
                      <button className='edit-btn' type="button">Edit</button>
                    </td>
                    <td>
                      <button className='delete-btn' type="button">Delete</button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div >
    </>
  )
}

export default App
