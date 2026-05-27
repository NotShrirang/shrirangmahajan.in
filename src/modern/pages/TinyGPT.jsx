import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./TinyGPT.module.css";
import LiveDemo from "../components/LiveDemo";

const SPECS = [
  ["Parameters", "95M"],
  ["Layers", "12"],
  ["Hidden dim", "768"],
  ["FFN dim", "2048"],
  ["Query heads", "12"],
  ["KV heads", "4  (GQA, ratio 3)"],
  ["Head dim", "64"],
  ["Context", "512 tokens"],
  ["Vocab", "50 304  (tiktoken gpt2)"],
  ["Position", "Rotary (RoPE, θ = 10 000)"],
  ["Normalization", "RMSNorm  (ε = 1e-6)"],
  ["Activation", "GELU"],
  ["Weight tying", "lm_head ↔ token_embedding"],
];

const LINKS = [
  {
    label: "GitHub  ·  source code",
    href: "https://github.com/NotShrirang/tinygpt",
  },
  {
    label: "HuggingFace  ·  model weights",
    href: "https://huggingface.co/NotShrirang/tinygpt",
  },
  {
    label: "Streamlit demo  ·  also hosted",
    href: "https://tinygpt.streamlit.app/",
  },
  {
    label: "Blog  ·  Pre-training a 95M LLM on a consumer GPU",
    href: "/blogs/pretraining-95m-llm-consumer-gpu",
  },
];

export default function TinyGPT() {
  useEffect(() => {
    document.title = "TinyGPT — A 95M LLM trained from scratch";
  }, []);

  return (
    <article className={styles.article}>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.heroKicker}>
            <span className={styles.kickerDot} />
            <span>An LLM I trained from scratch</span>
          </div>
          <h1 className={styles.heroTitle}>
            TinyGPT<sup className={styles.heroStar}>*</sup>
          </h1>
          <p className={styles.heroLede}>
            A <strong>95M-parameter</strong> language model — pretrained
            from scratch on a single <strong>RTX 3070 Ti (8 GB VRAM)</strong>,
            instruction-tuned on Stanford Alpaca, and ONNX-converted so it
            runs <em>locally in your browser</em>.
          </p>
          <p className={styles.heroFoot}>
            <span className={styles.heroStarInline}>*</span> small enough to
            fit on a consumer GPU; large enough to write a real sentence.
          </p>
        </div>

        {/* Desktop-only code preview card — shows the model in 6 lines of
            Python. Visually echoes the dark terminal of the live demo. */}
        <aside className={styles.heroSide} aria-hidden="true">
          <div className={styles.codeCard}>
            <div className={styles.codeCardChrome}>
              <span className={styles.codeDot} />
              <span className={styles.codeDot} />
              <span className={styles.codeDot} />
              <span className={styles.codeFile}>example.py</span>
            </div>
            <pre className={styles.codeBlock}>
              <span className={styles.codeLine}>
                <span className={styles.kw}>from</span>{" "}
                <span className={styles.mod}>tinygpt</span>{" "}
                <span className={styles.kw}>import</span>{" "}
                <span className={styles.cls}>TinyGPT2</span>
              </span>
              {"\n\n"}
              <span className={styles.codeLine}>
                model{" "}
                <span className={styles.op}>=</span>{" "}
                <span className={styles.cls}>TinyGPT2</span>
                <span className={styles.op}>.</span>
                <span className={styles.fn}>from_pretrained</span>(
              </span>
              {"\n    "}
              <span className={styles.str}>
                "tinygpt2_ckpt.pth"
              </span>
              {"\n)"}
              {"\n\n"}
              <span className={styles.codeLine}>
                <span className={styles.fn}>print</span>(
                model<span className={styles.op}>.</span>
                <span className={styles.fn}>generate</span>(
              </span>
              {"\n    "}
              <span className={styles.str}>"What is attention?"</span>
              {","}
              {"\n    "}
              <span className={styles.arg}>max_new_tokens</span>
              <span className={styles.op}>=</span>
              <span className={styles.num}>40</span>
              {",\n))"}
              {"\n\n"}
              <span className={styles.cm}># 95 308 544 params · all yours</span>
              <span className={styles.cursor} aria-hidden="true" />
            </pre>
          </div>
          <div className={styles.heroSideFooter}>
            <span className={styles.heroSideDot} />
            <a
              href="https://github.com/NotShrirang/tinygpt"
              target="_blank"
              rel="noreferrer noopener"
              className={styles.heroSideLink}
            >
              github.com/NotShrirang/tinygpt
            </a>
          </div>
        </aside>
      </header>

      {/* ─────────────────────────── LIVE DEMO ─────────────────────────── */}
      <section className={styles.section} id="demo">
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>01</span>
            <span className={styles.sectionLabelText}>Try it</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Run it <em>right now</em>, in this tab.
          </h2>
          <p className={styles.sectionLede}>
            Click to download the ONNX weights (~95 MB, cached on first
            load). Inference runs entirely on your device via WebGPU, with
            WASM fallback if your browser doesn't have one. Nothing about
            your prompts leaves the page.
          </p>
        </div>
        <LiveDemo />
      </section>

      {/* ─────────────────────────── SPECS ─────────────────────────── */}
      <section className={styles.section} id="specs">
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>02</span>
            <span className={styles.sectionLabelText}>Architecture</span>
          </div>
          <h2 className={styles.sectionTitle}>
            A modern decoder-only transformer, <em>shrunk down.</em>
          </h2>
          <p className={styles.sectionLede}>
            Same building blocks as Llama / Mistral — Grouped-Query
            Attention, Rotary positions, RMSNorm — with weight tying
            between the embedding and the LM head to keep the parameter
            count honest.
          </p>
        </div>
        <dl className={styles.specs}>
          {SPECS.map(([k, v]) => (
            <div className={styles.specRow} key={k}>
              <dt className={styles.specKey}>{k}</dt>
              <dd className={styles.specVal}>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─────────────────────────── TRAINING ─────────────────────────── */}
      <section className={styles.section} id="training">
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>03</span>
            <span className={styles.sectionLabelText}>Pretraining</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Fitting a 95M model into 8 GB of VRAM.
          </h2>
        </div>
        <div className={styles.prose}>
          <p>
            The whole point of TinyGPT was the constraint. 95M parameters
            in float32 is{" "}
            <strong>380 MB just for the weights</strong> — before you
            account for gradients, optimizer state, activations, and the
            KV cache. On an 8 GB consumer GPU, naive training OOMs in
            seconds.
          </p>
          <p>The tricks that made it fit:</p>
          <ul>
            <li>
              <strong>Mixed-precision (AMP)</strong> — forward pass in
              float16, master weights in float32, dynamic loss scaling.
              Cuts activation memory roughly in half.
            </li>
            <li>
              <strong>Gradient accumulation</strong> — micro-batches that
              fit, accumulated to a sane effective batch size before the
              optimizer step.
            </li>
            <li>
              <strong>Fused linear + cross-entropy</strong> via the
              Liger Triton kernel — skips materializing the
              (seq × vocab) logits tensor during the loss, which is
              otherwise the single biggest activation in the graph.
            </li>
            <li>
              <strong>Gradient checkpointing</strong> on the transformer
              blocks — recompute activations on the backward pass instead
              of storing them.
            </li>
          </ul>
        </div>
      </section>

      {/* ────────────────────── INSTRUCTION TUNING ────────────────────── */}
      <section className={styles.section} id="sft">
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>04</span>
            <span className={styles.sectionLabelText}>Instruction tuning</span>
          </div>
          <h2 className={styles.sectionTitle}>
            <em>Stanford Alpaca</em>, response-only loss.
          </h2>
        </div>
        <div className={styles.prose}>
          <p>
            After pretraining, the base model was fine-tuned on the{" "}
            <strong>52K-instruction Stanford Alpaca dataset</strong> using
            a standard SFT loop with a critical detail:{" "}
            <strong>response-only loss masking</strong> — the model is
            only penalized for its predictions after the{" "}
            <code>### Response:</code> marker, not for parroting the
            instruction back.
          </p>
          <p className={styles.codeBlock}>
            <code>
              ### Instruction:
              <br />
              {`{user prompt}`}
              <br />
              <br />
              ### Response:
              <br />
              {`{model continues here}`}
            </code>
          </p>
          <p>
            This same template is used in the browser demo — your input
            gets wrapped before tokenization, and generation stops when
            the model emits <code>### Instruction:</code>,{" "}
            <code>### Response:</code>, or <code>&lt;|endoftext|&gt;</code>.
          </p>
        </div>
      </section>

      {/* ────────────────────── BROWSER INFERENCE ────────────────────── */}
      <section className={styles.section} id="onnx">
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>05</span>
            <span className={styles.sectionLabelText}>Browser inference</span>
          </div>
          <h2 className={styles.sectionTitle}>
            PyTorch checkpoint to ONNX to WebGPU.
          </h2>
        </div>
        <div className={styles.prose}>
          <p>
            Browsers can't load <code>.pth</code> directly — pickle is a
            code-execution format, no browser has a Python interpreter,
            and even if they did the model code is needed too. So the
            checkpoint is exported once, offline, to ONNX with three
            specific changes that make a Llama-style architecture
            web-friendly:
          </p>
          <ul>
            <li>
              <strong>RoPE rewritten in real arithmetic.</strong> The
              original uses <code>torch.view_as_complex</code> — ONNX has
              no complex tensor type. Replaced with cos/sin tables passed
              as inputs, mathematically identical.
            </li>
            <li>
              <strong>KV cache externalized as flat tensors.</strong> The
              PyTorch forward returns a list of <code>(K, V)</code>{" "}
              tuples; ONNX wants a flat signature. 24 paired tensors
              (12 layers × 2) go in, 24 come out.
            </li>
            <li>
              <strong>Causal mask as an explicit input,</strong> not
              SDPA's <code>is_causal=True</code> flag. Lets one graph
              handle both the prefill (multi-token) and decode (single
              token + KV cache) phases.
            </li>
          </ul>
          <p>
            The resulting ONNX runs on{" "}
            <a
              href="https://onnxruntime.ai/docs/tutorials/web/"
              target="_blank"
              rel="noreferrer noopener"
            >
              onnxruntime-web
            </a>
            . WebGPU is the primary execution provider; WASM (CPU)
            handles fallback. Tokenization on the browser side uses{" "}
            <code>js-tiktoken</code> with the same <code>gpt2</code>{" "}
            encoding the model was trained on.
          </p>
        </div>
      </section>

      {/* ─────────────────────────── LINKS ─────────────────────────── */}
      <section className={styles.section} id="links">
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionNum}>06</span>
            <span className={styles.sectionLabelText}>Where it lives</span>
          </div>
          <h2 className={styles.sectionTitle}>
            All <em>open source.</em>
          </h2>
        </div>
        <ul className={styles.linkList}>
          {LINKS.map((l) => {
            const internal = l.href.startsWith("/");
            const props = internal
              ? { to: l.href, as: Link }
              : { href: l.href, target: "_blank", rel: "noreferrer noopener" };
            const Tag = internal ? Link : "a";
            return (
              <li key={l.href}>
                <Tag {...props} className={styles.linkRow}>
                  <span className={styles.linkLabel}>{l.label}</span>
                  <span className={styles.linkArrow} aria-hidden="true">
                    {internal ? "→" : "↗"}
                  </span>
                </Tag>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─────────────────────────── CLOSING ─────────────────────────── */}
      <footer className={styles.closing}>
        <p className={styles.closingPara}>
          Back to{" "}
          <Link to="/" className={styles.closingLink}>
            the rest of the site
          </Link>
          .
        </p>
      </footer>
    </article>
  );
}
