const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const format = require("date-fns/format");
const omit = require("lodash/omit");
const isEmpty = require("lodash/isEmpty");
const isObject = require("lodash/isObject");
const knex = require("../connection");
const InvalidArgument = require("./invalidargument");

function omitPassword(o) {
  if (!isObject(o)) {
    return o;
  }
  return omit(o, ["password"]);
}

async function getUserById(id) {
  const user = await knex("users").select().where({ id, active: true }).first();

  return omitPassword(user);
}

// Exposes 'password', so this method is private
function _getUserByEmail(email) {
  return knex("users").select().where({ email, active: true }).first();
}

async function getUserByEmail(email) {
  const user = await _getUserByEmail(email);
  return omitPassword(user);
}

function getUserByEmailAndPassword(email, password) {
  return _getUserByEmail(email)
    .then((user) => {
      if (!bcrypt.compareSync(password, user.password)) {
        return false;
      }
      return user;
    })
    .then(omitPassword);
}

function getUserByVerificationToken(verification_token) {
  return knex("users")
    .select()
    .where({ verification_token, active: true })
    .first()
    .then((user) => omitPassword(user));
}

async function createUser(data) {
  const now = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  const user = Object.assign({}, data, {
    active: 1,
    password: bcrypt.hashSync(data.password, 10),
    verification_token: shortid.generate(),
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

async function updateUser(id, user) {
  const data = Object.assign(
    {},
    // A user may not write these fields
    omit(user, [
      "password",
      "active",
      "created_at",
      // These should only ever be set by the API tier, never by the user
      // They should get dropped thanks to the Joi schema validation
      //"verification_token",
      //"verified",
      //"last_logged_in",
    ]),
    {
      updated_at: format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    }
  );

  const original = await getUserById(id);

  if (!original) {
    throw new Error("Original user could not be found.");
  }

  // If password is set, hash it.
  if (!isEmpty(user.password)) {
    data.password = bcrypt.hashSync(user.password, 10);
  }

  if (data.email && original.email != data.email) {
    data.verification_token = shortid.generate();
    data.verified = null;
  }

  await knex("users").update(data).where("id", id);

  return await getUserById(id);
}

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByEmailAndPassword,
  getUserByVerificationToken,
  createUser,
  updateUser,
};
