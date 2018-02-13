import express, { Router } from 'express';
import { index } from './controllers/kohteet';
import mongoose from 'mongoose';
import Kohde from './models/kohde';

//Initialize router
const router = Router();

// Handle /kohteet.json route with index action from kohteet controller
router.route('/kohteet.json').get(index);

// Directs the user using /new to  file new.pug where you can add a new place in database.
router.get('/new', function(req, res) {
    res.render('new', { title: 'Lisää kohde' });
});

router.get('/modify/:id', function(req, res) {
    var id = req.params.id;
    
    Kohde.findById(id, (err, kohde) => {
        var type = kohde.type;
        var service, food, sight;
        
        if (type == "Food") {
            food = true;
        } else if (type == "Service") {
            service = true;
        } else {
            sight = true;
        }

        
        res.render('new', { 
            id: id, 
            nimi: kohde.name, 
            city: kohde.address.city, 
            postalCode: kohde.address.postalCode, 
            street: kohde.address.street, 
            phoneNumber: kohde.address.phoneNumber,
            picture: kohde.picture[0],
            latitude: kohde.location.latitude,
            longitude: kohde.location.longitude,
            info: kohde.info,
            directions: kohde.directions,
            monStart: kohde.openingHours.mon.start,
            monEnd: kohde.openingHours.mon.end,
            tueStart: kohde.openingHours.tue.start,
            tueEnd: kohde.openingHours.tue.end,
            wedStart: kohde.openingHours.wed.start,
            wedEnd: kohde.openingHours.wed.end,
            thuStart: kohde.openingHours.thu.start,
            thuEnd: kohde.openingHours.thu.end,
            friStart: kohde.openingHours.fri.start,
            friEnd: kohde.openingHours.fri.end,
            satStart: kohde.openingHours.sat.start,
            satEnd: kohde.openingHours.sat.end,
            sunStart: kohde.openingHours.sun.start,
            sunEnd: kohde.openingHours.sun.end,
            food: food,
            service: service,
            sight: sight,
            title: 'Muuta kohdetta' });
    });

});

//Posts filled form (new 'kohde') to database
router.post('/add', function(req, res) {

    var type = req.body.type;
    var name = req.body.name;
    var city = req.body.city;
    var postalCode = req.body.postalCode;
    var street = req.body.street;
    var phoneNumber = req.body.phoneNumber;
    var picture = req.body.picture;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var info = req.body.info;
    var monStart = req.body.monStart;
    var monEnd = req.body.monEnd;
    var tueStart = req.body.tueStart;
    var tueEnd = req.body.tueEnd;
    var wedStart = req.body.wedStart;
    var wedEnd = req.body.wedEnd;
    var thuStart = req.body.thuStart;
    var thuEnd = req.body.thuEnd;
    var friStart = req.body.friStart;
    var friEnd = req.body.friEnd;
    var satStart = req.body.satStart;
    var satEnd = req.body.satEnd;
    var sunStart = req.body.sunStart;
    var sunEnd = req.body.sunEnd;
    
    if(req.body.id) {
        var objectId = req.body.id;
    } else {
        var ObjectID = require('mongodb').ObjectID;
        var objectId = new ObjectID();
    }
    
    const newData = [
        {
            "type": type,
            "name": name,
            "address": {
                "city": city,
                "postalCode": postalCode,
                "street": street,
                "phoneNumber": phoneNumber
            },
            "picture": [ picture ],
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },
            "info": info,
            "openingHours": {
                "mon": {
                    "start": monStart,
                    "end": monEnd
                },
                "tue": {
                    "start": tueStart,
                    "end": tueEnd
                },
                "wed": {
                    "start": wedStart,
                    "end": wedEnd
                },
                "thu": {
                    "start": thuStart,
                    "end": thuEnd
                },
                "fri": {
                    "start": friStart,
                    "end": friEnd
                },
                "sat": {
                    "start": satStart,
                    "end": satEnd
                },
                "sun": {
                    "start": sunStart,
                    "end": sunEnd
                }
            }
        }
    ]
    
    mongoose.connect('mongodb://localhost/kohteet');

    newData.map(data => {
        const kohde = new Kohde(data);
        var query = { _id: objectId };
        
        Kohde.findOneAndUpdate(query, kohde, {upsert:true}, function (err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
            else {
                res.redirect("kohteet.json");
            }
        });
    });

});


export default router;
