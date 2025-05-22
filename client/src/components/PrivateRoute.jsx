import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'
// here if we are not authenticated then if we try to visit profile page we will be redirected to the signin page
export default function PrivateRoute() {
    const {currentUser} = useSelector((state => state.user))
  return currentUser?<Outlet/> : <Navigate to={'/sign-in'}></Navigate>
}