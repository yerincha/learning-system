/* eslint-disable no-param-reassign */
const Promise = require('bluebird');
const utils = require('../lib/hashUtils');
const db = require('../db/index');

module.exports.createSession = (req, res, next) => {
  // check for session cookie
  Promise.resolve(req.cookies.cslms)
    .then((hash) => {
      // console.log('Auth Middleware Received Cookie', hash);

      if (hash === undefined) {
        // make a session
        throw hash;
      }
      // attemp load session from database
      return db.Session.findOne({ where: { hash } })
        .then((session) => {
          // console.log('Auth Middleware Session Loaded', session);
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
      // console.log('Auth Middleware No Cookie -> Create New Session');
      // make a session
      const createHash = () => {
        const data = utils.createRandom32String();
        const hash = utils.createHash(data);
        return hash;
      };

      const newHash = createHash();
      return db.Session.create({ hash: newHash })
        .then(() => db.Session.findOne({
          where: { hash: newHash },
        }))
        .then((session) => {
          // console.log('Auth Middleware Load Session After Create New', session);
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
    res.redirect('/signin');
  } else {
    next();
  }
};
