// LoginSignupPage.jsx
import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { server } from '..';
import axios from 'axios';

const LoginSignupPage = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

  
    const handleLogin = async () => {
      try {
        const response = await axios.post(`${server}/login`, { username, password });
        localStorage.setItem('token', response.data.token); // Store the token
        onLoginSuccess(username);
        navigate('/');
      } catch (error) {
        setMessage('Invalid username or password.');
      }
    };
  
    const handleSignup = async () => {
      try {
        await axios.post(`${server}/signup`, { username, password });
        setMessage('Signup successful. You can now log in.');
        setIsLoginView(true);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setMessage('User already exists.');
        } else {
          setMessage('An error occurred during signup.');
        }
      }
    };
  
    return (
        <Box width="100%" maxW="md" mx="auto" mt="10%" p={5} boxShadow="lg">
        <VStack spacing={4}>
          {message && <Text>{message}</Text>}
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {isLoginView ? (
            <>
              <Button colorScheme="teal" onClick={handleLogin}>Login</Button>
              <Button variant="link" onClick={() => setIsLoginView(false)}>Don't have an account? Sign up</Button>
            </>
          ) : (
            <>
              <Button colorScheme="teal" onClick={handleSignup}>Sign Up</Button>
              <Button variant="link" onClick={() => setIsLoginView(true)}>Already have an account? Login</Button>
            </>
          )}
        </VStack>
      </Box>
    );
  };

export default LoginSignupPage;
