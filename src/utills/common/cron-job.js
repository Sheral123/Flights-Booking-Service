const cron = require('node-cron');

const {BookingService} = require('../../services');


function scheduleCrons() {
    cron.schedule('*/5 * * * * *',async () => {
        console.log('ddf')
        const response = await BookingService.cancelOldBookings();
        console.log('jjjj',response);
    });
}

module.exports  = scheduleCrons;