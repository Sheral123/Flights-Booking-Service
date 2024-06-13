const axios = require('axios');
const {StatusCodes}  = require('http-status-codes');
const {BookingRepository} = require('../repositories');
const db = require('../models');
const {ServerConfig} = require('../config')

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
        await transaction.commit();
        return true;
    }
    catch (error) {
        //console.log(error);
        await transaction.rollback();   
    }
}

module.exports = {
    createBooking

}