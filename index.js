const assert = require('assert')
const ident = require('../wot-identity') // TODO

const contacts = module.exports = {}

// Add a new user into a set of contacts
// cs is simply an object. Pass in an empty object to start a new set
contacts.addUser = function addUser (user, cs) {
  assert(user.imprint && user.imprint.length, 'user needs .imprint')
  assert(user.lock && user.lock.length, 'user needs .imprint')
  assert.strictEqual(typeof user.stamped_users, 'object', 'user needs .stamped_users')
  assert(user.cert && user.cert.length, 'user needs a JSON cert')
  const cert = ident.openCert(user)
  const id = cert.id
  cs[id] = {
    user: {
      imprint: user.imprint,
      lock: user.lock,
      cert: user.cert,
      stamped_users: user.stamped_users
    },
    verified: false
  }
  return cs
}

// For a given contact, list all the other contacts who have verified them
contacts.viewVerifiers = function viewVerifiers (id, cs) {
  const verifiers = []
  const errs = []
  for (var contactID in cs) {
    var stamped = cs[contactID].user.stamped_users[id]
    if (stamped) {
      try {
        ident.verifyStampedUser(cs[contactID].user, cs[id].user)
        verifiers.push(contactID)
      } catch (e) {
        errs.push({id: contactID, err: e})
      }
    }
  }
  return {verifiers: verifiers, errors: errs}
}

contacts.verifyUser = function verifyUser (id, cs) {
  cs[id].verified = true
  return cs
}
