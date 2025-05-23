import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserFailure, updateUserSuccess, updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
const Profile = () => {
	const { currentUser, loading, error } = useSelector((state) => state.user)
	const fileRef = useRef(null)
	const [file, setfile] = useState(undefined)
	const [filePer, setfilePer] = useState(0)
	const [fileError, setfileError] = useState(false)
	const [formData, setformData] = useState({})
	const [updateSucces, setupdateSucces] = useState(false)
	const [showListingError, setshowListingError] = useState(false)
	const [userListing, setuserListing] = useState([])
	const dispatch = useDispatch()
	const [noListing, setnoListing] = useState(false)
	// console.log(filePer)
	// console.log(file)
	// console.log(formData)
	// console.log(fileError)
	useEffect(() => {
		if (file) {
			handleFileUpload(file)
		}
	}, [file])
	const handleFileUpload = (file) => {
		const storage = getStorage(app)
		// we will create a unique file name so that when the user changes it profile it does no  t give an error
		const fileName = new Date().getTime() + file.name
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file)
		uploadTask.on('state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				// console.log('Upload is ' + progress + "%done");
				setfilePer(Math.round(progress))
			},
			(error) => {
				setfileError(true)
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then(
					(downloadUrl) => {
						setformData({ ...formData, avatar: downloadUrl })
					}
				)
			},
		);
	}

	const handleChange = (e) => {
		setformData({ ...formData, [e.target.id]: e.target.value })
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		// console.log('Before', loading)
		try {
			dispatch(updateUserStart())
			// console.log()
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			console.log('After', loading)
			const data = await res.json()
			if (data.success === false) {
				dispatch(updateUserFailure(data.message))
				return;
				// return
			}
			dispatch(updateUserSuccess(data))
			setupdateSucces(true)
		} catch (error) {
			dispatch(updateUserFailure(error.message))
		}
	}

	const handleDelete = async () => {
		try {
			dispatch(deleteUserStart())
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: 'DELETE',
			})
			const data = await res.json()
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message))
				return;
			}
			dispatch(deleteUserSuccess(data))
		} catch (error) {
			dispatch(deleteUserFailure(error.message))
		}
	}
	const handleSignOut = async () => {
		try {
			dispatch(signOutUserStart())
			const res = await fetch('/api/auth/signout')
			const data = await res.json()
			if (data.success === false) {
				dispatch(signOutUserFailure(data.message))
				return;
			}
			dispatch(signOutUserSuccess())
		} catch (error) {
			dispatch(signOutUserFailure(error))
		}
	}
	const handleShowListing = async () => {
		try {
			setnoListing(false)
			setshowListingError(false)
			const res = await fetch(`/api/user/listings/${currentUser._id}`)
			// console.log('we are here')
			const data = await res.json()
			// console.log(data)
			if (data.success === false) {
				setshowListingError(true)
			}
			setuserListing(data)
			if(userListing.length === 0) setnoListing(true)
				else setnoListing(false)
		} catch (error) {
			showListingError(true)
		}
	}
	const handleListingDelete = async (listingid) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingid}`,
				{ method: 'DELETE' }
			)
			const data = await res.json()
			if (data.success === false) {
				console.log(data.message)
				return
			}
			setuserListing((prev) => prev.filter((listing) => listing._id !== listingid))
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div className='p-3 max-w-lg mx-auto'>
			<h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
			<form onSubmit={handleSubmit} className='flex flex-col ' action="">
				<input onChange={(e) => setfile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
				<img onClick={() => fileRef.current.click()} className='rounded-full w-24 self-center mt-2 h-24 object-cover cursor-pointer' src={formData.avatar || currentUser.avatar} alt="profile" />
				<p className='text-sm self-center'>
					{fileError ?
						(<span className='text-red-700'>Error Image Upload (Image should be less than 2 mb)</span>) :
						filePer > 0 && filePer < 100 ?
							<span className='text-slate-700'>{`Uploading ${filePer}%`}</span> :
							filePer === 100 ?
								<span className='text-green-700'>Image Successfully uploaded</span> : ""
					}
				</p>
				<input onChange={handleChange} type="text" placeholder='username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg my-2' />
				<input onChange={handleChange} type="email" placeholder='email' defaultValue={currentUser.email} id='email' className='border p-3 rounded-lg my-2' />
				<input onChange={handleChange} type="password" placeholder='password' id='password' className='border p-3 my-2 rounded-lg' />
				<button className='bg-gray-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70'>{loading ? 'loading..' : 'Update'} </button>
				<Link className='bg-green-700 text-white p-3 uppercase rounded-lg mt-2 text-center hover:opacity-90' to={'/create-listing'}>
					Share a Experience
				</Link>
			</form>
			<div className='flex justify-between mt-3'>
				<span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
				<span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
			</div>
			<p className='text-red-700 mt-5'>{error ? error : ""}</p>
			<p className='text-green-700 mt-5'>{updateSucces ? 'User is updated successfully' : ""}</p>
			<button onClick={handleShowListing} className='text-green-700 w-full'>Show Shared Experience</button>
			<p>{showListingError ? 'Error showing listing' : ""}</p>
			<div>
				{
					noListing && userListing.length === 0 && 
					<p>No Shared Experience </p>
				}
			</div>
			{userListing && userListing.length > 0 &&
				<div className="flex flex-col gap-4">
					<h1 className='text-center mt-7 text-2xl font-semibold'>Your Experiences</h1>
					{userListing.map((listing) =>
						<div className='border rounded-lg p-3 flex gap-4 justify-between items-center' key={listing._id}>
							<Link to={`/listing/${listing._id}`}>
								<img src={listing.imageUrls[0]} alt="listing image" className='h-16 w-16 object-contain ' />
							</Link>
							<Link className='flex-1 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
								<p className=' '>{`${listing.companyName},  ${listing.intervieweeName}`}</p>
							</Link>
							<div className="flex flex-col items-center">
								<button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
								<Link to={`/update-listing/${listing._id}`}>
						<button  className='text-green-700 uppercase'>edit</button>
						</Link>
							</div>
						</div>)}
				</div>

			}
		</div>
	)
}

export default Profile