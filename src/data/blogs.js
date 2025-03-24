import VectorEmbeddingsBlog from "./blogs/VectorEmbeddings";
import AttentionBlog from "./blogs/AttentionExplanationIsAllYouNeed";
import AttentionLayerbyLayerBlog from "./blogs/AttentionLayerByLayer";

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
    {
        title: AttentionLayerbyLayerBlog.title,
        content: AttentionLayerbyLayerBlog.content,
        slug: AttentionLayerbyLayerBlog.slug,
        image: AttentionLayerbyLayerBlog.image,
        tags: AttentionLayerbyLayerBlog.tags,
        date: AttentionLayerbyLayerBlog.date,
        readTime: AttentionLayerbyLayerBlog.readTime,
    }
];
export default blogs;