import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate ,useParams} from 'react-router-dom'
const UpdateListing = () => {
    const navigate = useNavigate()
    const [files, setfiles] = useState([])
    const [formData, setformData] = useState({
        imageUrls: [],
        companyName:'',
        jobTitle:'',
        intervieweeName:'',
        interviewDate:'',
        type:'full-time',
        description:'',
        overallExperience:'',
        tips:'',
        ctc:1,
        base:1,
        rounds:1,
        selected:false
    })

    // console.log(formData)
    const { currentUser } = useSelector(state => state.user)
    const [uploading, setuploading] = useState(false)
    const [imageUploadError, setimageUploadError] = useState(false)
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState(false)
    const params = useParams()
    useEffect(() => {
        const fetchListing = async()=>{
            const listingId = params.listingId
            // console.log(ListingId)
            try {
                const res = await fetch(`/api/listing/getListing/${listingId}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch listing')
                }
                const data = await res.json()
                const formattedData = {
                    ...data,
                    interviewDate: new Date(data.interviewDate).toISOString().split('T')[0]
                  };
                setformData(formattedData)
            } catch (error) {
                console.error('Error fetching listing:', error)
                seterror('Failed to fetch listing')
            }
            // setformData(data)
        }

        fetchListing()
    }, [])
    const handleImageSubmit = async (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setuploading(true)
            setimageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setformData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls),
                })
                setimageUploadError(false)
                setuploading(false)
            }).catch((error) => {
                setuploading(false)
                setimageUploadError('2mb max per image')
            })
            // now we want to keep the previous form data so that it can be saved and then viewed by others
        }
        else {
            setimageUploadError('You can only upload only 6 images per listing')
            setuploading(false)
        }
        // setuploading(false)
    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    // console.log('Upload is ' + progress + "%done");
                    console.log(Math.round(progress))
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadUrl) => {
                            resolve(downloadUrl)
                        }
                    )
                },
            );
        })
    }
    const handleImageDelete = (index) => {
        setformData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange=(e)=>{
        if(e.target.id === 'full-time' || e.target.id === 'intern' || e.target.id === 'fullintern'){
            setformData({
                ...formData,
                type: e.target.id
            })
        }
        else if(e.target.id === 'selected'){
            setformData({
                ...formData,
                [e.target.id]:e.target.checked
            })
        }
         else if (e.target.type === 'number' && (e.target.id === 'ctc' || e.target.id === 'base')) {
            setformData({
                ...formData,
                [e.target.id]: parseFloat(e.target.value)
            });
        }
        else{
            setformData({
                ...formData,
                [e.target.id]:e.target.value
            })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (formData.imageUrls.length < 1) return seterror('You must upload at least one image')
            if (+formData.regularPrice < +formData.discountPrice) return seterror('Discount cannot be greater than regular Price')
            setloading(true)
            seterror(false)

            const res = await fetch(`/api/listing/edit/${params.listingId}`, {
                method: 'PUT', // Use the correct HTTP method
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                })
            })

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to update listing: ${res.status} - ${errorText}`);
            }

            const data = await res.json()
            setloading(false)

            if (data.success === false) {
                seterror(data.message)
            }

            navigate(`/listing/${data._id}`)
        } catch (error) {
            seterror(error.message)
            setloading(false)
        }
    }
    return (

        <div className='p-3 max-w-4xl mx-auto'>
            <h1 className='font-semibold text-center text-3xl my-7'>Update a Experience</h1>
            <form onSubmit={handleSubmit} action="" className='flex flex-col sm:flex-row gap-4'>
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder='Company Name' onChange={handleChange} value={formData.companyName} className='border p-3 rounded-lg' id='companyName' maxLength='62' minLength='1' required />
                    <input type="text" placeholder='Job Title' onChange={handleChange} value={formData.jobTitle} className='border p-3 rounded-lg' id='jobTitle' required />
                    <input type="text" placeholder='intervieweeName' onChange={handleChange} value={formData.intervieweeName} className='border p-3 rounded-lg' id='intervieweeName' required />
                    <input type="date" className='border p-3 rounded-lg' id='interviewDate' onChange={handleChange} value={formData.interviewDate} required />
                    <div className="flex gap-4">

                    <div className="flex gap-2">
                            <input type="checkbox" id='fullintern' onChange={handleChange} checked={formData.type === 'fullintern'} className='w-5' />
                            <span>FTE+Intern</span>
                        </div>
                    <div className="flex gap-2">
                            <input type="checkbox" id='full-time' onChange={handleChange} checked={formData.type === 'full-time'} className='w-5' />
                            <span>Full-Time</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='intern' onChange={handleChange} checked={formData.type === 'intern'} className='w-5' />
                            <span>Intern</span>
                        </div>
                    </div>
                    <textarea type="text" placeholder='description' onChange={handleChange} value={formData.description} className='border p-3 rounded-lg' id="description" minLength={10} required />
                    <textarea type="text" placeholder='overallExperience' onChange={handleChange} value={formData.overallExperience} className='border p-3 rounded-lg' id='overallExperience' required />
                    <textarea type="text" placeholder='tips' className='border p-3 rounded-lg' onChange={handleChange} value={formData.tips} id='tips' required />
                    <div className="flex items-center gap-4">
                            <input
                                type="number"
                                id="rounds"
                                min={1}
                                max={10}
                                required
                                onChange={handleChange} value={formData.rounds}
                                className="p-3 border border-gray-400 rounded-lg"
                            />
                            <span className="text-lg">No. of Rounds</span>
                            <input
                                type="checkbox"
                                onChange={handleChange}
                                checked={formData.selected}
                                id="selected"
                                className="w-6 h-6" 
                            />
                            <span className="text-lg">Selected</span> 
                        </div>                   
                        {formData.type !== 'intern' && (
                            <div className='flex  gap-6 '>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        id="ctc"
                                        step="0.01"
                                        min={1}
                                        max={1000}
                                        required
                                        onChange={handleChange} value={formData.ctc}
                                        className="p-3 border border-gray-400 rounded-lg"
                                    />
                                    <span className="text-lg">CTC in lpa</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        id="base"
                                        min={1}
                                        step="0.01"
                                        max={1000}
                                        required
                                        onChange={handleChange} value={formData.base}
                                        className="p-3 border border-gray-400 rounded-lg"
                                    />
                                    <span className="text-lg">Base in lpa</span>
                                </div>
                            </div>
                        )}
                        {formData.type === 'intern'  && (
                            <div className="flex items-center gap-4">
                            <input
                                type="number"
                                id="base"
                                min={1}
                                step="0.01"
                                max={1000}
                                required
                                onChange={handleChange} value={formData.base}
                                className="p-3 border border-gray-400 rounded-lg"
                            />
                            <span className="text-lg">Compensation in lakhs</span>
                        </div>
                        )}

                </div>
                <div className='flex flex-col flex-1'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be cover</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setfiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                        <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-90'>{uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="listing image" className='w-20 h-29 object-contain rounded-lg' />
                                <button type='button' onClick={() => handleImageDelete(index)} className='p-3 rounded-lg uppercase hover:opacity-90 text-red-700'>Delete</button>
                            </div>

                        ))
                    }
                    <button disabled={loading || uploading} className='p-3 mt-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>{loading? 'Updating...': 'Update Experience'}</button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </div>

    )
}

export default UpdateListing