/* ─────────────────────────────────────────────────────────────────────────
   TinyGPT2 in-browser inference engine.

   Loads the ONNX model via onnxruntime-web (WebGPU primary, WASM fallback),
   handles tokenization with js-tiktoken (gpt2 BPE), and runs an autoregressive
   generation loop with KV caching.

   IMPORTANT: When you upload the converted .onnx to HuggingFace, set:
     - MODEL_URL below to the full HF resolve URL
     - IO_NAMES below to match the exact input/output names from your export

   Adjust the IO_NAMES block to match what `onnx.load(...).graph.input/output`
   reports for your converted file. The defaults assume a flat-tensor export
   with the GQA layout (B, T, G, D) from torch.onnx.export.
   ───────────────────────────────────────────────────────────────────────── */

import * as ort from "onnxruntime-web/webgpu";
import { Tiktoken, getEncodingNameForModel } from "js-tiktoken/lite";
import gpt2RankBpe from "js-tiktoken/ranks/gpt2";

/* ──────── Configuration ──────── */

// TinyGPT2 hyperparameters (from src/tinygpt/config.py — TinyGPT2Config)
export const MODEL_CONFIG = {
  vocabSize: 50304,
  blockSize: 512,
  nEmbd: 768,
  nHead: 12,
  nLayer: 12,
  gqaKvHead: 4,
  hiddenSize: 2048,
  headDim: 64, // n_embd / n_head
};

// URL of the converted ONNX. Uses HuggingFace's /resolve/ endpoint which
// streams the raw file with CORS enabled.
export const MODEL_URL =
  "https://huggingface.co/NotShrirang/tinygpt/resolve/main/tinygpt2_web.onnx";

// Approximate model file size for the UI progress display (in MB)
export const MODEL_SIZE_MB = 536;

// Tiktoken's gpt2 vocab covers IDs 0..50256. TinyGPT2's vocab is padded to
// 50304 for GPU alignment; the extra IDs are unused. We mask them at sampling
// time so they're never generated.
export const VALID_VOCAB_SIZE = 50257;

// Input/output names. Adjust to match your ONNX export.
// Run the snippet in the chat instructions to print exact names if unsure.
export const IO_NAMES = {
  // Inputs
  inputIds: "input_ids",
  cos: "cos",
  sin: "sin",
  attnMask: "attn_mask",
  pastKeyTemplate: (i) => `past_key_${i}`,
  pastValueTemplate: (i) => `past_value_${i}`,

  // Outputs
  logits: "logits",
  presentKeyTemplate: (i) => `present_key_${i}`,
  presentValueTemplate: (i) => `present_value_${i}`,
};

/* ──────── ONNX Runtime setup ──────── */

// Tell onnxruntime-web where to fetch its WASM/JSEP artifacts from.
// Using jsDelivr avoids needing to copy them into /public.
ort.env.wasm.wasmPaths =
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
ort.env.wasm.numThreads = navigator.hardwareConcurrency
  ? Math.min(navigator.hardwareConcurrency, 4)
  : 2;
ort.env.logLevel = "warning";

/* ──────── RoPE tables ──────── */

/**
 * Precompute cos/sin tables for rotary positional embedding.
 * Returns two Float32Arrays of shape [seqLen, headDim/2].
 */
function precomputeRopeTables(headDim, seqLen, theta = 10000.0) {
  const half = headDim / 2;
  const invFreq = new Float32Array(half);
  for (let i = 0; i < half; i++) {
    invFreq[i] = 1.0 / Math.pow(theta, (2 * i) / headDim);
  }
  const cos = new Float32Array(seqLen * half);
  const sin = new Float32Array(seqLen * half);
  for (let t = 0; t < seqLen; t++) {
    for (let i = 0; i < half; i++) {
      const angle = t * invFreq[i];
      cos[t * half + i] = Math.cos(angle);
      sin[t * half + i] = Math.sin(angle);
    }
  }
  return { cos, sin };
}

/* ──────── Tokenizer ──────── */

let tokenizer = null;

function getTokenizer() {
  if (tokenizer) return tokenizer;
  // js-tiktoken gpt2 encoding — same BPE merges as Python `tiktoken.get_encoding("gpt2")`.
  // Special tokens like <|endoftext|> = 50256 are handled.
  tokenizer = new Tiktoken(gpt2RankBpe);
  return tokenizer;
}

export function encode(text) {
  return getTokenizer().encode(text);
}

export function decode(ids) {
  return getTokenizer().decode(ids);
}

/* ──────── Sampling ──────── */

/**
 * Sample a token from a logits row using top-k + temperature.
 * Mutates the logits array in-place.
 */
function sampleTopK(logits, { temperature = 0.8, topK = 40 } = {}) {
  // Mask out the padding tokens beyond the actual vocab.
  for (let i = VALID_VOCAB_SIZE; i < logits.length; i++) {
    logits[i] = -Infinity;
  }

  // Apply temperature.
  if (temperature !== 1.0) {
    const invT = 1.0 / Math.max(temperature, 1e-6);
    for (let i = 0; i < logits.length; i++) logits[i] *= invT;
  }

  // Top-K filter.
  if (topK && topK < logits.length) {
    const indexed = new Array(logits.length);
    for (let i = 0; i < logits.length; i++) indexed[i] = i;
    indexed.sort((a, b) => logits[b] - logits[a]);
    const threshold = logits[indexed[topK - 1]];
    for (let i = 0; i < logits.length; i++) {
      if (logits[i] < threshold) logits[i] = -Infinity;
    }
  }

  // Softmax (numerically stable).
  let maxLogit = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxLogit) maxLogit = logits[i];
  }
  let sumExp = 0;
  const probs = new Float32Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] === -Infinity) {
      probs[i] = 0;
    } else {
      probs[i] = Math.exp(logits[i] - maxLogit);
      sumExp += probs[i];
    }
  }

  // Multinomial sample.
  const r = Math.random() * sumExp;
  let cum = 0;
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i];
    if (cum >= r) return i;
  }
  // Fallback (numerical edge case)
  return probs.length - 1;
}

/* ──────── Causal attention mask ──────── */

function buildAttnMask(seqNew, seqPast) {
  // additive mask: 0 for visible positions, -INF for masked positions.
  // shape: [1, 1, seqNew, seqPast + seqNew]
  const seqTotal = seqPast + seqNew;
  const data = new Float32Array(1 * 1 * seqNew * seqTotal);
  for (let i = 0; i < seqNew; i++) {
    for (let j = 0; j < seqTotal; j++) {
      // Query position i (which corresponds to absolute pos seqPast+i)
      // can attend to all keys up to seqPast+i (inclusive).
      data[i * seqTotal + j] = j <= seqPast + i ? 0 : -1e4;
    }
  }
  return new ort.Tensor("float32", data, [1, 1, seqNew, seqTotal]);
}

/* ──────── Model loading ──────── */

let sessionCache = null;
let backendCache = null;

export async function detectBackend() {
  if (typeof navigator === "undefined") {
    console.warn("[tinygpt] no navigator (SSR?). Using WASM.");
    return "wasm";
  }
  if (!navigator.gpu) {
    console.warn(
      "[tinygpt] navigator.gpu is undefined — WebGPU not exposed by this browser. " +
        "On Chrome, check chrome://flags/#enable-unsafe-webgpu and chrome://gpu/."
    );
    return "wasm";
  }
  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: "high-performance",
    });
    if (!adapter) {
      console.warn(
        "[tinygpt] navigator.gpu.requestAdapter() returned null. " +
          "No compatible GPU adapter — check chrome://gpu/ for WebGPU status."
      );
      return "wasm";
    }
    const info = await adapter.requestAdapterInfo?.();
    console.info(
      "[tinygpt] WebGPU adapter acquired:",
      info ? `${info.vendor || ""} ${info.architecture || ""} ${info.device || ""}`.trim() : "(no adapter info)"
    );
    return "webgpu";
  } catch (e) {
    console.warn("[tinygpt] WebGPU adapter request threw:", e);
    return "wasm";
  }
}

/* ──────── Instruction-tuned prompt formatting ──────── */

/**
 * Wrap a raw instruction in the Alpaca template TinyGPT2 was fine-tuned on.
 * Mirrors `format_prompt` in tinygpt/inference.py.
 */
export function formatInstructionPrompt(instruction, { system = "" } = {}) {
  const parts = [];
  if (system && system.trim()) parts.push(`### System:\n${system}`);
  parts.push(`### Instruction:\n${instruction}`);
  parts.push("### Response:\n");
  return parts.join("\n\n");
}

/**
 * Build a multi-turn chat prompt — alternating Instruction/Response blocks
 * for each message in `history`, then a trailing Instruction for the new
 * question, then an empty Response: for the model to continue from.
 * Mirrors `format_chat_prompt` in tinygpt/inference.py.
 *
 * `history` is an array of `{ role, text }` where role is "user" or "model".
 * `currentUser` is the new question to append.
 */
export function formatChatPrompt(history, currentUser, { system = "" } = {}) {
  const parts = [];
  if (system && system.trim()) parts.push(`### System:\n${system}`);
  for (const m of history) {
    if (m.role === "user") parts.push(`### Instruction:\n${m.text}`);
    else parts.push(`### Response:\n${m.text}`);
  }
  parts.push(`### Instruction:\n${currentUser}`);
  parts.push("### Response:\n");
  return parts.join("\n\n");
}

/**
 * Build a chat prompt that fits in the model's context window, automatically
 * dropping the oldest turns if the full history would exceed budget.
 * Returns { prompt, droppedTurns } so the caller can inform the user.
 */
export function fitChatPromptToBudget(
  history,
  currentUser,
  { system = "", reserveForResponse = 140 } = {}
) {
  const budget = MODEL_CONFIG.blockSize - reserveForResponse;
  const tok = getTokenizer();
  let trimmed = history.slice();

  while (true) {
    const prompt = formatChatPrompt(trimmed, currentUser, { system });
    const tokenCount = tok.encode(prompt).length;
    if (tokenCount <= budget) {
      return {
        prompt,
        tokenCount,
        droppedTurns: history.length - trimmed.length,
      };
    }
    if (trimmed.length === 0) {
      // Even the bare current question is too long — return anyway so
      // the caller surfaces a clean "Prompt too long" error downstream.
      return {
        prompt,
        tokenCount,
        droppedTurns: history.length,
        overflow: true,
      };
    }
    // Drop the oldest user+model pair (or single message if history is uneven).
    trimmed = trimmed.slice(trimmed[0].role === "user" ? 2 : 1);
  }
}

// Default stop strings for an instruction-tuned model — same as what the
// CLI inference script trims on.
export const DEFAULT_STOP_STRINGS = [
  "<|endoftext|>",
  "### Instruction:",
  "### Response:",
];

/**
 * Load the ONNX model. Calls onProgress with {loaded, total} during download.
 * Returns the ort.InferenceSession.
 */
export async function loadModel({ onProgress } = {}) {
  if (sessionCache) return { session: sessionCache, backend: backendCache };

  const backend = await detectBackend();
  backendCache = backend;

  // Stream-download the ONNX so we can report progress.
  const res = await fetch(MODEL_URL);
  if (!res.ok) throw new Error(`Model fetch failed: ${res.status}`);
  const total = Number(res.headers.get("content-length")) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let loaded = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    if (onProgress) onProgress({ loaded, total });
  }
  const buffer = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  // Build the session.
  const session = await ort.InferenceSession.create(buffer.buffer, {
    executionProviders: [backend, "wasm"],
    graphOptimizationLevel: "all",
  });

  sessionCache = session;
  return { session, backend };
}

/* ──────── Generation loop ──────── */

/**
 * Generate up to `maxNewTokens` from a prompt. Calls `onToken` for each new
 * token with { id, text, idx, ms } so the UI can stream.
 *
 * Returns final { fullText, tokenCount, totalMs, tokensPerSec }.
 *
 * `abortSignal` is a function returning true to stop generation early.
 */
export async function generate({
  prompt,
  maxNewTokens = 80,
  temperature = 0.8,
  topK = 40,
  stopStrings = [],
  onToken,
  abortSignal,
}) {
  const { session } = await loadModel();

  // Tokenize the prompt.
  const tok = getTokenizer();
  const promptIds = tok.encode(prompt);
  if (promptIds.length === 0) {
    throw new Error("Empty prompt after tokenization.");
  }
  if (promptIds.length > MODEL_CONFIG.blockSize - 1) {
    throw new Error(
      `Prompt too long (${promptIds.length} tokens, max ${MODEL_CONFIG.blockSize - 1}).`
    );
  }

  const { nLayer, gqaKvHead: G, headDim: D } = MODEL_CONFIG;
  const fullSeqLen = MODEL_CONFIG.blockSize;

  // Precompute RoPE cos/sin for the maximum possible length.
  const ropeTables = precomputeRopeTables(D, fullSeqLen);

  // Initialize empty KV caches.
  const emptyKv = () =>
    new ort.Tensor("float32", new Float32Array(0), [1, 0, G, D]);
  let pastK = Array.from({ length: nLayer }, emptyKv);
  let pastV = Array.from({ length: nLayer }, emptyKv);

  const start = performance.now();
  const collectedIds = [];

  // ── Prefill: feed the entire prompt at once ──
  const prefillIds = BigInt64Array.from(promptIds.map((x) => BigInt(x)));
  const prefillInput = {
    [IO_NAMES.inputIds]: new ort.Tensor("int64", prefillIds, [
      1,
      promptIds.length,
    ]),
    [IO_NAMES.cos]: ropeTables_slice(ropeTables.cos, 0, promptIds.length, D / 2),
    [IO_NAMES.sin]: ropeTables_slice(ropeTables.sin, 0, promptIds.length, D / 2),
    [IO_NAMES.attnMask]: buildAttnMask(promptIds.length, 0),
  };
  for (let i = 0; i < nLayer; i++) {
    prefillInput[IO_NAMES.pastKeyTemplate(i)] = pastK[i];
    prefillInput[IO_NAMES.pastValueTemplate(i)] = pastV[i];
  }

  let outputs = await session.run(prefillInput);
  let posOffset = promptIds.length;

  // Extract present_kv tensors as the new past for the next iteration.
  for (let i = 0; i < nLayer; i++) {
    pastK[i] = outputs[IO_NAMES.presentKeyTemplate(i)];
    pastV[i] = outputs[IO_NAMES.presentValueTemplate(i)];
  }

  // Sample first new token from the prompt's last position.
  const logits = outputs[IO_NAMES.logits];
  const vocab = MODEL_CONFIG.vocabSize;
  const lastLogits = new Float32Array(
    logits.data.buffer,
    logits.data.byteOffset + (promptIds.length - 1) * vocab * 4,
    vocab
  ).slice();
  let nextId = sampleTopK(lastLogits, { temperature, topK });
  collectedIds.push(nextId);

  // Streaming accumulator — we decode the whole sequence each step so the
  // BPE re-tokenizer doesn't desync on multi-byte glyphs.
  let accumulatedText = tok.decode(collectedIds);
  let lastEmittedText = "";

  // Stop-string detection. Returns the trim-index if any full stop string is
  // present in the text, else -1.
  const findStop = (text) => {
    for (const s of stopStrings) {
      const idx = text.indexOf(s);
      if (idx !== -1) return idx;
    }
    return -1;
  };

  // Longest stop string — we hold back the tail of `accumulatedText` until
  // we're sure it doesn't begin a stop string. Without this, partial stop
  // sequences like "<|endoftext" would already be on screen by the time the
  // ">" arrives and lets us match the full string.
  const maxStopLen = stopStrings.length
    ? Math.max(...stopStrings.map((s) => s.length))
    : 0;

  const emittableUpTo = (text, stopped) => {
    if (stopped || maxStopLen === 0) return text.length;
    return Math.max(0, text.length - (maxStopLen - 1));
  };

  let stopIdx = findStop(accumulatedText);
  let stoppedEarly = stopIdx !== -1;
  if (stoppedEarly) accumulatedText = accumulatedText.slice(0, stopIdx);

  if (onToken) {
    const safeEnd = emittableUpTo(accumulatedText, stoppedEarly);
    const delta = accumulatedText.slice(lastEmittedText.length, safeEnd);
    if (delta) {
      onToken({
        id: nextId,
        text: delta,
        idx: 0,
        ms: performance.now() - start,
      });
      lastEmittedText = accumulatedText.slice(0, safeEnd);
      await yieldToBrowser();
    }
  }

  // ── Decode: one token at a time ──
  for (let step = 1; step < maxNewTokens; step++) {
    if (abortSignal && abortSignal()) break;
    if (nextId === 50256) break; // <|endoftext|>
    if (posOffset >= fullSeqLen - 1) break;
    if (stoppedEarly) break;

    const decodeInput = {
      [IO_NAMES.inputIds]: new ort.Tensor(
        "int64",
        BigInt64Array.from([BigInt(nextId)]),
        [1, 1]
      ),
      [IO_NAMES.cos]: ropeTables_slice(ropeTables.cos, posOffset, 1, D / 2),
      [IO_NAMES.sin]: ropeTables_slice(ropeTables.sin, posOffset, 1, D / 2),
      [IO_NAMES.attnMask]: buildAttnMask(1, posOffset),
    };
    for (let i = 0; i < nLayer; i++) {
      decodeInput[IO_NAMES.pastKeyTemplate(i)] = pastK[i];
      decodeInput[IO_NAMES.pastValueTemplate(i)] = pastV[i];
    }

    outputs = await session.run(decodeInput);
    posOffset += 1;

    for (let i = 0; i < nLayer; i++) {
      pastK[i] = outputs[IO_NAMES.presentKeyTemplate(i)];
      pastV[i] = outputs[IO_NAMES.presentValueTemplate(i)];
    }

    const stepLogits = new Float32Array(
      outputs[IO_NAMES.logits].data.buffer,
      outputs[IO_NAMES.logits].data.byteOffset,
      vocab
    ).slice();
    nextId = sampleTopK(stepLogits, { temperature, topK });
    collectedIds.push(nextId);

    accumulatedText = tok.decode(collectedIds);

    stopIdx = findStop(accumulatedText);
    if (stopIdx !== -1) {
      stoppedEarly = true;
      accumulatedText = accumulatedText.slice(0, stopIdx);
    }

    if (onToken) {
      const safeEnd = emittableUpTo(accumulatedText, stoppedEarly);
      const delta = accumulatedText.slice(lastEmittedText.length, safeEnd);
      if (delta) {
        onToken({
          id: nextId,
          text: delta,
          idx: step,
          ms: performance.now() - start,
        });
        lastEmittedText = accumulatedText.slice(0, safeEnd);
        await yieldToBrowser();
      }
    }
  }

  // After the loop ends (EOS, stop, abort, or max tokens), flush whatever
  // tail we were holding back so the UI catches up to the full final answer.
  if (onToken && lastEmittedText.length < accumulatedText.length) {
    const delta = accumulatedText.slice(lastEmittedText.length);
    onToken({
      id: nextId,
      text: delta,
      idx: -1,
      ms: performance.now() - start,
    });
    lastEmittedText = accumulatedText;
  }

  const totalMs = performance.now() - start;
  const tokensPerSec = collectedIds.length / (totalMs / 1000);

  return {
    fullText: accumulatedText,
    tokenCount: collectedIds.length,
    totalMs,
    tokensPerSec,
  };
}

/* ──────── Helpers ──────── */

/**
 * Yield control to the browser so React can flush the DOM update and the
 * browser can paint before the next forward pass starts. Without this, the
 * `await session.run(...)` cycle hogs the main thread and tokens appear in
 * one batch only when generation completes.
 */
function yieldToBrowser() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 0);
    }
  });
}

function ropeTables_slice(flatTable, start, count, half) {
  // flatTable: Float32Array of [maxSeq, half]
  // Return an ort.Tensor of shape [count, half].
  const data = new Float32Array(count * half);
  data.set(flatTable.subarray(start * half, (start + count) * half));
  return new ort.Tensor("float32", data, [count, half]);
}

/**
 * Format the backend label for display.
 */
export function backendLabel(backend) {
  if (backend === "webgpu") return "WebGPU";
  if (backend === "wasm") return "WASM (CPU)";
  return backend;
}
