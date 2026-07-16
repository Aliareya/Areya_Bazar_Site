import React from 'react'
import Topbar from './Topbar'
import useLangStore from '../../stores/LangStore'
import Header from './Header';
import { useTranslation } from 'react-i18next';

function SiteLayout() {
  const {language , changeLanguage} = useLangStore();
  const {t} = useTranslation('common');
  return (
    <div>
      <Topbar/>
      <Header/>
      {language}
     <h1> {t('save')}</h1>

      <span onClick={()=>changeLanguage('fa')}>fa</span>
      <span onClick={()=>changeLanguage('en')}>en</span>

    </div>
  )
}

export default SiteLayout