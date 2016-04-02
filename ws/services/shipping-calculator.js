'use strict'

var mongoose = require('mongoose')
    , Q = require('q')
    , _ = require('lodash')
    ;

function calc(shippingType, logiPrices, weight, volume, destZone) {
    if (!destZone)
        return '无法找到目的地分区';
    switch(shippingType) {
        case 'express':
            return calc_Express(logiPrices, weight, volume, destZone);
        case 'air':
            return calc_Air(logiPrices, weight, volume, destZone);
        case 'ocean':
            return calc_Ocean(logiPrices, weight, volume, destZone);
    }
}

function calc_Express(logiPrices, weight, volume, destZone) {
    for (var i = 0; i< logiPrices.length; i++) {
        var lp = logiPrices[i];
        if (lp.priceType === 'total' && weight >= lp.min && weight < lp.max) {
            var destPrice = lp.priceSet[destZone.zone];
            if (!destPrice)
                return '此分区的价格没有设置';
            else
                return destPrice;
        }else if(lp.priceType === 'kg' && weight >= lp.min && weight < lp.max) {
            var destPrice = lp.priceSet[destZone.zone];
            if (!destPrice)
                return '此分区的价格没有设置';
            else
                return destPrice * weight;
        }
    }
    return '单价没有设置';
}

function calc_Air(logiPrices, weight, volume, destZone) {
    for (var i = 0; i< logiPrices.length; i++) {
        var lp = logiPrices[i];
        if (lp.priceType === 'total' && weight >= lp.min && weight < lp.max) {
            var destPrice = lp.priceSet[destZone.zone];
            if (!destPrice)
                return '此分区的价格没有设置';
            else
                return destPrice;
        }else if(lp.priceType === 'kg' && weight >= lp.min && weight < lp.max) {
            var destPrice = lp.priceSet[destZone.zone];
            if (!destPrice)
                return '此分区的价格没有设置';
            else
                return destPrice * weight;
        }
    }
    return '单价没有设置';
}

function calc_Ocean(logiPrices, weight, volume, destZone) {
    if (logiPrices.length === 0)
        return '单价没有设置';
    var lp = logiPrices[0];

    var destPrice = lp.priceSet[destZone.zone];
    if (!destPrice)
        return '此分区的价格没有设置';

    return (volume / lp.max) * destPrice;
}

module.exports = {
    calc: calc,
}