'use strict';

const router = require('express').Router();
const Seller = require('../models/Seller');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const _ = require('lodash');

router.use(bodyParser.urlencoded({extended: true}));

router.get('/sellers', (req, res) => {
  Seller.find().lean().exec()
    .then(data => {
      res.json(data);
    });
});

router.post('/sellers', (req, res) => {
  new Seller({
    info: {
      Name: req.body.name,
    },
    coords: [req.body.latitude, req.body.longitude]
  }).save()
    .then(() => {
      return res.json({success: true});
    })
    .catch(err => {
      return res.json({success: false, error: err});
    });
});

router.post('/sellers/bulk', (req, res) => {
  Promise.all(_.chunk(req.body.bulk.split(/\r?\n/).filter(s => s.trim().length > 0), 3)
    .map(c => {
      if(c.length < 3) return Promise.resolve();
      console.log('c:', c);
      return new Seller({
        info: {Name: c[0]},
        coords: [c[1], c[2]]
      }).save();
    }))
    .then(() => {
      return res.json({success: true});
    })
    .catch(err => {
      return res.json({success: false, error: err});
    });
});

module.exports = router;
