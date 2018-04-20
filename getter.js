// getter.js
// @copyright Copyright 2018 (c) Tom Clowers

const axios = require('axios');
const fs = require('fs');

////////Grab command-line arguments////////////////////////////////////
const argv = require('minimist')(process.argv.slice(2));

let chunk_size = typeof(argv['s']) != 'undefined' ? argv['s'] : 1048576; // Defaults to one Mebibyte

let d = new Date();
let out_file = typeof(argv['f']) != 'undefined' ? argv['f'] : "get_output_" + d.getTime();

let num_chunks = typeof(argv['c']) != 'undefined' ? argv['c'] : 4;

let console_out = typeof(argv['out']) != 'undefined' ? true : null;
///////////////////////////////////////////////////////////////////////

function get_chunk(url, chunk_size, start_at) {
	let range = "bytes=" + start_at + "-" + (start_at + chunk_size);
	return axios.get(url, {responseType:'blob', headers: {'Range': range}});
}

// A file URL must be specified
if (typeof(argv['u']) != 'undefined' && typeof(argv['help']) == 'undefined') {
	let file_url = argv['u'];
	let promiseArray = [];
	let start_at = null;
	for (let i = 0; i < num_chunks; i++) {
		if (promiseArray.length == 0) {
			promiseArray.push(get_chunk(file_url, chunk_size, i));
		} else {
			start_at = (chunk_size * i);
			promiseArray.push(get_chunk(file_url, chunk_size, start_at));
		}
	}

	axios.all(promiseArray)
	  .then((results) => { 	  	// All requests are now complete
	  	let response_data = null;
	  	results.forEach((result) => {
	  		if (!response_data) {
	  			response_data = result.data;
	  		} else {
	  			response_data += result.data;
	  		}
	  	});


	  	if (console_out) {
	  		console.log(response_data);
	  	} else {
	  		// Write to outfile
			fs.writeFile(out_file, response_data, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("Response data saved to file: " + out_file);
			});
	  	}
	  });
} else {
	console.log("Usage:\n$ node ./getter.js -u https://example.com [-s chunk_size in bytes -f output_file -c number_of_chunks --out (print to the console) --help]\n");
	return;
}
