/*eslint no-console: "off"*/
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const Sequelize = require("sequelize");
const isEqual = require("lodash/isEqual");

module.exports = () => {
  const DEV_DATABASE_PATH = "database.sqlite";
  const DEV_DATABASE_URL = "sqlite://" + DEV_DATABASE_PATH;

  const DATABASE_URL = process.env.DATABASE_URL || DEV_DATABASE_URL;

  const sequelize = new Sequelize(DATABASE_URL, {
    // We don't use this, but it's deprecated and defaults on and I dislike warnings in my console.
    define: {
      underscored: true,
      // Prevents sequelize from changing the table names defined
      freezeTableName: true,
      hooks: {
        // Handle flipping associated rows to be updated
        beforeValidate: obj => {
          // Look up the definition of the object
          const modelDef = sequelize.model(obj.constructor.tableName);

          // Pull the associations and get just their  names
          const modelAssociations = Object.keys(modelDef.associations);

          // We'll check each association now
          modelAssociations.forEach(modelAssociation => {
            // There is none on this object, so there's nothing to manipulate
            if (obj[modelAssociation] == undefined) {
              return;
            }

            // Look up the definition of the associated object
            const assocModel = sequelize.model(modelAssociation);
            // Pull the field names that are its primary keys
            const primaryKeys = Object.keys(assocModel.primaryKeys);

            // If the association is not an array skip over it, for now
            // TODO: Support direct one to one relationships
            if (!Array.isArray(obj[modelAssociation])) {
              return;
            }

            // For each associated row
            obj[modelAssociation].forEach(association => {
              const foundPks = [];

              // Track the PKs in this particular row
              primaryKeys.forEach(pk => {
                if (association[pk] !== undefined && association[pk] !== null) {
                  foundPks.push(pk);
                }
              });

              // If all the pk's on this row match the pk's for this association we're good to treat this like an update
              if (isEqual(primaryKeys, foundPks)) {
                association.isNewRecord = false;
              }
            });
          });
        }, // End beforeValidate
      },
    },
  });

  const User = sequelize.define("users", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "You must enter a name.",
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "You must enter a valid email address.",
        },
        notEmpty: {
          msg: "You must enter a email address.",
        },
      },
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 64],
          msg: "Your password must be between 8 and 64 characters long",
        },
        notEmpty: {
          msg: "You must enter a password",
        },
      },
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  User.beforeValidate(user => {
    user.token = uuid.v4();
    return Promise.resolve(user);
  });

  User.afterValidate(user => {
    user.password = bcrypt.hashSync(user.password, 10);
    return Promise.resolve(user);
  });

  const Task = sequelize.define("tasks", {
    name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: "You must enter a name for this task.",
        },
      },
    },
    description: Sequelize.STRING,
    due: { type: Sequelize.DATE, defaultValue: null },
    completed: { type: Sequelize.DATE, defaultValue: null },
  });

  Task.belongsTo(User, { as: "user" });

  const Tag = sequelize.define(
    "tags",
    {
      name: {
        type: Sequelize.STRING,
        // Avoid duplicate tag names
        validate: {
          notEmpty: {
            msg: "You must enter a name for this tag.",
          },
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          // Tags are unique per user
          fields: ["user_id", "name"],
        },
      ],
    }
  );

  Tag.belongsTo(User, { as: "user" });

  const TaskTag = sequelize.define(
    "task_tags",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );

  Tag.belongsToMany(Task, {
    through: TaskTag,
    foreignKey: "task_id",
  });

  Task.belongsToMany(Tag, {
    through: TaskTag,
    foreignKey: "tag_id",
  });

  // Will add new tables if anything is missing
  sequelize.sync();

  return {
    sequelize,
    models: {
      User,
      Task,
      Tag,
      TaskTag,
    },
  };
};
