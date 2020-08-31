const fastify = require('fastify')();
const fetch = require('centra');
const Logger = require('leekslazylogger');
const config = require('./config.json');

//* Set stuff
const log = new Logger({
  name: config.logname
});
fastify.register(require('fastify-cors'));
fastify.register(require('fastify-rate-limit'), {
  max: config.ratelimit.max,
  timeWindow: config.ratelimit.timewin
});

//* Routes
fastify.get('/', async () => {
  log.info('Request made to /');
  return {
    message: config.helloworld
  };
});

fastify.get('/getImage', async () => {
  log.info('Request made to /getImage');
  let data = await fetch(`https://api.unsplash.com/photos/random?client_id=${config.unsplashkey}&query=nature&content_filter=high&featured=true&orientation=landscape`).send();
  data = await data.json();
  return {
    file: data.urls.full,
    photographer: data.user.name,
    location: data.location.city + ' ' + data.location.country
  }
});

//* Listen on port
fastify.listen(config.port, () => log.info('Fastify server started'));