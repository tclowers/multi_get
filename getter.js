// getter.js

const axios = require('axios');
const fs = require('fs');


//Grab command-line arguments
const argv = require('minimist')(process.argv.slice(2));

let chunk_size = typeof(argv['s']) != 'undefined' ? argv['s'] : 1048576; // Defaults to one Mebibyte

let d = new Date();
let out_file = typeof(argv['f']) != 'undefined' ? argv['f'] : "get_output_" + d.getTime();

function get_one(url) {
	return axios.get(url, {responseType:'blob', headers: {'Range': "bytes=0-" + chunk_size}});	
}

function get_two(url) {
	let range2 = "bytes=" + (chunk_size + 1) + "-" + (chunk_size * 2);
	return axios.get(url, {responseType:'blob', headers: {'Range': range2}});
}

function get_three(url) {
	let range3 = "bytes=" + ((chunk_size * 2) + 1) + "-" + (chunk_size * 3);
	return axios.get(url, {responseType:'blob', headers: {'Range': range3}});
}

function get_four(url) {
	let range4 = "bytes=" + ((chunk_size * 3) + 1) + "-" + (chunk_size * 4);
	return axios.get(url, {responseType:'blob', headers: {'Range': range4}});
}

// A file URL must be specified
if (typeof(argv['u']) != 'undefined' && typeof(argv['help']) == 'undefined') {
	let file_url = argv['u'];

	axios.all([get_one(file_url), get_two(file_url), get_three(file_url), get_four(file_url)])
	  .then(axios.spread((res1, res2, res3, res4) => {
	  	// All requests are now complete
	  	let response_data = res1.data + res2.data + res3.data + res4.data;

	  	// Write to outfile
		fs.writeFile(out_file, response_data, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("Response data saved to file: " + out_file);
		});
	  }));
} else {
	console.log("Usage:\n$ node ./getter.js -u https://example.com [-s chunk_size -f output_file --help]\n");
	return;
}
