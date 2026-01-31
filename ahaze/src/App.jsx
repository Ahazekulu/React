import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Landing from './features/home/Landing';
import Home from './features/home/Home';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Places from './features/places/Places';
import Connect from './features/connect/Connect';
import Market from './features/market/Market';
import Organizations from './features/organizations/Organizations';
import Knowledge from './features/knowledge/Knowledge';
import Profile from './features/auth/Profile';
import KnowUs from './features/info/KnowUs';
import Contact from './features/info/Contact';
import Notifications from './features/notifications/Notifications';
import Messages from './features/messages/Messages';
import Cart from './features/cart/Cart';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/places" element={<Places />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/market" element={<Market />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/know-us" element={<KnowUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
