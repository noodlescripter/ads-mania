const mongo = require('mongoose');
const Schema = mongo.Schema;

const AdsSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: [
        {
            url: String,
            filename: String
        }
    ],
    askingPrice: {type: Number, required: true}, 
    postUser:{
        type: Schema.Types.ObjectId, ref: 'User'
    }, 
    phone:{
        type: String, 
        required: true,
    },
    address:{
        type: String,
        required: true
    }, 
});

module.exports = mongo.model('Ad', AdsSchema);