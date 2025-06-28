import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignIn from './components/SignIn';
import Departments from './components/Departments';
import Year from './components/Year';
import Sections from './components/Sections';
import FileUploader from './components/FileUploader';
import TableView from './components/TableView'; 
import Email from './components/Email';
import Password from './components/Password';
import ForgotPassword from './components/ForgotPassword';
import DepartmentStats from './components/DepartmentStats';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/year" element={<Year />} />
        <Route path="/sections" element={<Sections />} />
        <Route path="/fileuploader" element={<FileUploader />} />
        <Route path="/tableview" element={<TableView />} /> 
        <Route path="/Email" element={<Email />} />
        <Route path="/Password" element={<Password />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/departmentstats" element={<DepartmentStats/>}/>
      </Routes>
    </Router>
  );
}

export default App;
