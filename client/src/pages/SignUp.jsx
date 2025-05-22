import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Oauth from '../components/Oauth'
const SignUp = () => {
  const [formData, setformData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, seterror] = useState(null)
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    // setformData({})
    // we are using spread operator to keep the previous info and adding new ones
    setformData({
      ...formData,
      [e.target.id]: e.target.value
    })
    console.log(formData)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        seterror(data.message)
        setloading(false)
        return
      }
      setloading(false)
      seterror(null)
      navigate('/sign-in')
      console.log(data)
    } catch (error) {
      setloading(false)
      seterror(error.message)
    }

  }
  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign up</h1>
      <form onSubmit={handleSubmit} action="" className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign Up</button>
        <Oauth/>
      </form>
      <div className='gap-2 flex m-2'>
        <p>Already have an account</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-400'>{loading ? 'loading' : 'SignIn'}</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp