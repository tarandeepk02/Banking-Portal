import React, { useEffect, useState } from 'react';
import '../style.css';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [amountFilter, setAmountFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [refreshUsers, setRefreshUsers] = useState(true);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', status: '' });
  const [createUserForm, setCreateUserForm] = useState({ fisrtNmae: '', lastName: '', email: '', password: '', phoneNumber: '' });
  const [showUserForm, setShowUserForm] = useState(false)
  //satte to cehcku user creatiomn succesfull
  const [userCreationSuccess, setUserCreationSuccess] = useState(false);
  //user efefct to get all users data and refreshing on update 
  useEffect(() => {

    const token = localStorage.getItem('authToken');
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUsers(data);
        setRefreshUsers(false);
        console.log(userUpdateSuccess)
        setUserUpdateSuccess(false);
        setEditingUserId(null)
        setUserCreationSuccess(false)
      })

      .catch(err => console.error('Error fetching users:', err));
  }, [refreshUsers, userUpdateSuccess,userCreationSuccess]);
  //use efect to get transaction data and refresh on update 
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    let url = '/api/admin/transactions?';
    if (selectedUserId !== 'all') url += `userId=${selectedUserId}&`;
    if (amountFilter) url += `amount=${amountFilter}&`;
    if (statusFilter) url += `status=${statusFilter}&`;
    if (startDateFilter) url += `startDate=${startDateFilter}&`;
    if (endDateFilter) url += `endDate=${endDateFilter}&`;

    setLoading(true);
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      });
  }, [selectedUserId, amountFilter, statusFilter, startDateFilter, endDateFilter]);
  //delete user 
  const handleDeleteUser = (email, userId) => {
    const token = localStorage.getItem('authToken');
    fetch('api/admin/delete', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        userId: userId
      }),

    })
      .then(res => res.json())
      .then(response => {
        if (response.message === 'User and related transactions deleted successfully') {
          setRefreshUsers(true)
        } else {
          alert(response.message || 'Delete failed');
        }
      })
      .catch(err => {

        alert('An error occurred.');
      });
  }
  //updating user 
  const handleUpdateUser = (email) => {
    const token = localStorage.getItem('authToken');
    fetch('/api/admin/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
      }),
    })
      .then(res => res.json())
      .then(response => {
        if (response.message === 'Profile updated successfully.') {
          setEditingUserId(null);
          setUserUpdateSuccess(true);
        } else {
          alert(response.message || 'Update failed');
        }
      })
      .catch(err => {
        console.error('Error updating user:', err);
        alert('An error occurred.');
      });
  };//handle cancel update feild button 
  const handleUpdateUserCancel = () => {
    setEditingUserId(null);
  };
  //set filtered trabsaction on basis of userid or all 
  let filteredTransactions = [];

  if (Array.isArray(transactions)) {
    if (selectedUserId === 'all') {
      filteredTransactions = transactions;
    } else {
      filteredTransactions = transactions.filter(txn => txn.userId === selectedUserId);
    }
  }
  //hande new user creation by admin 
  const handleSubmission = async (e) => {
    e.preventDefault();
    console.log();
    console.log("Subbmision button gets aa call")
    
    const token = localStorage.getItem('authToken');
 

    try {
      const res = await fetch('/api/admin/admin/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createUserForm)
      });

      const data = await res.json();
      if (res.ok) {
        setShowUserForm(false)
        setUserCreationSuccess('true')
        
        
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };
  const handleChange = (e) => {
    
      // Update form state for each field
      setCreateUserForm({
        ...createUserForm,
        [e.target.name]: e.target.value, 
      });
    };
  



  return (
    <div className='container-fluid'>
      <div className="row">
        <aside className="col-md-2 user-navbar border p-3">
          <h5 className="btn btn-outline-success w-100">Admin Panel</h5>
          <ul className="nav flex-column">
            <li className="nav-item"><a className='nav-link' href="#dashboard">Dashboard</a></li>
            <li className="nav-item"><a className='nav-link' href="#users">User Management</a></li>
            <li className="nav-item"><a className='nav-link' href="#Transactions">Transactions</a></li>
            <li className="nav-item mt-3"><button className='btn btn-primary w-100' onClick={() => setShowUserForm(!showUserForm)}>Create User</button></li>

            <li className="nav-item"><button className='btn btn-danger w-100 mt-3' onClick={onLogout}>Logout</button></li>
          </ul>
          {showUserForm && (
            <div className='card mt-3' id="pNew-user">
              <div className='card-header'>New User</div>
              <div className='card-body'>
                <form >
               
                  <p className="profile-field mb-1">
                    <label className='fs-13'>Email:</label> <br />
                    <input
                      type="email"
                      name="email"
                      value={createUserForm.email}
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </p>

                  <p className="profile-field mb-1">
                    <label className='fs-13'>First Name:</label> <br />
                    <input
                      className='form-control mb-1'
                      type="text"
                      name="firstName"
                      value={createUserForm.firstName}
                      onChange={handleChange}
                      required
                    />
                  </p>

                  <p className="profile-field mb-1">
                    <label className='fs-13'>Last Name:</label> <br />
                    <input
                      className='form-control mb-1'
                      type="text"
                      name="lastName"
                      value={createUserForm.lastName}
                      onChange={handleChange}
                      required
                    />
                  </p>

               
                  <p className="profile-field mb-1">
                    <label className='fs-13'>Password:</label> <br />
                    <input
                      type="password"
                      name="password"
                      value={createUserForm.password}
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </p>

                  
                  <p className="profile-field mb-1">
                    <label className='fs-13'>Phone:</label> <br />
                    <input
                      className='form-control mb-1'
                      type="text"
                      name="phoneNumber"
                      value={createUserForm.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </p>

                 
                  <button type="submit"  onClick={handleSubmission}className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>
          )}

        </aside>

        <div className="col-md-10 p-3">
          <h5 className="mt-2 mb-4" id='dashboard'>Welcome to the Admin Dashboard!</h5>

          <div className="card">
            <div className="card-header">Users List</div>
            <div className="card-body">
              <table className="table table-stripped table-bordered mb-0">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email ID</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <React.Fragment key={`user-${user.userId}`}>
                      <tr onClick={() => setSelectedUserId(user.userId)} style={{ cursor: 'pointer' }}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                        <td>{user.role}</td>
                        <td><button className="btn btn-sm btn-warning ms-2" onClick={(e) => {
                          e.preventDefault();
                          setEditingUserId(user.userId);
                          setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, status: user.isActive });
                        }}>Edit</button>
                          <button className="btn btn-sm btn-warning ms-2" onClick={() => {
                            handleDeleteUser(user.email, user.userId)
                          }}
                          >Delete</button></td>

                      </tr>
                      {editingUserId === user.userId && (
                        <tr>
                          <td colSpan="6">
                            <div className="row g-2">
                              <div className="col-md-3">
                                <input type="text" className="form-control" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} placeholder="First Name" />
                              </div>
                              <div className="col-md-3">
                                <input type="text" className="form-control" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} placeholder="Last Name" />
                              </div>
                              <div className="col-md-3">
                                <input type="email" className="form-control" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email" />
                              </div>
                              <div className="col-md-3">
                                <input type="text" className="form-control" value={editForm.status ? "Active" : "Inactive"} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} placeholder="Status" />
                              </div>

                            </div>
                            <div className='row mt-1'>
                              <div className="col-md-9">

                              </div>
                              <div className="col-md-3 text-end">
                                <button className="btn btn-success btn-sm me-1" onClick={() => handleUpdateUser(user.userId, user.email, 'update')}>Update</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleUpdateUserCancel()}>Cancel</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">Recent Transactions</div>
            <div className="card-body">



              <div className='row mb-3'>
                <div className="col-md-2">
                  <label className="form-label">Filter by User</label>
                  <select className="form-select" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                    <option value="all">All Users</option>
                    {users.map(user => (
                      <option key={user.userId} value={user.userId}>{user.firstName} {user.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Amount less than</label>
                  <input type="number" className="form-control" value={amountFilter} onChange={(e) => setAmountFilter(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
                </div>
              </div>

              <table className="table table-bordered table-striped mb-0">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center"><strong>Loading...</strong></td></tr>
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn, index) => (
                      <tr key={`txn-${index}`}>
                        <td>{txn.transactionId}</td>
                        <td>{txn.userId}</td>
                        <td>${txn.amount}</td>
                        <td>{txn.status}</td>
                        <td>{new Date(txn.date).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="text-center">No transactions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;