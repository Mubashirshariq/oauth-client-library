import React from 'react';
import styled from 'styled-components';
import axios from "axios";

const App = () => {
  async function handlelogin() {
    try {
      const resp = await fetch("http://localhost:3000/login");
      console.log("Raw Response:", resp);
  
      if (resp.ok) {
        const data = await resp.json();
        console.log("Parsed Response:", data);
            // window.location.href = data.authUrl; 
        } else {
          console.error("authUrl is missing in the response.");
        }
     
    }
    catch (error) {
      console.error("Error during login:", error);
    }
  }

  return (
    <Container>
      <Card>
        <Logo>✨ YourApp</Logo>
        <Title>Welcome Back</Title>
        <Subtitle>Log in to your account</Subtitle>
       
          <Button onClick={handlelogin}>Log In</Button>
        
      </Card>
    </Container>
  );
};

export default App;

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  font-family: 'Arial', sans-serif;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Logo = styled.h1`
  font-size: 2rem;
  color: #6e8efb;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6e8efb;
    box-shadow: 0 0 4px rgba(110, 142, 251, 0.5);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #6e8efb;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #5a75d9;
  }
`;

const Footer = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;

  a {
    color: #6e8efb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;