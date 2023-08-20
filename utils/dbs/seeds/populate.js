const mongo = require('mongoose');
const AdsSchema = require('../../../models/adModels');
const { log, error, info } = require('console');

/* Connection to mongo */
try {
    mongo.connect('mongodb://admin:pass123@localhost:27017/adsmania', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: 'admin'
    });
    info('Connected to DB!!!! Will be seeding the db good!!!')
} catch (err) {
    error('Fuck!!! Somthing went wrong!!!!! ::: error :::>>>', err);
}

const seeding = async () => {
    /* Delete if exist already */
    await AdsSchema.deleteMany({});
    /* for (let i = 0; i < 20; i++) {
        const add = new AdsSchema({
            title: `Ad no.${i}`,
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae mollitia deserunt ullam quisquam nesciunt quam vero voluptatem, obcaecati, aut soluta porro, nihil cupiditate similique neque odio omnis voluptate sequi autem.", 
            askingPrice: 20,
            image: "https://source.unsplash.com/collection/483251", 
            postUser: "64dfddca21320e00421af0ed", 
            address: "Brooklyn, NY",
            phone: "12345678"
        });
        await add.save();
    } */
}

seeding().then(function(){
    mongo.connection.close();
})