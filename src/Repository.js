class Repository {
    constructor(data) {
        this.name = data.name;
        this.full_name = data.full_name;
        this.description = data.description;
        this.url = data.url;
    }
}
module.exports = Repository;