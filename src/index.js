const fastify = require('fastify')();
const fetch = require('centra');
const Logger = require('leekslazylogger-fastify');
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
  return {
    message: config.helloworld
  };
});

fastify.get('/getImage', async (_req, res) => {
  const data = await (await fetch(`https://api.unsplash.com/photos/random?client_id=${config.unsplashkey}&query=nature&content_filter=high&featured=true&orientation=landscape`).send()).json();
  res.send({
    file: data.urls.full + '?w=1920',
    photographer: data.user.name,
    location: data.location.city + ' ' + data.location.country,
    photographer_page: data.user.links.html + '?utm_source=mue&utm_medium=referral'
  });
  await fetch(`${data.links.download_location}?client_id=${config.unsplashkey}`).send();
});

//* Listen on port
fastify.listen(config.port, () => log.info(`Server started on port ${config.port}`));
