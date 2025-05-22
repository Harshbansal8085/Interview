import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper/modules';
import Listingitem from '../components/Listingitem';

const Home = () => {
  SwiperCore.use([Navigation]);

  const [allListings, setAllListings] = useState([]);
  const [fullTimeInternListings, setFullTimeInternListings] = useState([]);
  const [fullTimeListings, setFullTimeListings] = useState([]);
  const [internListings, setInternListings] = useState([]);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=all&limit=4`);
        const data = await res.json();
        setAllListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFullTimeInternListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=fullintern&limit=4`);
        const data = await res.json();
        setFullTimeInternListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFullTimeListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=full-time&limit=4`);
        const data = await res.json();
        setFullTimeListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchInternListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=intern&limit=4`);
        const data = await res.json();
        setInternListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllListings();
    fetchFullTimeInternListings();
    fetchFullTimeListings();
    fetchInternListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Empower Others with Your <span className='text-slate-500'>Journey</span>
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Share your interview experiences and insights to guide and inspire the next generation of professionals.
        </div>
        <Link className='text-xs sm:text-sm hover:underline text-blue-800' to={'/create-listing'}>
          Start Sharing Your Story
        </Link>
      </div>


      <Swiper navigation>
        {allListings && allListings.length > 0 && allListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div className="h-[500px]" style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }}></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {allListings && allListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-700'>All Experiences</h2>
              <Link className='text-sm text-blue-800 hover:underline my-3' to={'/search?type=all'}>
                View all
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {allListings.map((listing) => (
                <Listingitem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {fullTimeInternListings && fullTimeInternListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-700'>Full-Time + Intern Experiences</h2>
              <Link className='text-sm text-blue-800 hover:underline my-3' to={'/search?type=fullintern'}>
                View all
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {fullTimeInternListings.map((listing) => (
                <Listingitem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {fullTimeListings && fullTimeListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-700'>Full-Time Experiences</h2>
              <Link className='text-sm text-blue-800 hover:underline my-3' to={'/search?type=full-time'}>
                View all
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {fullTimeListings.map((listing) => (
                <Listingitem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {internListings && internListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-700'>Intern Experiences</h2>
              <Link className='text-sm text-blue-800 hover:underline my-3' to={'/search?type=intern'}>
                View all
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {internListings.map((listing) => (
                <Listingitem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;