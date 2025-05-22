import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faBuilding, faUserTie, faWallet } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {MdLocationOn} from 'react-icons/md'
import { Link } from 'react-router-dom'

const Listingitem = ({listing}) => {
    // console.log('We are here')
    // console.log(listing)
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing-cover" className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transiton-scale duration-300' />
            <div className="p-3 flex flex-col gap-2 w-full ">
                <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className='h-4 w-4 text-slate-800    ' />
                <p className='text-lg font-semibold text-slate-700 truncate'>{listing.companyName},{listing.jobTitle}</p>
                </div>
                <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserTie} className='text-black-700'/>
                    <p className='text-sm text-gray-600 truncate w-full'>{listing.intervieweeName}</p>
                </div>
                <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
                <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={faWallet} className='text-green-800' />
                <p className='text-slate-500  font-semibold'>Rs.
                    {
                        listing.ctc.toLocaleString('en-IN')
                    }
                    lpa
                    </p>
                    </div>
                <div className="text-slate-700 flex gap-4">
                    <div className="font-bold text-xs ">
                        {listing.rounds > 1? `${listing.rounds} rounds` : `${listing.rounds} round` }
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Listingitem