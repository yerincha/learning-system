const Promise = require('bluebird');
const utils = require('../lib/hashUtils')
const db = require('../db/index');

module.exports.createSession = (req, res, next) => {

  // check for session cookie
  Promise.resolve(req.cookies.cslms)
    .then((hash) => {
      if (!hash) {
        //make a session
        throw hash;
      }
      //attemp load session from database
      return db.Session.findOne({ where: { hash } });
    })
    .then((session) => {
      if (!session) {
        //make a session
        throw session;
      }

      return session;
    })
    .catch(() => {
      //make a session
      var createHash = () => {
        let data = utils.createRandom32String();
        let hash = utils.createHash(data);
        return hash;
      };

      var newHash = createHash();
      return db.Session.create({ hash: newHash })
        .then(() => {
          return db.Session.findOne({ hash: newHash });
        })
        .then((session) => {
          res.cookie('cslms', newHash);
          return session;
        })
    })
    .then((session) => {
      // otherwise -> set session on req object
      req.session = session;
      next();
    })

};

module.exports.verifySession = (req, res, next) => {
  if (!!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
};