import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

//components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
import Message from './components/layout/Message';

//Pages
import Login from './components/pages/Auth/Login';
import Profile from './components/pages/User/Profile';
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home';

//Context
import {UserProvider} from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
         <Message />
          <Container>
            <Routes>        
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/" element={<Home />}/>
              <Route path='/user/profile' element={<Profile />}/>
            </Routes>
          </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
