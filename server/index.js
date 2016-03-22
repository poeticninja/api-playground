/**
* Dependencies.
*/
var Hapi = require('hapi');
var Good = require('good');
var GoodConsole = require('good-console');
var Boom = require('boom');
var Joi = require('joi');
var Vision = require('vision');
var Swig = require('swig');

// Create a new server
var server = new Hapi.Server();

// Setup the server with a host and port
server.connection({
    port: parseInt(process.env.PORT, 10) || 3000,
    host: '0.0.0.0',
    router: {
        stripTrailingSlash: true
    }
});

/*
    Load all plugins and then start the server.
    First: community/npm plugins are loaded
    Second: project specific plugins are loaded
 */
server.register([
    {
        register: Good,
        options: {
            reporters: [{
                reporter: GoodConsole,
                events: { ops: '*', request: '*', log: '*', response: '*', 'error': '*' }
            }]
        }
    },
    {
        register: Vision
    }
], function () {

    server.views({
       engines: {
           html: Swig
       },
       relativeTo: __dirname,
       path: 'views'
    });


    server.route({
        method: 'GET',
        path: '/{path}',
        config: {
            handler: function(request, reply){
                reply(Boom.notFound());
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply){
                reply.view('index', {
                    title: 'Node.js Houston is Awesome!'
                });
            }
        }
    });

    //Start the server
    server.start(function() {
        //Log to the console the host and port info
        console.log('Server started at: ' + server.info.uri);
    });
});
