# wot-keyring

## addUser(user, contacts)

`user` should be an object with `.imprint`, `.lock`, `.stamped_users`, and `.cert`

`contacts` can be an empty object if you are just starting a new contact list, or an object returned by a previous call to `addUser`.

Returns the object with all contacts

## verifyUser(id, contacts)

`id` is a user id

`contacts` is your object of all contacts, returned by `addUser`

Returns the contacts object

## viewVerifiers(id, contacts)

`id` is a user id

`contacts` is your object of all contacts, returned by `addUser`

Returns an object of:
* `verifiers`: Array of ids valid verifiers
* `errors`: Array of errors encountered validating signers. Each error will have the user id and error object
