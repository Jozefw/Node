/* NOTES TO READER:
 
 Since time is limited, I tried to get the biggest chunks of the chore done first,
 there is no front end at this time, at this point I'm sending back an html form
 that will input the text to be converted.   Another option was to test the endpoint
 I built here with something like the Chrome Postman extension.

 FYI,  I have no server side experience.  This was my first attempt at Node code!

*/



/* Exercise:
Build a web service (e.g. one that responds with JSON) in Ruby or Javascript to convert arbitrary text so that it contains only 1 space after a period between sentences. The response should contain the converted text along with meta data describing the corrections made.

Then, build a web based front-end that will submit arbitrary text to this service via AJAX and show the result. Additionally, the rendered result should include a visual representation of where corrections were made in the text.

Accuracy of the conversion isn't necessarily important (i.e. don't worry about what is and is not a sentence), instead you will be judged on the following criteria:
Clarity and conciseness of code
Ruby / Javascript best practices
HTTP best practices
Handling of edge cases
Start by building the web service component of the system and then get as far as you can with the front-end piece. Don't worry if you can't finish it.
*/

// this is the node package that lets me process HTTP requests (GET / POST / ...)
var http = require('http');

// This is the name attribute I'm embedding in the HTML form
var inputName = 'input1'; 

// After initial GET request for HTML page, this is the form I return to the browser
var postHTML = 
  '<html><head><title>Type in a string</title></head>' +
  '<body>' +
  '<form method="post">' +
  '<input name="' + inputName + '" size="80"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';


// Creating a simple server
http.createServer(function (req, res) {
  var body = '',            // The full body of data received from the POST
      fixed = '';           // This will hold the processed string that we return

  // Handler to concatenate chunks data coming in
  req.on('data', function (chunk) {
    body += chunk;
  });

  // Handler for any requests from browser,
  // Here we're handling both the GET for the initial index.html page,
  // and the POST with all the data in the form.
  req.on('end', function () {

    if ( req.method === 'POST' ) {
      // console.log(body);

      fixed = munge( body );  // filter out the extra stuff in the string body
      res.end( fixed );
    }
    else {                    // If it wasn't a POST, it was GET for HTML page data so send the form
      res.writeHead(200);
      res.end(postHTML);
    }
  });

}).listen(8080);            // Port to listen on.


/* munge() takes a string and will:
    - take out the 'name' attribute on the form element that was used,
    - take out all the '+' that was put in and replace it with spaces,
    - turn all occurances of multiple spaces after a '.' into just one space,
    - return the filtered string.

  Example: 
  'input1=blah%2B+blah+blah+..'
  and should be returned in the form:
  'blah+ blah blah'

  TODO EDGE CASE:  turn '%2B' back into a '+'

*/
function munge( str ) {
  var result = '',
      tempArray = [];

  var dotEncounteredFlag = false;      

  // First take out 'name=' attribute of the input element embeded
  str = str.substr( inputName.length+1 );  

  // Now take out '+' and replace with spaces
  str = str.split('+').join(' ');  


  // Now go through string and if we encounter a dot, swallow all the extra spaces after it
  for (var i=0; i < str.length; i++ ) {
    result += str[i];

    if ( str[i] === '.' ) {
      while ( (i+1 < str.length) && str[i+1] === ' ' )  i++;      // Disregard all spaces after the dot
      if ( i+1 < str.length) result += ' ';                        // Add one space after our last encountered dot.
    }

  }


  

  return result;
}