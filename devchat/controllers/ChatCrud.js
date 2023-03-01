// Crud for chat
// Sequelize + sqlite

const Chat = require('../models/chat');
const sequelize = require('./sequelize');
const Sequelize = require('sequelize');

/*
Chat model

This is the class for chat representation

Fields:

id: int
message: string
user_id: int
created_at: TIMESTAMP
*/

// Sequelize model
const ChatModel = sequelize.define('Chat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

// Controllers

class ChatCrud{
    constructor(Chat){
        this.Chat = Chat;
    }

    // Create
    async create(message, user_id){
        let result = await this.Chat.create({
            message: message,
            user_id: user_id
        });

        return result;
    }

    // Read all
    async readAll(){
        let result = await this.Chat.findAll();

        return result;
    }

    // Read one
    async readOne(id){
        let result = await this.Chat.findByPk(id);

        return result;
    }

    // Update
    async update(id, message, user_id){
        let result = await this.Chat.update({
            message: message,
            user_id: user_id
        }, {
            where: {
                id: id
            }
        });

        return result;
    }

    // Delete
    async delete(id){
        let result = await this.Chat.destroy({
            where: {
                id: id
            }
        });

        return result;
    }
}

// Sync
// sequelize.sync(
//     {force: true}
// );

// Export
module.exports = {
    ChatCrud: new ChatCrud(ChatModel),
}