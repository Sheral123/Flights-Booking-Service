const axios = require('axios');
const {StatusCodes}  = require('http-status-codes');
const {BookingRepo} = require('../repositories');
const db = require('../models');
const {ServerConfig} = require('../config');
const { FLIGHT_SERVICE } = require('../config/server-config');
const {Enums} = require('../utills/common');
const AppError = require('../utills/errors/app-error')
const {BOOKED, CANCALLED} = Enums.BOOKING_STATUS;

const bookingRepo = new BookingRepo();


async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    //console.log(`${ServerConfig.FLIGHT_SERVICE}/api/V1/flights/${data.flightId}`);
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/V1/flights/${data.flightId}`);
        //console.log(flight);
        const flightData = flight.data.data;
        if(data.noOfSeats > flightData.totalSeats){
            throw new AppError('not enough seats available', StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount =  data.noOfSeats * flightData.price;
        const bookingPayload = {...data, totalCost: totalBillingAmount};
        const booking = await bookingRepo.create(bookingPayload, transaction);
        axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/V1/flights/${data.flightId}/seats`,{
            seats: data.noOfSeats
        })

        await transaction.commit();
        return booking;
    }
    catch (error) {
        await transaction.rollback();  
        throw error; 
    }
}


async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    //console.log(`${ServerConfig.FLIGHT_SERVICE}/api/V1/flights/${data.flightId}`);
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/V1/flights/${data.flightId}`);
        //console.log(flight);
        const flightData = flight.data.data;
        if(data.noOfSeats > flightData.totalSeats){
            throw new AppError('not enough seats available', StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount =  data.noOfSeats * flightData.price;
        const bookingPayload = {...data, totalCost: totalBillingAmount};
        const booking = await bookingRepo.create(bookingPayload, transaction);
        axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/V1/flights/${data.flightId}/seats`,{
            seats: data.noOfSeats
        })

        await transaction.commit();
        return booking;
    }
    catch (error) {
        await transaction.rollback();  
        throw error; 
    }
}


async function makePayment(data){
    const transaction = await db.sequelize.transaction();
    //console.log(`${ServerConfig.FLIGHT_SERVICE}/api/V1/flights/${data.flightId}`);
    try {
        const bookingDetails = await bookingRepo.get(data.bookingId, transaction);
        if(bookingDetails.status == CANCALLED){
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime - bookingTime > 300000){
            await cancelBooking(data.bookingId);
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.totalCost != data.totalCost){
            throw new AppError('the amount of the payment doesnt match', StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.userId != data.userId){
            throw new AppError('the userId corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }

        await bookingRepo.update(data.bookingId, {status: BOOKED}, transaction);
        await transaction.commit();
    }
    catch (error) { 
        await transaction.rollback();  
        throw error; 
    }
}


async function cancelBooking(bookingId){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepo.get(bookingId, transaction);
        if(bookingDetails.status == CANCALLED){
            await transaction.commit();
            return true;
        }
        axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/V1/flights/${bookingDetails.flightId}/seats`,{
            seats: bookingDetails.noOfSeats,
            dec: 0 
        });        
        await bookingRepo.update(bookingId, {status: CANCALLED}, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();  
        throw error;
        
    }
    
}

async function cancelOldBookings(){
    try {
        const time = new Date( Date.now() - 1000*300);
        const response = await bookingRepo.cancelOldBookings(time);
        return response;

    } catch (error) {
        console.log(error);
        throw(error);
        
    }

}




module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings

}