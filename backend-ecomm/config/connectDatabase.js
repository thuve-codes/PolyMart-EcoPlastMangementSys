const mongoose = require('mongoose');

const connectDatabase =  () => {
    mongoose.connect(process.env.DB_URL).then((con) =>  {
        console.log('Database connection successful HOST: '+ con.connection.host);
    })
};

module.exports = connectDatabase; 