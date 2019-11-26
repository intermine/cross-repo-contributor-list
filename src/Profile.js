class Profile {
    constructor(data) {
        this.id = data.login;
        this.url = data.html_url;
        this.avatar = data.avatar_url;
    }
}
module.exports = Profile;