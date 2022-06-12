exports.globalUsers = function (sequelize, DataTypes) {
  const globalUsers = sequelize.define(
    "global_users",
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
            msg: "Please enter the name",
          },
        },
      },
      spamCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: 10,
            msg: "Please enter correct phone number",
          },
          notNull: {
            args: true,
            msg: "Please enter the phone number",
          },
          isNumeric: true,  
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return globalUsers;
};
