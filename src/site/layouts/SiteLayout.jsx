import React from 'react'
import Topbar from './Topbar'
import useLangStore from '../../stores/LangStore'

function SiteLayout() {
  const {language , changeLanguage} = useLangStore();
  return (
    <div>
      <Topbar/>
      {language}

      <span onClick={()=>changeLanguage('fa')}>fa</span>
      <span onClick={()=>changeLanguage('en')}>en</span>

    </div>
  )
}

export default SiteLayout