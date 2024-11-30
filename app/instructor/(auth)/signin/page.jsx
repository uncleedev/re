import React from 'react'

export default function InstructorSignin() {
  return (
    <div>
        <form>
            <div>
                <label>Email</label>
                <input type="email" name='email'/>
            </div>

            <div>
                <label>Password</label>
                <input type="password" name='password'/>
            </div>

            <button>Signin</button> 
        </form>
    </div>
  )
}
