import React, {useState} from 'react';
import Dashboard from './pages/dashboard/Dashboard'
import {BrowserRouter} from 'react-router-dom'
import Login from './pages/Login'
import api from './services/api'

function App() {

    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem('loggedIn') === 'true' || false)

    const login = (responseData) => {
        setLoggedIn(true)
        sessionStorage.setItem('loggedIn', true)
        sessionStorage.setItem('userId', responseData.id)
        sessionStorage.setItem('roleId', responseData.role_id)
    }

    const logout = () => {
        api.get('/logout')
            .then(response => {
                if (response.status === 204) {
                    setLoggedIn(false)
                    sessionStorage.clear()
                }
            })
    }

    return (
        <BrowserRouter>
            {loggedIn ? <Dashboard logout={logout}/> : <Login login={login} />}
        </BrowserRouter>
    );
}

export default App;
