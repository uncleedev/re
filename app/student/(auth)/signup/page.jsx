import React from 'react'

export default function StudentSignup() {
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

            <button>signup</button>
        </form>
    </div>
  )
}
