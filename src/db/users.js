const bcrypt = require("bcryptjs");
const format = require("date-fns/format");
const omit = require("lodash/omit");
const isEmpty = require("lodash/isEmpty");
const knex = require("../connection");
const InvalidArgument = require("./invalidargument");

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

async function getUserByEmail(email) {
  const user = await _getUserByEmail(email);
  return omitPassword(user);
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

async function createUser(data) {
  const now = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  const user = Object.assign({}, data, {
    active: 1,
    password: bcrypt.hashSync(data.password, 10),
    created_at: now,
    updated_at: now,
  });

  const verify = await _getUserByEmail(data.email);

  if (!isEmpty(verify)) {
    throw new InvalidArgument(
      "email",
      "A user with this email address already exists"
    );
  }

  return knex("users")
    .insert(user)
    .returning("id")
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
