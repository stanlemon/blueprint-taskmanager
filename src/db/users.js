const bcrypt = require("bcryptjs");
const format = require("date-fns/format");
const omit = require("lodash/omit");
const knex = require("../connection");

function omitPassword(o) {
  return omit(o, ["password"]);
}

function getUserById(id) {
  return knex("users")
    .select()
    .where({ id, active: true })
    .first()
    .then(omitPassword);
}

// Exposes 'password', so this method is private
function _getUserByEmail(email) {
  return knex("users")
    .select()
    .where({ email, active: true })
    .first();
}

function getUserByEmail(email) {
  return _getUserByEmail(email).then(omitPassword);
}

function getUserByEmailAndPassword(email, password) {
  return _getUserByEmail(email)
    .then(user => {
      if (!bcrypt.compareSync(password, user.password)) {
        return false;
      }
      return user;
    })
    .then(omitPassword);
}

function createUser(data) {
  const now = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  const user = Object.assign({}, data, {
    active: 1,
    password: bcrypt.hashSync(data.password, 10),
    created_at: now,
    updated_at: now,
  });

  // TODO: Validate if there is an existing username

  return knex("users")
    .insert(user)
    .then(([id]) => {
      return getUserById(id);
    });
}

function updateUser(id, user) {
  const data = Object.assign({}, user, {
    updated_at: format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  });

  return knex("users")
    .update(data)
    .where("id", id);
}

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByEmailAndPassword,
  createUser,
  updateUser,
};
