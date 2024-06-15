const { StatusCodes} = require('http-status-codes');

const {Booking } = require('../models');
const CrudRepo = require('./crud-repo');

class BookingRepo extends CrudRepo{
    constructor() {
        super(Booking);

    }

    async createBooking(data, transaction){
        const response = await Booking.create(data, {transaction: transaction} )
    }

    
    async update(id, data, transaction){
        
        const response = await this.model.update(data, {
            where:{
                id: id
            }
        }, {transaction: transaction});
        return response
    } 


    async get(data, transaction){
        
        const response = await this.model.findByPk(data, {transaction: transaction});
        if(!response){
            throw new AppError('Not able to find data', StatusCodes.NOT_FOUND)
        }
        return response
        
    }    
}



module.exports = BookingRepo;