import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSucces } from '../redux/user/userSlice'
import Oauth from '../components/Oauth'
const Signin = () => {
  const [formData, setformData] = useState({
    username: '',
    email: '',
    password: ''
  })
  // using loading and error globally with the  help of redux
  const { loading, error } = useSelector((state) => state.user)
  // const [error, seterror] = useState(null)
  // const [loading, setloading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) => {
    // setformData({})
    setformData({
      ...formData,
      [e.target.id]: e.target.value
    })
    // console.log(formData)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setloading(true)
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        // seterror(data.message)
        // setloading(false)
        dispatch(signInFailure(data.message))
        return
      }
      // setloading(false)
      // seterror(null)
      dispatch(signInSucces(data))
      navigate('/')
      // console.log(data)
    } catch (error) {
      // setloading(false)
      // seterror(error.message)
      dispatch(signInFailure(error.message))
    }

  }
  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} action="" className='flex flex-col gap-4'>

        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign In</button>
        <Oauth/>
      </form>
      <div className='gap-2 flex m-2'>
        <p>Dont have an account</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-400'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Signin