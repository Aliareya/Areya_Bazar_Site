import React from 'react'
import Topbar from './Topbar'
import useLangStore from '../../stores/LangStore'
import Header from './Header';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';


function SiteLayout() {
  const { language, changeLanguage } = useLangStore();
  const { t } = useTranslation('common');
  return (
    <div>
      <Topbar />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/about' element={< About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default SiteLayout