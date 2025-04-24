import React, { useState, useEffect } from 'react';
import { InternalTransferForm, ExternalTransferForm } from './transferForms.js';
import 'bootstrap/dist/css/bootstrap.min.css'
import Greeting from '../utils/greatings.js';
import '../style.css';

const Dashboard = ({ onLogout }) => {
    const [transferType, setTransferType] = useState('internal');
    const [userData, setUserData] = useState(null);
    const [form, setForm] = useState({
        senderAccount: '',
        receiverAccount: '',
        receiverEmail: '',
        amount: ''
    });
    const [TransferFormComponent, setTransferFormComponent] = useState(() => () => null);
    

    const [transactions, setTransactions] = useState([]);
  
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    
    const [showProfile, setShowProfile] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [originalEmail, setOriginalEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [transactionLoading, setTransactionLoading] = useState(false)
    const [accountLoading, setAccountLoading] = useState(false)
    const [typeFilter, setTypeFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const userRes = await fetch('/api/users/userData', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userData = await userRes.json();

                if (!userRes.ok) {
                    console.error("Failed to fetch user data:", userData.message);
                    setLoading(false);
                    return;
                }

                const transactionRes = await fetch(`/api/users/transactions?userId=${userData.userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const transactionsData = await transactionRes.json();

                if (!transactionRes.ok) {
                    console.error("Failed to fetch transactions:", transactionsData.message);
                    setLoading(false);
                    return;
                }

                //  setting a delay to show loading second delay
                setTimeout(() => {
                    setUserData(userData);
                    setTransactions(transactionsData);
                    setProfileForm({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        phoneNumber: userData.phoneNumber
                    });
                    setOriginalEmail(userData.email);
                    setLoading(false); // hide loading screen
                }, 1200);

            } catch (err) {
                console.error("❌ Error loading dashboard:", err);
                setLoading(false);
            }
        };

        fetchAllData();
    }, [refreshTrigger]);

    useEffect(() => {
        setTransferFormComponent(() => transferType === 'internal' ? InternalTransferForm : ExternalTransferForm);
        setForm({ senderAccount: '', receiverAccount: '', receiverEmail: '', amount: '' });
    }, [transferType]);
   
    //handle changes in transaction form 
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    //handle transaction form submission 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) return alert('Login required');

        const res = await fetch('/api/users/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ...form, transferType })
        });

        const data = await res.json();
        if (res.ok) {
            alert('Transfer successful');
            setRefreshTrigger(prev => !prev);
            setForm({ senderAccount: '', receiverAccount: '', receiverEmail: '', amount: '' });
        } else {
            alert(data.message || 'Transfer failed');
        }
    };

   
    //handles the changes in profile of user 
    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };
    //thi smakes the feild editable 
    const handleProfileEdit = (field) => {
        setEditingField(field);
    };
    //this button cancel the editing field 
    const handleProfileCancel = () => {
        setProfileForm({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber
        });
        setEditingField(null);
    };
    //on click save it updates the profile 
    const handleProfileSave = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const res = await fetch('/api/users/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profileForm)
            });

            const result = await res.json();
            if (res.ok) {
                alert('Profile updated');
                setEditingField(null);
                if (profileForm.email !== originalEmail) {
                    alert("Email changed. Please login again.");
                    localStorage.removeItem('authToken');
                    onLogout();
                } else {
                    setRefreshTrigger(prev => !prev);
                }
            } else {
                alert(result.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error(err);
            alert('Server error');
        }
    };
    //function to filetr the transaction on basis  selected filetr using js filter method `
    const filteredTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        const startDate = startDateFilter ? new Date(startDateFilter) : null;
        const endDate = endDateFilter ? new Date(endDateFilter) : null;

        const isTypeMatch = !typeFilter || txn.type === typeFilter;
        const isAmountValid = !amountFilter || txn.amount <= parseFloat(amountFilter);
        const isStatusMatch = !statusFilter || txn.status === statusFilter;
        const isAfterStart = !startDate || txnDate >= startDate;
        const isBeforeEnd = !endDate || txnDate <= endDate;
        return isTypeMatch && isAmountValid && isStatusMatch && isAfterStart && isBeforeEnd;
    });

    return (
        <div className="container-fluid">
            <div className="row">
               
                <aside className="col-md-2 user-navbar border p-3">
                    <ul className="nav flex-column">
                        <li className="nav-item"><a className='nav-link' href="#dashboard">Dashboard</a></li>
                        <li className="nav-item"><a className='nav-link' href="#account">Accounts</a></li>
                        <li className="nav-item"><a className='nav-link' href="#Transactions">Transactions</a></li>
                        <li className="nav-item mt-3"><button className='btn btn-primary w-100' onClick={() => setShowProfile(!showProfile)}>My Profile</button></li>
                        <li className="nav-item"><button className='btn btn-danger w-100 mt-3' onClick={onLogout}>Logout</button></li>
                    </ul>

                    {showProfile && (
                        <div className='card mt-3' id="profile-panel">
                            <div className='card-header'>My Profile</div>
                            <div className='card-body'>
                                <p className="profile-field mb-1">
                                    <label className='fs-13'>Name:</label> <br />
                                    <span className='fs-13 text-success'>{profileForm.firstName} {profileForm.lastName}</span>
                                </p>
                                <p className="profile-field mb-1">
                                    <label className='fs-13'>Email ID:</label> <br />
                                    {editingField === "email" ? (
                                        <>
                                            <input className='form-control mb-1' type="email" name="email" value={profileForm.email} onChange={handleProfileChange} />
                                            <button className='btn btn-sm btn-success me-1' onClick={handleProfileSave}>Save</button>
                                            <button className='btn btn-sm btn-danger' onClick={handleProfileCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <span className='fs-13 text-success'>{profileForm.email}</span><br />
                                            <button className='btn btn-sm btn-warning' onClick={() => handleProfileEdit("email")}>Edit</button>
                                        </>
                                    )}
                                </p>
                                <p className="profile-field mb-1">
                                    <label className='fs-13'>Phone:</label> <br />
                                    {editingField === "phoneNumber" ? (
                                        <>
                                            <input className='form-control mb-1' type="text" name="phoneNumber" value={profileForm.phoneNumber} onChange={handleProfileChange} />
                                            <button className='btn btn-sm btn-success me-1' onClick={handleProfileSave}>Save</button>
                                            <button className='btn btn-sm btn-danger' onClick={handleProfileCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <span className='fs-13 text-success'>{profileForm.phoneNumber}</span><br />
                                            <button className='btn btn-sm btn-warning' onClick={() => handleProfileEdit("phoneNumber")}>Edit</button>
                                        </>
                                    )}
                                </p>

                            </div>
                        </div>
                    )}

                </aside>


                <div className="col-md-10">
                    {loading || transactionLoading || accountLoading ? (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted">Loading dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <div className='mt-2' id='dashboard'><Greeting /></div>

                            <h5 className='mt-3 mb-3'>Welcome {userData.firstName}!</h5>


                            <div className='card'>
                                <div className='card-header'>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            Your Accounts Information
                                        </div>
                                        
                                        <div className='col-md-3'>
                                            {(() => {
                                                let total = 0;
                                                userData.accounts.forEach(acc => total += acc.amount);
                                                return <h5 className='mb-0'>Total Balance: ${total}</h5>;
                                            })()}
                                        </div>
                                    </div>



                                </div>
                                <div className='card-body'>
                                    <div className='row'>
                                        {userData.accounts?.map((account, index) => (
                                            <div className='col-md-6' key={index}>
                                                <p><strong>Account Type:</strong> {account.accountType}</p>
                                                <p><strong>Account Number:</strong> {account.accountNumber}</p>
                                                <p><strong>Balance:</strong> ${account.amount}</p>

                                            </div>
                                        ))}

                                    </div>


                                </div>
                            </div>

                            <div className='card  mt-3'>
                                <div className='card-header'>
                                    <div className='row'>
                                        <div className='col-md-8'>
                                            Transfer
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='d-flex align-items-center justify-content-end fs-13'>
                                                <label className="me-2">Select Transfer Type</label>
                                                <select className="form-control w-auto fs-13" value={transferType} onChange={(e) => setTransferType(e.target.value)}>
                                                    <option value="internal">Between Own Accounts</option>
                                                    <option value="external">Interac e-transfer</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div className='card-body'>

                                    <TransferFormComponent
                                        form={form}
                                        onChange={handleChange}
                                        onSubmit={handleSubmit}
                                        accounts={userData?.accounts || []}
                                    />


                                </div>
                            </div>

                            <div className='card mt-3 mb-3'>
                                <div className='card-header'>Transaction History</div>
                                <div className='card-body'>
                                    <div className="row mb-3">
                                        <div className="col-md-2">
                                            <label className="form-label">Filter Type</label>
                                            <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                                <option value="">All</option>
                                                <option value="internal">Internal</option>
                                                <option value="external">External</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Max Amount</label>
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

                                    {transactions.length === 0 ? (
                                        <p>No transactions found.</p>
                                    ) : (
                                        <table className="table table-hover table-stripped table-bordered">
                                            <thead className='table-light'>
                                                <tr>
                                                    <th>TransactionId</th>
                                                    <th>Type</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Reason</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTransactions.map((txn, index) => (
                                                    <tr key={index} className="table-light">
                                                        <td>{txn.transactionId}</td>
                                                        <td>{txn.type}</td>
                                                        <td>${txn.amount}</td>
                                                        <td>{txn.status}</td>
                                                        <td>{txn.reason}</td>
                                                        <td>{new Date(txn.date).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}


                                </div>
                            </div>

                        </>
                    )}
                </div>
            </div>
        </div>
    );

};
export default Dashboard;