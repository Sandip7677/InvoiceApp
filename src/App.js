import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className=" d-flex flex-column align-items-center justify-content-center w-100">
    <Container>
      <Dashboard/>
    </Container>
  </div>
  );
}

export default App;
