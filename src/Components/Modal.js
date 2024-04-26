import './Modal.css'
import Policy from './Policy'
import Support from './Support'
import FeatherIcon from 'feather-icons-react'

const Modal = ({ content, cb }) => {
  return (
    <div className='modal-container'>
        <div className='modal-header'>
            <h2 className='modal-title'>{content.title}</h2>
            <button onClick={cb}>
                <FeatherIcon icon='x' />
            </button>
        </div>

        <div className='modal-content-section'>
            {content.title === 'Privacy Policy' ? <Policy /> : <Support />}
        </div>
    </div>
  )
}

export default Modal