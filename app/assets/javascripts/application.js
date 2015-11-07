// // This is a manifest file that'll be compiled into application.js, which will include all the files
// // listed below.
// //
// // Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// // or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
// //
// // It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// // compiled file.
// //
// // Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// // about supported directives.
// //
// //= require jquery
// //= require jquery_ujs
// //= require turbolinks
// //= require_tree .

// <script type="text/javascript"> -> this is only if the script is inside an HTML file.

// Your websocket URI should be an absolute path. The following sets the base URI.
// remember to update to the specific controller's path to your websocket URI.
var ws_controller_path = '/ws'; // change to '/controller/path'
var ws_uri = (window.location.protocol.match(/https/) ? 'wss' : 'ws') + '://' + window.document.location.host + ws_controller_path
// websocket variable.
var websocket = NaN
// count failed attempts
var websocket_fail_count = 0
// to limit failed reconnection attempts, set this to a number.
var websocket_fail_limit = NaN


function init_websocket()
{
    if(websocket && websocket.readyState == 1) return true; // console.log('no need to renew socket connection');
    websocket = new WebSocket(ws_uri);
    websocket.onopen = function(e) {
        // reset the count.
        websocket_fail_count = 0
        // what do you want to do now?
    };

    websocket.onclose = function(e) {
        // If the websocket repeatedly you probably want to reopen the websocket if it closes
        if(!isNaN(websocket_fail_limit) && websocket_fail_count >= websocket_fail_limit) {
            // What to do if we can't reconnect so many times?
            return
        };
        // you probably want to reopen the websocket if it closes.
        if(isNaN(websocket_fail_limit) || (websocket_fail_count <= websocket_fail_limit) ) {
            // update the count
            websocket_fail_count += 1;
            // try to reconect
            init_websocket();
        };
    };
    websocket.onerror = function(e) {
        // update the count.
        websocket_fail_limit += 1
        // what do you want to do now?
    };
    websocket.onmessage = function(e) {
        // what do you want to do now?
        console.log(e.data);
        msg = JSON.parse(e.data)
        // alert("user id: " + msg.from + " said:\n" + msg.text)

      $('#task-form').append('<h3 style= "margin-left:100px;">Unread Messages</h3>' + msg.text+'<br/>')
    };
}
// setup the websocket connection once the page is done loading
window.addEventListener("load", init_websocket, false); 

// </script>
