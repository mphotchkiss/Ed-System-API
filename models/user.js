const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')

const { Submission } = require('./submission')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "A user with that email already exists"
        }
     },
    role: { 
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "student",
        validate: {
            isIn: {
                args: [['student', 'instructor', 'admin']],
                msg: "Invalid role. Must be student, instructor, or admin"
            }
        }
    }
})

User.hasMany(Submission, { foreignKey: "userId" })
Submission.belongsTo(User)

exports.User = User

exports.UserClientFields = [
    'firstName',
    'lastName',
    'email',
    'role'
]