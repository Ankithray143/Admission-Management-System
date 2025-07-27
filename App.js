import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Components
const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
            <Link className="navbar-brand" to="/">College Name</Link>
            <div className="navbar-nav">
                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/about">About</Link>
                <Link className="nav-link" to="/login">Login</Link>
            </div>
        </div>
    </nav>
);

const Home = () => (
    <div>
        <div className="hero">
            <div className="container">
                <h1>Welcome to Our College</h1>
                <p>Empowering minds, Building futures</p>
            </div>
        </div>
    </div>
);

const About = () => (
    <div className="container mt-5">
        <h2>About Us</h2>
        <p>Our college is committed to providing quality education...</p>
    </div>
);

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add authentication logic here
        onLogin();
    };

    return (
        <div className="container">
            <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">Login</h2>
                <div className="mb-3">
                    <input
                        id="username"
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    />
                </div>
                <div className="mb-3">
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};

const AdmissionForm = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        admissionType: '',
        admissionBy: '',
        fee: '',
        motherName: '',
        fatherName: '',
        email: '',
        phone: '',
        category: '',
        course: '',
        address: '',
        profilePhoto: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
    };

    return (
        <div className="container">
            <form className="admission-form" onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">Admission Form</h2>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Student Name"
                            value={formData.studentName}
                            onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Admission Type"
                            value={formData.admissionType}
                            onChange={(e) => setFormData({...formData, admissionType: e.target.value})}
                        />
                    </div>
                    {/* Add more form fields here */}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple validation - replace with your actual authentication logic
        if (username === 'admin' && password === 'admin123') {
            setIsLoggedIn(true);
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    {isLoggedIn && <Route path="/admission" element={<AdmissionForm />} />}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
