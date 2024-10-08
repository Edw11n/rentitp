import React, {useState} from 'react';
import { UserProvider } from './UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Account from './components/Account';
import Join from './components/Join';
import ProtectedRoute from './ProtectedRoute';
import './App.css'

function App() {
  const [showJoin, setShowJoin] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
  return (
    <UserProvider>
      <Router>
      <Navbar 
                goToJoin={() => setShowJoin(true)}
                showAccount={showAccount}
                setShowAccount={setShowAccount} 
            />
        {showJoin && <Join onClose={() => setShowJoin(false)} />}
        {showAccount && <Account onClose={() => setShowAccount(false)} />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;