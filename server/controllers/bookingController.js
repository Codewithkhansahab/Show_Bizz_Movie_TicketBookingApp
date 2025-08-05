// check availability 

import Booking from "../models/Booking.js";
import Show from "../models/Shows.js"
import Stripe from "stripe";


export const checkSeatAvailability = async (showId, selectedSeat)=>{
    try{
        const showData = await Show.findById(showId)
        if(!showData) return false

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeat.some(seat => occupiedSeats[seat])

        return isAnySeatTaken;

    }
    catch(error){
        console.log(error.message);
        return false;
    }
}

export const createBookig = async (req,res) =>{
    try{
        const {userId} = req.auth();
        const {showId , selectedSeats} = req.body;
        const {origin} = req.headers;

        const isAvailble = await checkSeatAvailability(showId,selectedSeats);
        if(isAvailble){
            return res.json({success : false ,message : "Seat is not available"})
        }

        const showData = await Show.findById(showId).populate('movie');
        const booking = await Booking.create({
            user: userId ,
            show: showId,
            amount : showData.showPrice * selectedSeats.length ,
            bookedSeats : selectedSeats ,
        })

        selectedSeats.map((seat) =>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats')
        await showData.save();

        //stripe gate away 

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        //crete line items

        const line_items = [{
            price_data:{
                currency: 'AUD',
                product_data:{
                    name:showData.movie.title,
                },
                unit_amount: Math.floor(booking.amount * 100), // Convert to cents
            },
            quantity:1
        }]

        const sessions = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata:{
                bookingId: booking._id.toString(),
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // expires in 30 mints
        })

        booking.paymentLink = sessions.url;
        await booking.save();
        res.json({success : true, message :'booked successfuly', url: sessions.url})

    }
    catch(error){
        console.log(error.message)
        res.json({success : false, message :error.message})
    }
}


export const getOccupiedSeats = async (req,res) =>{
    try{
        const {showId} = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({success : true,occupiedSeats})
    }
    catch(error){
        console.log(error.message)
        res.json({success : false, message : error.message})

    }
}