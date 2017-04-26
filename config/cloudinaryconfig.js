'use strict'; 

const cloudinary = require('cloudinary')

if (typeof $cloudinary_api_key === 'undefined') {  // local deploy
	var cloudinarykeys = require('./cloudinarykeys');
	// console.log('cloudinary = ')
	// console.dir(cloudinarykeys)
} else {  // import from Circle CI
	var cloudinarykeys = {  
		cloud_name: ENV['cloudinary_cloud_name'], 
  		api_key: ENV['cloudinary_api_key'], 
  		api_secret: ENV['cloudinary_api_secret'], 
	}
}

cloudinary.config(cloudinarykeys);
