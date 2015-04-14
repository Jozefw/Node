var sentText = "thing";

var userString = JSON.stringify(senttext);

var headers = {
	'Content_Type' : 'application/json', // tells remote server we are sending a json string
	'Content-Length' : userString.length  //how much data we are sending in bytes
};

var options = {
	host: 'localhost:3000',
	port: ,
	path: ,
	method: 'POST',
	headers: headers
};