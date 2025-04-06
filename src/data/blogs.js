import VectorEmbeddingsBlog from "./blogs/VectorEmbeddings";
import AttentionBlog from "./blogs/AttentionExplanationIsAllYouNeed";
import AttentionLayerbyLayerBlog from "./blogs/AttentionLayerByLayer";
import Llama4NativelyMultimodalAI from "./blogs/Llama4NativelyMultimodalAI";

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
    },
    {
        title: Llama4NativelyMultimodalAI.title,
        content: Llama4NativelyMultimodalAI.content,
        slug: Llama4NativelyMultimodalAI.slug,
        image: Llama4NativelyMultimodalAI.image,
        tags: Llama4NativelyMultimodalAI.tags,
        date: Llama4NativelyMultimodalAI.date,
        readTime: Llama4NativelyMultimodalAI.readTime,
    }
];
export default blogs;