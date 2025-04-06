import Code from "../../utils/codeUtils";
import TenorEmbed from "../../utils/TenorEmbed.jsx";
import Expander from "../../utils/Expander.jsx";
import BaseBlog from "./BaseBlog";

import cover from "../../assets/images/blogs/Llama4NativelyMultimodalAI/cover.png";
import MixtureOfExperts from "../../assets/images/blogs/Llama4NativelyMultimodalAI/mixture-of-expert.png";
import Llama4Results from "../../assets/images/blogs/Llama4NativelyMultimodalAI/llama4-results.png";

const title = "Llama 4: The Natively Multimodal AI";

const content = (
  <div style={{ width: "100%" }}>
    <p>
      Today Meta AI announced the release of{" "}
      <a href="https://ai.meta.com/blog/llama-4-multimodal-intelligence/">
        Llama 4
      </a>
      , newest iteration of their Llama series.
    </p>
    <p>
      Llama 4 is their first natively multimodal AI that can process text,
      images and videos in a single model. This means it can understand and
      generate content in multiple formats, making it more versatile and capable
      than previous models.
    </p>
    <p>
      Llama 4 is a <b>mixture of experts (MoE)</b> model, which means it uses a
      combination of different expert models to process different types of data.
      The model can switch between different experts based on the type of data
      it is processing, allowing it to adapt to different tasks and
      environments.
    </p>
    <p>This Llama 4 release consists of 3 models</p>
    <ul>
      <li>
        <b>Llama 4: Scout</b>
        <ul>
          <li>
            Active Parameters: <b>17B</b>
          </li>
          <li>
            Expert models: <b>16</b>
          </li>
          <li>
            Total Parameters: <b>109B</b>
          </li>
          <li>
            Context Length: <b>10M</b> Tokens
          </li>
        </ul>
      </li>
      <li>
        <b>Llama 4: Maverick</b>
        <ul>
          <li>
            Active Parameters: <b>17B</b>
          </li>
          <li>
            Expert models: <b>128</b>
          </li>
          <li>
            Total Parameters: <b>400B</b>
          </li>
          <li>
            Context Length: <b>1M</b> Tokens
          </li>
        </ul>
      </li>
      <li>
        <b>Llama 4: Behemoth</b>
        <ul>
          <li>
            Active Parameters: <b>288B</b>
          </li>
          <li>
            Expert models: <b>16</b>
          </li>
          <li>
            Total Parameters: <b>2T</b>
          </li>
          <li>
            The model is still <b>under training</b>
          </li>
          <li>
            Behemoth serves as a <b>powerful "teacher" model</b>, distilling its
            knowledge into the smaller Llama 4 variants
          </li>
        </ul>
      </li>
    </ul>
    <h2>Architecture</h2>
    <p>
      The Llama 4 architecture introduces key innovations, most notably the
      <b>Mixture-of-Experts (MoE)</b> design, where different specialized
      "expert" models are activated depending on the input, for better
      efficiency and capability. For handling long sequences, Llama 4 Scout
      employs the <b>novel iRoPE architecture</b>, featuring{" "}
      <b>interleaved attention layers without positional embeddings</b> and{" "}
      <b>inference time temperature scaling</b> to improve length
      generalization, building upon rotary position embeddings (RoPE) used in
      most layers. This focus on MoE and advanced attention mechanisms defines
      the core architectural advancements in the Llama 4 family.
    </p>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <a
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        href="https://scontent.fpnq13-6.fna.fbcdn.net/v/t39.2365-6/488655517_650996354186993_1043942188415715102_n.png?_nc_cat=1&ccb=1-7&_nc_sid=e280be&_nc_ohc=nJ9Kn4jb2jYQ7kNvwHtOPIJ&_nc_oc=AdlvexkXmTGavp_kjTm0lB24iEdZPQLtXI8LcYfLk6bzy8aniG5H88K1t4hhbNDMn-r53P_XVJsQNbURH5Pu6hXi&_nc_zt=14&_nc_ht=scontent.fpnq13-6.fna&_nc_gid=iqw5pYrKQkS3Hma9qm4jbw&oh=00_AfHmVyw9YSoc5EEzUQtabWLP3E3rU16TtHBnEhv2yc7GqQ&oe=680C4740"
      >
        <img width={"60%"} src={MixtureOfExperts} alt="Mixture of Experts" />
      </a>
      <p style={{ fontSize: "0.8rem" }}>
        <i>Mixture of Experts (MoE) architecture (Source: Meta AI Blog)</i>
      </p>
    </div>
    <p>
      The remarkable capabilities of Llama 4 are built upon significant
      advancements in both pre-training and post-training methodologies.
    </p>
    <h2>Training Data</h2>
    <p>
      Llama 4 also boasts significantly enhanced multilingual capabilities,
      being pre-trained on 200 languages with a massive increase in multilingual
      tokens compared to Llama 3. The sheer scale of the pre-training data is{" "}
      <i>behemoth</i> (pun intended), exceeding 30 trillion tokens.
    </p>
    <h2>Pre-training details</h2>
    <p>
      During pre-training, Meta AI adopted a{" "}
      <b>native multimodality approach</b>, enabling the models to learn from
      vast datasets of unlabeled text, images, and videos simultaneously through
      early fusion techniques. This unified training allows for a deeper
      understanding of the relationships between different modalities.
      Furthermore, Llama 4 benefits from an improved vision encoder, enhancing
      its visual understanding capabilities.
    </p>
    <p>
      A novel training technique called <b>MetaP</b> was developed to{" "}
      <b>reliably set crucial model hyperparameters</b>, ensuring consistent
      performance across different model sizes and training scales. Efficiency
      was a key focus, with <b>FP8 precision</b> utilized during the training of
      Llama 4 Behemoth, achieving impressive FLOPs utilization.
    </p>
    <h2>Post-training details</h2>
    <p>
      Meta AI has also revamped its <b>post-training pipeline</b> to fine-tune
      Llama 4 for optimal performance in various applications. This pipeline
      follows a strategic curriculum, moving from <b>lightweight SFT</b> to {""}
      <b>online RL</b> with a focus on harder prompts, and finally to{" "}
      <b>lightweight DPO</b>.
    </p>
    <p>
      To address over-constraining of the model due SFT and DPO, they curated
      the dataset by filtering out more than 50% of their data, deemed "easy" by
      Llama judge models. The remaining harder data was used for lightweight
      DPO.
    </p>
    <p>
      They selected harder prompts for the next online RL stage and got better a
      step up in performance. Furthermore they introduced continuous online RL,
      which alternated between training the model and then using it to
      continually filter and retain only medium-to-hard difficulty prompts.
    </p>
    <h2>The Power of MoE: Efficiency and Expertise</h2>
    <p>
      The introduction of the Mixture-of-Experts architecture in Llama 4 is a
      game-changer. In MoE models, only a fraction of the total parameters are
      active for any given input token. This selective activation leads to
      several benefits:
    </p>
    <ul>
      <li>
        <b>Efficiency</b>: By activating only a subset of experts, Llama 4 can
        process data more efficiently, reducing computational costs and memory
        requirements.
      </li>
      <li>
        <b>Specialization</b>: Different experts can specialize in different
        tasks or modalities, allowing Llama 4 to excel in a wide range of
        applications.
      </li>
      <li>
        <b>Scalability</b>: The MoE architecture allows for easy scaling of the
        model by adding more experts without significantly increasing the
        overall model size.
      </li>
    </ul>
    <h2>Impressive Results and Open Availability</h2>
    <p>
      The initial results for Llama 4 are compelling. <b>Llama 4 Scout</b> is
      supposedly the best multimodal model in its class,{" "}
      <b>outperforming previous Llama generations</b> and rivals like{" "}
      <b>Gemma 3</b> and <b>Gemini 2.0 Flash-Lite</b> on various benchmarks.{" "}
      <b>Llama 4 Maverick</b> also stands out as a top performer, even{" "}
      <b>surpassing GPT-4o</b> and Gemini 2.0 Flash in many areas while
      achieving <b>comparable results to DeepSeek v3</b> on reasoning and coding
      with significantly fewer active parameters.
    </p>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <a
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        href="https://scontent.fpnq13-6.fna.fbcdn.net/v/t39.2365-6/488688605_1406312723692874_1536535503366996614_n.png?_nc_cat=1&ccb=1-7&_nc_sid=e280be&_nc_ohc=ObhAsmAr-I8Q7kNvwGobOeO&_nc_oc=AdnxhvKjifK-WtTkxcQTRPX7R4YtXXdgB3LpMXhyDaxg8CyO-H5NRmymsyF-3Bt1iSsPUfFF5AXSt1mJDYxJQxNJ&_nc_zt=14&_nc_ht=scontent.fpnq13-6.fna&_nc_gid=iqw5pYrKQkS3Hma9qm4jbw&oh=00_AfGvVIxf7KCkd-fVBVI8Ahs2NXFC8_M4LseYEaflRoQziA&oe=680C434F"
      >
        <img width={"60%"} src={Llama4Results} alt="Benchmarks" />
      </a>
      <p style={{ fontSize: "0.8rem" }}>
        <i>Llama 4 Benchmarks (Source: Meta AI Blog)</i>
      </p>
    </div>
    <h2>Use Cases and Applications</h2>
    <p>
      Llama 4 Scout boasts a significant <b>256K context length</b> from
      pre-training through post-training, unlocking remarkable ability to handle
      and understand long sequences of information. This advanced length
      generalization is evident in its strong performance on tasks requiring
      information retrieval within vast textual data{" "}
      <b>("needle in haystack")</b> and its capability to process and analyze
      massive code repositories extending up to 10 million tokens.
    </p>
    <h2>Use and Availability</h2>
    <p>
      Llama 4 models are available on{" "}
      <a href="https://www.llama.com">llama.com</a> and{" "}
      <a href="https://huggingface.co/collections/meta-llama/llama-4-67f0c30d9fe03840bc9d0164">
        HuggingFace
      </a>
      . You can try chatting with the models on{" "}
      <a href="https://www.meta.ai">meta.ai</a>.
    </p>
    <p>
      For hosted Llama 4 API endpoints, you can go to{" "}
      <a href="https://www.groq.com/">Groq</a>.
    </p>
    <h2>Credits</h2>
    <p>
      This blog is based on the{" "}
      <a href="https://ai.meta.com/blog/llama-4-multimodal-intelligence/">
        Llama 4 announcement
      </a>
      .
    </p>
  </div>
);

const slug = title.replace(/\s+/g, "-").replaceAll(":", "").toLowerCase();

const image = cover;

const tags = [
  "Llama",
  "Meta AI",
  "Llama4",
  "LLM",
  "Multimodal AI",
  "Mixture of Experts (MoE)",
  "Attention",
  "Generative AI",
  "Machine Learning",
  "Deep Learning",
];

const date = "2025-04-05";
const readTime = 5;

const Llama4NativelyMultimodalAI = new BaseBlog(
  title,
  content,
  slug,
  image,
  tags,
  date,
  readTime
);

export default Llama4NativelyMultimodalAI;
