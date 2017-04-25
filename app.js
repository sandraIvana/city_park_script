/*
// friendly chat
var API_KEY = "AIzaSyDD9ek9ZC9-ND7RX8qpIOLm4NbApcfB4xw"; // Your Firebase Cloud Messaging Server API key
var serviceAccount = require("./friendlychat-d7094-firebase-adminsdk-i7bfa-bb4a1edf63.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://friendlychat-d7094.firebaseio.com/"
});

console.log(request);*/


var firebase = require('firebase-admin');
var request = require('request');
var express = require('express');
var http = require("https");
var app = express();
app.listen(process.env.PORT || 5000);

var API_KEY = "AIzaSyBajjfGLo3Cao6swyq-vXvhwEWVHFB-qZE"; // Your Firebase Cloud Messaging Server API key

// Fetch the service account key JSON file contents
var serviceAccount = require("./city-park-ba446-firebase-adminsdk-id4ua-205f02de92.json");


// Initialize the app with a service account, granting admin privileges
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://city-park-ba446.firebaseio.com/"
});
ref = firebase.database().ref();

function listenForNotificationRequests() {
    var admin_notifications = ref.child('notifications/admin');
    var room_notifications = ref.child('notifications/room');

    admin_notifications.on('child_added', function(notificationSnapshot)
    {
        var notification = notificationSnapshot.val();

        console.log(request);

        sendNotificationToAdmin(
            notification.room,
            notification.message,
            function() {
                notificationSnapshot.ref.remove();
            }
        );

    }, function(error) {
        console.error(error);
    });


    room_notifications.on('child_added', function(notificationSnapshot)
    {
        var notification = notificationSnapshot.val();

        console.log(request);

        sendNotificationToRoom(
            notification.room,
            notification.message,
            function() {
                notificationSnapshot.ref.remove();
            }
        );

    }, function(error) {
        console.error(error);
    });
}

function sendNotificationToAdmin(room, message, onSuccess) {
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type' :' application/json',
            'Authorization': 'key=' + API_KEY
        },
        body: JSON.stringify({
            notification: {
                title: room,
                body: message,
                sound: 'request_notification'
            },
            //to : '/topics/user_' + username
            to : '/topics/admin'
        })
    }, function(error, response, body)
    {
        if (error) { console.error(error); }
        else if (response.statusCode >= 400) {
            console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage);
            //console.log(error);
        }
        else {
            onSuccess();
        }
    });
}

function sendNotificationToRoom(room, message, onSuccess) {
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type' :' application/json',
            'Authorization': 'key=' + API_KEY
        },
        body: JSON.stringify({
            notification: {
                title: room,
                body: message,
                sound: 'request_notification'
            },
            to : '/topics/room_' + room
        })
    }, function(error, response, body)
    {
        if (error) { console.error(error); }
        else if (response.statusCode >= 400) {
            console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage);
            //console.log(error);
        }
        else {
            onSuccess();
        }
    });
}

// start listening
listenForNotificationRequests();

setInterval(function() {
    http.get("https://aqueous-depths-31230.herokuapp.com/");
}, 300000);