import Movie from "../models/Movie.js"


// get user booking 

import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";

export const getUserBooking = async (req , res)=>{
    try{
        const user = req.auth().userId;
        const bookings = await Booking.find({user}).populate({
            path:"show",
            populate:{path : "movie"}
        }).sort({createdAt : -1})

        res.json({success : true , bookings})
           
    }
    catch(error){
        console.log(error.message)
        res.json({success : false , message : error.message})
    }
}


// favorite movie in clerk meta data 

export const updateFavorite = async (req , res ) =>{

try{
    const {movieId} = req.body;

    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId)
    const privateMetadata = user.privateMetadata || {};
    
    // Initialize favorites array if it doesn't exist
    if (!privateMetadata.favorites) {
        privateMetadata.favorites = [];
    }

    // Check if movie is already in favorites
    if(!privateMetadata.favorites.includes(movieId)){
        privateMetadata.favorites.push(movieId)
    }
    else{
        privateMetadata.favorites = privateMetadata.favorites.filter(id => id !== movieId)
    }

    // Update user metadata with the modified privateMetadata
    await clerkClient.users.updateUserMetadata(userId, {privateMetadata})

    res.json({success : true , message : "Movie updated to favorites"})
}
catch(error){
    console.log(error)
    res.json({success : false , message : error.message})
}
}


// getFavorite movie 

export const getFavorite = async (req,res)=>{
    try{
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites;

        // get from database 

        const movies = await Movie.find({_id : {$in : favorites}})

        res.json({success : true, movies})
    }
    catch(error){
        console.error(error.message)
        res.json({success : false , message : error.message})
    }
}

