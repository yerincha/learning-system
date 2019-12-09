/* eslint-disable no-param-reassign */
const Promise = require('bluebird');
const utils = require('../lib/hashUtils');
const db = require('../db/index');

module.exports.createSession = (req, res, next) => {
  // check for session cookie
  Promise.resolve(req.cookies.cslms)
    .then((hash) => {
      if (!hash) {
        // make a session
        throw hash;
      }
      // attemp load session from database
      return db.Session.findOne({ where: { hash } })
        .then((session) => {
          if (!session || !session.userId) {
            return session;
          }
          return db.User.findOne({ where: { id: session.userId } })
            .then((user) => {
              session.user = user;
              return session;
            });
        });
    })
    .then((session) => {
      if (!session) {
        // make a session
        throw session;
      }

      return session;
    })
    .catch(() => {
      // make a session
      const createHash = () => {
        const data = utils.createRandom32String();
        const hash = utils.createHash(data);
        return hash;
      };

      const newHash = createHash();
      return db.Session.create({ hash: newHash })
        .then(() => db.Session.findOne({ hash: newHash }))
        .then((session) => {
          res.cookie('cslms', newHash);
          return session;
        });
    })
    .then((session) => {
      // otherwise -> set session on req object
      req.session = session;
      next();
    });
};

module.exports.verifySession = (req, res, next) => {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
};
