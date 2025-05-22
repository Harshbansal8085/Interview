import express from "express";
import { createListing, deletListing, editListing, getListing, getListings } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifiedUser.js";

const router = express.Router()


router.post('/create',verifyToken,createListing)
router.delete('/delete/:id',verifyToken,deletListing)
router.put('/edit/:id',verifyToken,editListing)
router.get('/getListing/:id',getListing)
router.get('/get',getListings)
export default router;