/*
User model

This is the class for chat representation

Fields:

id: int
user_id: int
message: string
created_at: TIMESTAMP
*/

class Chat{
    constructor(id, user_id, message, created_at){
        this.id = id;
        this.user_id = user_id;
        this.message = message;
        this.created_at = created_at;
    }
}

module.exports = Chat;