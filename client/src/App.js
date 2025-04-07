// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminPage from './pages/Adminpage';
import ProtectedRoute from './pages/ProtectedRoute';
import CategoryManager from './pages/CategoriesManager';
import UserProfile from './pages/UserProfile';
import Header from './pages/Header'; 
import ProductManager from './pages/ProductManager';
import UserManager from './pages/UserManager';
import RoleManager from './pages/RoleManager';
import Cart from './pages/Cart';
import Yeuthich from './pages/Yeuthich';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userprofile" element={<UserProfile/>} />  {/* Trang Categories */}
          <Route path="/admin" element={<ProtectedRoute element={AdminPage} />} /> {/* Trang AdminPage */}
          <Route path="/CategoriesManager" element={<CategoryManager />} />
          <Route path="/ProductManager" element={<ProductManager />} />
          <Route path="/UserManager" element={<UserManager />} />
          <Route path="/RoleManager" element={<RoleManager />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Yeuthich" element={<Yeuthich />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
