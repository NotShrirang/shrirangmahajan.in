import VectorEmbeddingsBlog from "./blogs/VectorEmbeddings";
import AttentionBlog from "./blogs/AttentionExplanationIsAllYouNeed";

const blogs = [
    {
        title: VectorEmbeddingsBlog.title,
        content: VectorEmbeddingsBlog.content,
        slug: VectorEmbeddingsBlog.slug,
        image: VectorEmbeddingsBlog.image,
        tags: VectorEmbeddingsBlog.tags,
        date: VectorEmbeddingsBlog.date,
        readTime: VectorEmbeddingsBlog.readTime,
    },
    {
        title: AttentionBlog.title,
        content: AttentionBlog.content,
        slug: AttentionBlog.slug,
        image: AttentionBlog.image,
        tags: AttentionBlog.tags,
        date: AttentionBlog.date,
        readTime: AttentionBlog.readTime,
    },
];
export default blogs;