import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
const Header = () => {
    // to get the current user
    const { currentUser } = useSelector((state) => state.user)
    // console.log(currentUser)
    const [searchTerm, setsearchTerm] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setsearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    const  handleSubmit = async (e) => {
        e.preventDefault()
        // jo bhi url hai usko ham fetch karenge or searchTerm mai dal denge
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)

    }
    return (
        <header className='bg-gray-300 shadow-md'>
            <div className="flex justify-between items-center mx-auto max-w-6xl p-3">
                <Link to={'/'}>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-gray-500'>Career </span>
                        <span className='text-gray-900'>Chronicles</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} action="" className='bg-gray-100 p-3 justify-between rounded-xl flex items-center w-24 sm:w-64'>
                    <input type="text" value={searchTerm} onChange={(e) => setsearchTerm(e.target.value)} placeholder='Search...' className='bg-transparent focus:outline-none' />
                    <button>
                        <FaSearch className='text-gray-600' />

                    </button>
                </form>
                <ul className='flex gap-4'>
                    <Link to={'/'}>
                        <li className='hidden sm:inline text-gray-700 hover:underline'>Home</li>
                    </Link>
                    <Link to={'/about'}>
                        <li className='hidden sm:inline text-gray-700 hover:underline'>About</li>
                    </Link>
                    <Link to={'/profile'}>
                        {currentUser ? (
                            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                        ) : (

                            <li className='  text-gray-700 hover:underline'>Sign in</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header