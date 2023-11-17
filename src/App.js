import {BrowserRouter as Router , Routes ,Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Analysis from './components/Analysis';
import HardWares from './components/Hardwares.jsx';
import LoginSignupPage from './components/LoginSignupPage.jsx';
import { useState } from 'react';
import { Button } from '@chakra-ui/react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/analysis' element={<Analysis />} />
        <Route path='/hardwares' element={<HardWares />} />
        <Route path="/login" element={<LoginSignupPage onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    </Router>
  );
};


export default App;
