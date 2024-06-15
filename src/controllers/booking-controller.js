const{ BookingService } = require('../services');
const{ErrorResponse, SuccessResponse} = require('../utills/common') 
const {StatusCodes } = require('http-status-codes');

async function createBooking(req,res){
    try {
        //console.log(req.body);
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });
        //console.log(response);
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        console.log('controller',error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }

} 

async function makePayment(req,res){
    try { 
        //console.log(req.body);
        const response = await BookingService.makePayment({
            userId: req.body.userId,
            totalCost: req.body.totalCost,
            bookingId: req.body.bookingId
        });
        //console.log(response);
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } catch (error) {
        console.log('controller',error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }

} 


module.exports = {
    createBooking,
    makePayment
}