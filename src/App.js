import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// const API_HOST = 'http://127.0.0.1:5000';
const API_HOST = process.env.REACT_APP_API_HOST;
const SSO_HOST = process.env.REACT_APP_SSO_HOST;

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [inputEmail, setInputEmail] = useState('');
    const [uuid, setUuid] = useState('');
    const [amount, setAmount] = useState('');
    const [page, setPage] = useState('login');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${SSO_HOST}/auth/login`, {
                email,
                password,
            });
            setToken(response.data.token);
            setLoggedIn(true);
            setPage('main');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleLogout = () => {
        setEmail('');
        setPassword('');
        setToken('');
        setLoggedIn(false);
        setInputEmail('');
        setUuid('');
        setAmount('');
        setPage('login');
    };

    const handleGetUuid = async () => {
        try {
            const response = await axios.get(`${SSO_HOST}/user/find?email=${inputEmail}`,{
                headers: {
                    Authorization: `Bearer ${token}`, // 将token添加到Authorization header中
                }
            });
            console.log(response.data)
            setUuid(response.data.identifier);
        } catch (error) {
            console.error('Get UUID error:', error);
        }
    };

    const handleAirdrop = async () => {
        try {
            const response = await axios.post(
                `${API_HOST}/airdrop`,
                {
                    uuid,
                    amount,
                },
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert(response.data.message);
        } catch (error) {
            console.error('Airdrop error:', error);
        }
    };

    if (page === 'login') {
        return (
            <div className="container">
                <h1>Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
        );
    } else {
        return (
            <div className="container">
                <h1>Welcome, {email}</h1>
                <button onClick={handleLogout}>Logout</button>
                <div className="section">
                    <h1>GET UUID</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                    />
                    <button onClick={handleGetUuid} disabled={!loggedIn}>
                        Get UUID
                    </button>
                    <input type="text" placeholder="UUID" value={uuid} readOnly />
                </div>

                <div className="section">
                    <h1>AIRDROP AGI</h1>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={handleAirdrop} disabled={!loggedIn}>
                        Airdrop
                    </button>
                </div>
            </div>
        );
    }
}

export default App;
