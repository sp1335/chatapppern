module.exports = class UserDto{
    email;
    userid;
    role;

    constructor(user) {
        this.email = user[0];
        this.userid = user[1];
        this.role = user[2];
    }
}