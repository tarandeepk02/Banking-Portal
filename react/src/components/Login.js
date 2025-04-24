import React, { useState } from 'react';

const Login = ({databaseHandler }) => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  

        try {
            const res = await fetch('/api/users/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userRole', data.user.role);
                
                const userRes = await fetch('/api/users/details', {
                    headers: {
                      Authorization: `Bearer ${data.token}`
                    }
                  });
                  
                  const contentType = userRes.headers.get('content-type');
                  if (!contentType || !contentType.includes('application/json')) {
                    const text = await userRes.text();
                    return;
                  }
                  
                  const userData = await userRes.json();
                  
            
            databaseHandler()
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    return (
        <div class="flex-grow-1">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4 mx-auto mt-5 mb-5">
            <div class="card">
            <div class="card-header text-center">Login to your Portal</div>
            <div class="card-body">
            <form onSubmit={handleSubmit}>
                <div class="mb-3">
                    <label class="form-label">Enter Email ID<span className='text-danger'>*</span></label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        class="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div class="mb-3">
                    <label class="form-label">Enter your Password<span className='text-danger'>*</span></label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        class="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2">Login</button>
            </form>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Login;
