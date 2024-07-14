const{ BookingService } = require('../services');
const{ErrorResponse, SuccessResponse} = require('../utills/common') 
const {StatusCodes } = require('http-status-codes');
<<<<<<< HEAD
=======
const { message } = require('../utills/common/error-response');

const inMemDb = {};
>>>>>>> 0fe3a70 (added  notification service)

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
<<<<<<< HEAD
=======
        const idempotencyKey = req.headers['x-idempotency-key'];
        if(!idempotencyKey || inMemDb[idempotencyKey]){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'Cannot retry on a succesful payment'});
        }              
>>>>>>> 0fe3a70 (added  notification service)
        //console.log(req.body);
        const response = await BookingService.makePayment({
            userId: req.body.userId,
            totalCost: req.body.totalCost,
            bookingId: req.body.bookingId
        });
<<<<<<< HEAD
=======
        inMemDb[idempotencyKey] = idempotencyKey;
>>>>>>> 0fe3a70 (added  notification service)
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