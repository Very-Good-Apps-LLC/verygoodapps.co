import React from 'react'

const AppStoreButtons = ({ buttons }) => {
    const displayedButtons = buttons.map(button => <img src={button} alt='store link' className='store-link'/>)

    return (
        <div className='button-container'>
            {displayedButtons}
        </div>
    )
}

export default AppStoreButtons