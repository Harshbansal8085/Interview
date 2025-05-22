import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSucces } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
const Oauth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const hanldeGoogleClick = async () => {
        try {
            // const provider = new GoogleAuthProvider()
            
            const provider = new GoogleAuthProvider();
            // always account selection appears
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)
            // console.log(result.user.photoURL)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo : result.user.photoURL })
            })
            // console.log(result)
            const data = await res.json()
            dispatch(signInSucces(data))
            navigate('/')
        } catch (error) {
            console.log('Could not sign in with google', error)
        }
    }
    return (
        <button type='button' onClick={hanldeGoogleClick} className='bg-red-600 text-white p-3 rounded-xl hover:opacity-90 uppercase'>Continue with google</button>
    )
}

export default Oauth