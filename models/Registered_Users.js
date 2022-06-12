exports.registeredUsers = function (sequelize, DataTypes) {
  const registeredUsers = sequelize.define(
    "registered_users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: ["Please enter the name"],
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            args: true,
            msg: "Please enter correct email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: ["Please enter the password"],
          },
        },
      },
      phoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: {
            args: 10,
            msg: "Please enter correct phone number",
          },
          unique: {
            args: true,
            msg: "Phone number must be unique",
          },
          notNull: {
            args: true,
            msg: ["Please enter the phone number"],
          },
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return registeredUsers;
};
