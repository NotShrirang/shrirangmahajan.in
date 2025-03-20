class BaseBlog {
    constructor(title, content, slug, image, tags, date, readTime) {
        this.title = title;
        this.content = content;
        this.slug = slug;
        this.image = image;
        this.tags = tags;
        this.date = date;
        this.readTime = readTime;
    }
}

export default BaseBlog;