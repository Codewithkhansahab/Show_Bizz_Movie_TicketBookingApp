// check if user is admin 

import Booking from "../models/Booking.js"
import Show from "../models/Shows.js";
import User from "../models/User.js";


export const isAdmin = async (req, res) => {
  try {
    // Since protectAdmin middleware has already verified the user is an admin
    // We can simply return true
    res.json({ success: true, isAdmin: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

 // to get dashboard data 

 export const getDashboardData = async (req ,res) =>{
    try{
        const bookings = await Booking.find({isPaid : true});
        const activeShow = await Show.find({showDateTime : {$gte : new Date()}}).populate('movie');

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings : bookings.length,
            totalRevenue : bookings.reduce((acc,booking) => acc + booking.amount , 0),
            activeShows: activeShow,
            totalUser
        }

        res.json({success : true , dashboardData})
    }
    catch(error){
        console.log(error)
        res.json({success : false, message :error.message})

    }
 }


 // to get all shows 

 export const getAllShows = async (req,res)=>{
    try{
         console.log("Fetching all shows...");
         const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
         console.log("Found shows:", shows.length);
         res.json({success : true , shows})
     }
     catch(error){
         console.error("Error in getAllShows:", error);
         res.status(500).json({success : false, message: error.message})
     }
  }

 // to get all bookings

 export const getAllBookings = async (req,res) =>{
    try{
        const bookings = await Booking.find({}).populate('user').populate({
            path: "show",
            populate:{path: "movie"}
        }).sort({createdAt : -1})

        res.json({success : true , bookings})
    }
    catch (error){
        console.error(error)
            res.json({success : false, message :error.message})
    }
 }
