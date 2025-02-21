const categoryRoute = require('./category.route.js');
const cultureRoute = require('./culture.route.js');
const mediafileRoute = require('./mediafile.route.js');
const reviewRoute = require('./review.route.js');
const tourRoute = require('./tour.route.js');
const userRoute = require('./user.route.js');
const authRoute = require('./auth.route.js');

module.exports = (app) => {
    const version = '/api/v1';
    app.use(version + '/category', categoryRoute);
    app.use(version + '/culture', cultureRoute);
    app.use(version + '/mediafile', mediafileRoute);
    // app.use(version + '/review', reviewRoute);
    app.use(version + '/tour', tourRoute);
    // app.use(version + '/user', userRoute);
    app.use(version + '/auth', authRoute);
  };