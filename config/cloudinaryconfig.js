'use strict'; 

const cloudinary = require('cloudinary')


if (typeof $cloudinary_api_key === 'undefined') {  // local deploy
	var cloudinarykeys = require('./cloudinarykeys');

} else {  // import from Circle CI
	var cloudinarykeys = {  
		cloud_name: cloudinary_cloud_name, 
  		api_key: cloudinary_api_key, 
  		api_secret: cloudinary_api_secret, 
	}
}

cloudinary.config(cloudinarykeys);