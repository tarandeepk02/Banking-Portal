import React, { useState } from 'react';
import  '../style.css'; 


function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
   
    e.preventDefault();

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        alert('User registered successfully');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      
      alert('Something went wrong');
    }
  };

  return (
    <div class="flex-grow-1">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4 mx-auto mt-5 mb-5">
        <div class="card">
            <div class="card-header text-center">Fill form to use our excellent services!</div>
            <div class="card-body">
      
      <form onSubmit={handleSubmit}>
      <div class="">
      <label class="form-label">First Name<span className='text-danger'>*</span></label>
      <input name="firstName" className='form-control' placeholder="First Name" onChange={handleChange} /> <br/>
      </div>
      <div class="">
      <label class="form-label">Last Name<span className='text-danger'>*</span></label>
      <input name="lastName" className='form-control' placeholder="Last Name" onChange={handleChange} /> <br/></div>
      <div class="">
      <label class="form-label">Email ID<span className='text-danger'>*</span></label>
      <input name="email" className='form-control' placeholder="Email ID" type="email" onChange={handleChange} /> <br/></div>
      <div class="">
      <label class="form-label">Password<span className='text-danger'>*</span></label>
      <input name="password" className='form-control' placeholder="Password" type="password" onChange={handleChange} /><br/></div>
      <div class="">
      <label class="form-label">Phone No.<span className='text-danger'>*</span></label>
        <input name="phoneNumber" className='form-control' placeholder="Phone No." onChange={handleChange} /><br/></div>
      <div class=""><button className='btn btn-primary w-100' type="submit">Register</button></div>
    </form>

      
    </div>
    </div> 
    </div>
    </div>
  );
}

export default Register;
