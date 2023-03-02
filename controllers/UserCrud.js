// Crud for chat
// Sequelize + sqlite

const Chat = require('../models/user');
const sequelize = require('./sequelize');
const Sequelize = require('sequelize');

/*
User model

This is the class for user representation

Fields:

id: int
username: string
email: string
token: sting
last_login: TIMESTAMP
created_at: TIMESTAMP
profile_pic_seed: string
*/

// Sequelize model
const UserModel = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_login: {
        type: Sequelize.DATE,
        allowNull: false
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
    profile_pic_seed: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Controllers

class UserCrud{
    constructor(User){
        this.model = UserModel;
        this.user = User;
    }

    async create(username, email, token){
        try{
            const user = new User(null, username, email, token, new Date(), new Date(), Math.floor(Math.random()*1000000));
            const result = await this.model.create(user);
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async readAll(){
        try{
            const result = await this.model.findAll();
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async readById(id){
        try{
            const result = await this.model.findOne({
                where: {
                    id: id
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async readByUsername(username){
        try{
            const result = await this.model.findOne({
                where: {
                    username: username
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async readByEmail(email){
        try{
            const result = await this.model.findOne({
                where: {
                    email: email
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async readByToken(token){
        try{
            const result = await this.model.findOne({
                where: {
                    token: token
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async updateLastLogin(id, date){
        try{
            const result = await this.model.update({
                last_login: date
            }, {
                where: {
                    id: id
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async updateToken(id, token){
        try{
            const result = await this.model.update({
                token: token
            }, {
                where: {
                    id: id
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async deleteById(id){
        try{
            const result = await this.model.destroy({
                where: {
                    id: id
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async deleteByUsername(username){
        try{
            const result = await this.model.destroy({
                where: {
                    username: username
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async deleteByEmail(email){
        try{
            const result = await this.model.destroy({
                where: {
                    email: email
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }

    async deleteByToken(token){
        try{
            const result = await this.model.destroy({
                where: {
                    token: token
                }
            });
            return result;
        }
        catch(err){
            console.log(err);
            return null;
        }
    }
}

module.exports = {
    UserCrud: UserCrud
}