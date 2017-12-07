const test = require('tape')
const ident = require('../../wot-identity') // TODO
const crypto = require('../../wot-crypto') // TODO
const contacts = require('../')

test('.addUser and .verifyUser', t => {
  const pass = crypto.id(8)
  ident.createUser(pass, {name: 'jack handey'}, function (err, user1) {
    if (err) throw err
    const cert1 = ident.openCert(user1)
    const cs = contacts.addUser(user1, {})
    t.notOk(cs[cert1.id].verified)
    const cs1 = contacts.verifyUser(cert1.id, cs)
    t.ok(cs1[cert1.id].verified)
    t.strictEqual(cs1[cert1.id].user.imprint, user1.imprint)
    t.strictEqual(cs1[cert1.id].user.lock, user1.lock)
    t.strictEqual(cs1[cert1.id].user.cert, user1.cert)
    t.end()
  })
})

test('.viewVerifiers', t => {
  const pass = crypto.id(8)
  ident.createUser(pass, {name: 'finn the human'}, function (err, user1) {
    if (err) throw err
    ident.createUser(pass, {name: 'jake the dog'}, function (err, user2) {
      if (err) throw err
      ident.stampUser(user1, user2)
      ident.stampUser(user2, user1)
      const cs = contacts.addUser(user1, {})
      contacts.addUser(user2, cs)
      const result1 = contacts.viewVerifiers(user2.id, cs)
      t.strictEqual(result1.errors.length, 0)
      t.strictEqual(result1.verifiers.length, 1)
      t.strictEqual(result1.verifiers[0], user1.id)
      const result2 = contacts.viewVerifiers(user1.id, cs)
      t.strictEqual(result2.errors.length, 0)
      t.strictEqual(result2.verifiers.length, 1)
      t.strictEqual(result2.verifiers[0], user2.id)
      // Corrupt user1's stamped hash verifying user2
      cs[user1.id].user.stamped_users[user2.id] = 'xyz'
      const result3 = contacts.viewVerifiers(user2.id, cs)
      t.strictEqual(result3.errors.length, 1)
      t.strictEqual(result3.verifiers.length, 0)
      t.strictEqual(result3.errors[0].id, user1.id)
      t.end()
    })
  })
})
