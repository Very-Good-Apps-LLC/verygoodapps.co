import './Support.css';

const Support = () => {
  return (
    <>
        <form>
            <div className="form-control">
                <label for="name">Full Name</label>
                <input type="text" />
            </div>
            <div className="form-control">
                <label for="email">Email Address</label>
                <input type="text" />
            </div>
            <div className="form-control">
                <label for="name">Message</label>
                <textarea rows='8'/>
            </div>
            <button className='submit-button' type='submit'>Send Feedback</button>
        </form>
    </>
  )
}

export default Support