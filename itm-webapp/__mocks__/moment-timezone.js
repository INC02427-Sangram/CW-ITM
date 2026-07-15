const actualMoment = jest.requireActual('moment-timezone');

const moment = jest.fn(() => ({
  tz: jest.fn().mockReturnThis(),
  format: jest.fn().mockReturnValue('+00:00'),
}));

// Copy static methods from actual moment
moment.tz = actualMoment.tz;
moment.utc = actualMoment.utc;
moment.unix = actualMoment.unix;
moment.locale = actualMoment.locale;

module.exports = moment;
