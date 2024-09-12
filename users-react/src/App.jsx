import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [users, setUsers] = useState([])
  const [filterusers, setFilterusers] = useState([])
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [userData, setUserData] = useState({ name: "", age: "", city: "" })

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then((res) => {
      // console.log(res.data)
      setUsers(res.data);
      setFilterusers(res.data);
    })
  }
  useEffect(() => {
    getAllUsers()
  }, [])


  // Search function
  const handleSearchChange = (e) => {
    const searchTest = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) => {

      return (
        user.name.toLowerCase().includes(searchTest) ||
        user.age.toString().includes(searchTest) ||
        user.city.toLowerCase().includes(searchTest)
      )
    }
    )
    setFilterusers(filteredUsers)
  }


  // Delete Function 
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Do you want to delete this data")
    if (isConfirmed) {
      await axios.delete(`http://localhost:8000/users/${id}`)
        .then((res) => {
          setUsers(res.data);
          setFilterusers(res.data)
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
    // closeModal()
  }

  // close modal
  const closeModal = () => {
    setIsModelOpen(false)
    getAllUsers()
  }


  // Add User
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" })
    setIsModelOpen(true)
  }
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (userData.id) {
      await axios.patch(`http://localhost:8000/users/${userData.id}`, userData).then((res) => {
        alert("User updated successfully!");
        console.log("User updated:",res.data)
      }).catch((error) => {
        console.error("Error submitting data:", error);
      });
    } else {
      await axios.post("http://localhost:8000/users/", userData).then((res) => {
        alert("User added successfully!");
        console.log("User created:", res.data)
      }).catch((error) => {
        console.error("Error submitting data:", error);
      });
    }
    closeModal()
    setUserData({ name: "", age: "", city: "" })
  }

  // update user
  const handleUpdateRecoed = (user) => {
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) { // User exists
      setUserData(user);
      setIsModelOpen(true);
    } else {
      console.error("User with ID", user.id, "not found!");
      // Optionally show an error message to the user
    }
  };
  // const handleUpdateRecoed = (user) => {
  //   setUserData(user);
  //   setIsModelOpen(true)
  // }

  return (
    <>
      <div className="container">
        <h3>CRUD App</h3>
        <div className="input-sreach">
          <input type="search" name="" id=""
            placeholder='Search test here!'
            onChange={handleSearchChange} />
          <button type="button" onClick={handleAddRecord} >Add</button>
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
            {filterusers &&
              filterusers.map((user, index) => {
                return (
                  <tr key={user.id} >
                    <td> {index + 1} </td>
                    <td> {user.name} </td>
                    <td> {user.age} </td>
                    <td> {user.city} </td>
                    <td>
                      <button className='edit-btn' type="button" onClick={() => handleUpdateRecoed(user)}>Edit</button>
                    </td>
                    <td>
                      <button className='delete-btn' onClick={() => handleDelete(user.id)} type="button">Delete</button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>User Record</h2>

              <div className="inp-grout">
                <input type="text" name="name" id="name" placeholder='Full Name' value={userData.name} onChange={handleData} />
              </div>
              <div className="inp-grout">
                <input type="text" name="age" id="age" placeholder='Age' value={userData.age} onChange={handleData} />
              </div>
              <div className="inp-grout">
                <input type="text" name="city" id="city" placeholder='City' value={userData.city} onChange={handleData} />
              </div>
              <button type="button" onClick={handleSubmit}>Add User</button>
              {/* <div className="inp-grout">
                <label htmlFor="name">Full Name</label>
                <input type="text" name="name" id="name" />
              </div> */}

            </div>
          </div>
        )}
      </div >
    </>
  )
}

export default App
