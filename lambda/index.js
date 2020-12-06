// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
'use strict';

const getRandomShlok = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'आपका स्वागत है। श्लोक सुनने के लिए बोलें "Alexa, श्लोक सुनाओ।"';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const ShlokIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ShlokIntent';
    },
    async handle(handlerInput) {
        var speechText = "";
        await getRandomShlok('https://api.npoint.io/c35f8436d7f1c2f0a6a9')
        .then((response) => {
            const data = JSON.parse(response);
            const random = Math.floor(Math.random() * (691 - 0 + 1) ) + 0;
            const json = data[random];
            speechText = "अध्याय " + json.chapter_number + ", श्लोक  " + json.verse_number;
            speechText += " <break time='2s' /> ";
            speechText += json.text;
            speechText += " <break time='2s' /> ";
            speechText += " अर्थात";
            speechText += " <break time='2s' /> ";
            speechText += json.meaning;
            speechText += " <break time='2s' /> ";
            speechText += 'इस alexa स्किल को आज़माने के लिए आपका बहुत-बहुत धन्यवाद। अगर आपको यह स्किल पसंद आई तो कृपया इसे रेट करें।';
          })
        .catch((err) => {
            
        });
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        var speechText = 'यह स्किल आपको श्रीमद्‍भगवद्‍गीता के श्लोक सुनाती है। श्लोक सुनने के लिए कहें,';
        speechText += "Alexa, श्लोक सुनाओ। ";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'इस alexa स्किल को आज़माने के लिए आपका बहुत-बहुत धन्यवाद। अगर आपको यह स्किल पसंद आई तो कृपया इसे रेट करें।';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ShlokIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
