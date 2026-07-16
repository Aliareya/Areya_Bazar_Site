import React from 'react'
import Topbar from './Topbar'
import useLangStore from '../../stores/LangStore'
import Header from './Header';

function SiteLayout() {
  const {language , changeLanguage} = useLangStore();
  return (
    <div>
      <Topbar/>
      <Header/>
      {language}

      <span onClick={()=>changeLanguage('fa')}>fa</span>
      <span onClick={()=>changeLanguage('en')}>en</span>

    </div>
  )
}

export default SiteLayout