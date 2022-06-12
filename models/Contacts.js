exports.contacts = function (sequelize, DataTypes) {
    const contacts = sequelize.define(
      "contacts",
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
        email: {
          type: DataTypes.STRING,
          validate: {
            isEmail: {
              args: true,
              msg: "Please enter correct email address",
            },
          },
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
  
    return contacts;
  };
  