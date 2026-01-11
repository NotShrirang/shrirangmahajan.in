import VectorEmbeddingsBlog from "./blogs/VectorEmbeddings";
import AttentionBlog from "./blogs/AttentionExplanationIsAllYouNeed";
import AttentionLayerbyLayerBlog from "./blogs/AttentionLayerByLayer";
import Llama4NativelyMultimodalAI from "./blogs/Llama4NativelyMultimodalAI";
import Llama2Blog from "./blogs/Llama2Explained/Llama2Explained";
import TensoraxBlog from "./blogs/TensoraxExplained/TensoraxExplained";

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
    },
    {
        title: Llama2Blog.title,
        content: Llama2Blog.content,
        slug: Llama2Blog.slug,
        image: Llama2Blog.image,
        tags: Llama2Blog.tags,
        date: Llama2Blog.date,
        readTime: Llama2Blog.readTime,
    },
    {
        title: TensoraxBlog.title,
        content: TensoraxBlog.content,
        slug: TensoraxBlog.slug,
        image: TensoraxBlog.image,
        tags: TensoraxBlog.tags,
        date: TensoraxBlog.date,
        readTime: TensoraxBlog.readTime,
    },
];

blogs.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
});

export default blogs;