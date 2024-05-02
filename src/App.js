import './App.css';
import { useState } from 'react'
import google from './google-play-badge.png'
import apple from './app-store.svg'
import character from './character.png'
import Modal from './Components/Modal';
import AppStoreButtons from './Components/AppStoreButtons';

function App() {

  const [ isLive, setIsLive ] = useState(false)
  const [ modalContent, setModalContent ] = useState('');
  const [ showModal, setShowModal ] = useState(false);

  function handleShowModal(content) {
    setModalContent(content)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setModalContent('')
  }

  return (
    <div className='container'>
      <div className='hero'>
        <h1>StorySprout</h1>
        <p>Never-ending stories for kids and their big people.</p>
      </div>

      { isLive ? <AppStoreButtons buttons={[apple, google]}/> : <div className='coming-soon'><p>Coming Soon!</p></div> }

      <div className="character">
        <img src={character} alt='character' className="character-img"/>
      </div>

      <div className='footer'>
        <p className="copyright">
            © Copyright 2024 Very Good Apps LLC
        </p>
        <div className="footer-links">
            <a onClick={() => handleShowModal({title: 'Privacy Policy', text: 'Some privacy Policy Text'})}>Privacy Policy</a>
            <a onClick={() => handleShowModal({title: 'Support', text: 'Some Support content'})}>Support</a>
        </div>
        
    </div>

      {showModal && <Modal content={modalContent} cb={handleCloseModal}  />}

    </div>
  );
}

export default App;
