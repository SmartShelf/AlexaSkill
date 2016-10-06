
var APP_ID = undefined; 


/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var SmartShelf = function(){
  AlexaSkill.call(this, APP_ID);  
};


SmartShelf.prototype = Object.create(AlexaSkill.prototype);
SmartShelf.prototype.constructor = SmartShelf;

SmartShelf.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
     console.log("SmartShelf onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    
};

SmartShelf.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
     console.log("SmartShelf onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

SmartShelf.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};


SmartShelf.prototype.intentHandlers = {

    "GetShelfScalesInfoIntent": function (intent, session, response) {
        handleSmartShelf(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "Help Intent";
        
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        
        response.tell(speechOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

/**
 * Function to handle the onLaunch skill behavior
 */

function getWelcomeResponse(response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var cardTitle = "Smart Shelf";
    var repromptText = "With Smart Shelf , you can check the weight of your items and order a new items ";
    var speechText = "<p>Smart Shelf.</p><p>How can help you?</p>";
    var cardOutput = "How can i help you?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.

    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleSmartShelf(intent, session, response) {
    
    getJSONSmartShelfInfo(null,null,function(data){
        response.tell(data);
    });    
}


var urlPrefix = 'http://smartshelf.mybluemix.net/main/scaleInfo';
var https = require('http');
var fs = require('fs');

function getJSONSmartShelfInfo(day, date, eventCallback) {
    var url = urlPrefix;

    https.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            
            console.log(body);
            var obj=JSON.parse(body);
            eventCallback(obj.product.name);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    
    var skill = new SmartShelf();
    skill.execute(event, context);
};

