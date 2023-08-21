const express = require('express');
const ROUTER = express.Router();
const AdsSchema = require('../models/adModels');
const { ID } = require('../utils/common/getID');
const { error, info, log } = require('console');
const multer = require('multer');
const { storage, cloudinary } = require('../utils/cloudinary/cloudinary');
const upload = multer({ storage });

ROUTER.get('/', async function (req, res) {
    try {
        const ads = await AdsSchema.find({}).populate('postUser')
        res.render('pages/home.ejs', { ads });
    } catch (err) {
        error(err)
    }
}).post('/',
    upload.array('image'),
    async function (req, res) {
        const adBody = req.body;
        if (AdsSchema.postUser) {
            if (!AdsSchema.postUser._id.equals(req.user._id)) {
                req.flash('error', 'You must be logged in to do this action!');
            }
        }
        try {
            const newAds = new AdsSchema(adBody);
            newAds.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
            newAds.postUser = req.user._id;
            info(newAds);
            await newAds.save();
            req.flash('success', 'Ad Successfully Posted!!');
            res.redirect(`/ads`)
        } catch (err) {
            res.render('err/error.ejs', { err });
        }
    });


ROUTER.get('/manageads', async function (req, res) {
    try {
        const allAds = await AdsSchema.find({});
        res.render('pages/manageAds.ejs', { allAds });
    } catch (err) {
        res.render('err/error.ejs', { err });
    }
});


ROUTER.get('/:id', async function (req, res) {
    const { id } = req.params;
    try {
        const sAd = await AdsSchema.findById(id.trim()).populate('postUser');
        res.render('pages/details.ejs', { sAd });
    } catch (err) {
        error('Something went wrong ::::: ', err);
    }
});

ROUTER.delete('/:id', async function (req, res) {
    const { id } = req.params;
    
    try {
        const findAds = await AdsSchema.findById(id);
        for(let image of findAds.image){
            if(image.filename){
                info('File Found:', image.filename);
                await cloudinary.uploader.destroy(image.filename, function(err, res){
                    info(err, res);
                });
            }
        }
        await AdsSchema.findByIdAndDelete(id);
        req.flash('success', 'Ad is Successfully Deleted');
        res.redirect('/ads/manageads');
    } catch (err) {
        req.flash('error', err);
        error(err);
    }
});

/* making router accessible to everyone */
module.exports = ROUTER;