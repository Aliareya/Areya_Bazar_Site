import React from 'react'
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation('common');
  console.log(t('save'))
  return (
    <div>{t('save')}</div>
  )
}

export default App