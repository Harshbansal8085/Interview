import mongoose from "mongoose"
import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing=async(req,res,next)=>{
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}

export const deletListing=async(req,res,next)=>{
    if (!mongoose.isValidObjectId(req.params.id)) {
        return next(errorHandler(404, 'Listing not found'))
    }
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,'Listing not found'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'You can only delete your own listing'))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id)
        return res.status(200).json('Listing has been deleted')
    } catch (error) {
        next(error)
    }
}
export const editListing=async(req,res,next)=>{
    if (!mongoose.isValidObjectId(req.params.id)) {
        return next(errorHandler(404, 'Listing not found'))
    }
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404,'Listing not found'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'You can only update your own listing'))
    }
    try {
        const editListing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
        return res.status(200).json(editListing)
    } catch (error) {
        next(error)
    }
}

export const getListing=async(req,res,next)=>{
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return next(errorHandler(404,'Listing not found'))
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

export const getListings=async(req,res,next)=>{
    try {
        // now what we are doing here is lets say our url is api/listing/get?limit=2
        // so we will get limit as 2 say just rent and furnished or if it is not given then 9
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0
        let selected = req.query.selected
        // if(selected === undefined  || selected === 'all'){
        //     selected = {$in:[false,true]}
        // }
        // else if (req.query.selected === 'true') {
        //     selected = true; // Match documents where selected is true
        // } else if (req.query.selected === 'false') {
        //     selected = false; // Match documents where selected is false
        // }
  


        let type = req.query.type

        if(type === undefined || type === 'all'){
            type = {$in:['full-time','intern','fullintern']}
        }

        const searchTerm = req.query.searchTerm || ''
        const sort = req.query.sort || 'createdAt'
        const order = req.query.order || 'desc'
        // const order = req.query.order && (req.query.order.toLowerCase() === 'asc' || req.query.order.toLowerCase() === 'desc') ? req.query.order.toLowerCase() : 'desc';
        // console.log('Query Parameters:', {
        //     limit,
        //     startIndex,
        //     type,
        //     searchTerm,
        //     sort,
        //     order,
        //     selected
        // });

        // here options i means dont care about uppercase and lowercase
        const listings = await Listing.find({
            $or: [
                { companyName: { $regex: searchTerm, $options: 'i' } },
                { jobTitle: { $regex: searchTerm, $options: 'i' } }
            ], 
            type,
        }).sort(
            {[sort]:order}
        ).limit(limit).skip(startIndex)
        // console.log('Listings Found:', listings);
        return res.status(200).json(listings)

    } catch (error) {
        next(error)
    }
}   