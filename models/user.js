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


class User{
    constructor(id, username, email, token, last_login, created_at, profile_pic_seed){
        this.id = id;
        this.username = username;
        this.email = email;
        this.token = token;
        this.last_login = last_login;
        this.created_at = created_at;
        this.profile_pic_seed = profile_pic_seed;
    }
}

module.exports = User;