import '../App.css';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import google from '../google-play-badge.png'
import apple from '../app-store.svg'
import character from '../character.png'
import AppStoreButtons from '../Components/AppStoreButtons'

const Home = () => {

    const [ isLive, setIsLive ] = useState(false)

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
              <Link to='/privacy-policy'>Privacy Policy</Link>
              <a href='mailto:contact@verygoodapps.co' target='_blank'>Support</a>
          </div>
        </div>
    </div>
  )
}

export default Home