import Code from "../../../utils/codeUtils.jsx";
import Expander from "../../../utils/Expander.jsx";
import BaseBlog from "../BaseBlog.js";
import cover from "../../../assets/images/blogs/TensoraxExplained/cover.png";

const title = "Writing CUDA Kernels from Scratch: A Beginner's Guide";

const content = (
  <div style={{ width: "100%" }}>
    <p>
      Ever wondered how PyTorch or TensorFlow make your neural networks run so
      fast on GPUs? In this post, we'll build matrix multiplication kernels from
      scratch, starting naive and slow, then making them fast step by step. By
      the end, you'll understand exactly what makes GPU code fast (or slow).
    </p>
    <p>
      All the code here is from{" "}
      <a
        href="https://github.com/NotShrirang/tensorax"
        target="_blank"
        rel="noreferrer"
      >
        Tensorax
      </a>
      , a tensor library I built to learn these concepts. Feel free to explore
      the full implementation there.
    </p>

    <h2>Why GPUs?</h2>
    <p>
      Your CPU has 8-16 powerful cores. A GPU has thousands of tiny cores. Each
      GPU core is weaker than a CPU core, but when you have 10,000 of them doing
      the same thing to different data? That's where the magic happens.
    </p>
    <p>
      Deep learning is mostly matrix math. Matrix multiplication, adding
      vectors, applying functions to every element. These operations are{" "}
      <b>embarrassingly parallel</b>, each output element can be computed
      independently.
    </p>

    <h2>CUDA Basics: Threads, Blocks, and Grids</h2>
    <p>
      In CUDA, you write a function called a <b>kernel</b> that runs on the GPU.
      But here's the twist: it runs thousands of times in parallel, once per{" "}
      <b>thread</b>.
    </p>
    <p>Threads are organized into:</p>
    <ul>
      <li>
        <b>Blocks</b>: Groups of threads (up to 1024) that can share fast memory
        and synchronize
      </li>
      <li>
        <b>Grid</b>: All the blocks together
      </li>
    </ul>
    <p>
      Each thread knows its position via built-in variables:{" "}
      <code>threadIdx</code>, <code>blockIdx</code>, and <code>blockDim</code>.
    </p>

    <h2>Let's Start Simple: Vector Addition</h2>
    <p>
      Adding two arrays is the "Hello World" of CUDA. We want:{" "}
      <code>C[i] = A[i] + B[i]</code> for every element.
    </p>
    <Code
      language="cpp"
      content={`__global__ void add_kernel(const float* a, const float* b, float* out, int size) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < size) {
        out[idx] = a[idx] + b[idx];
    }
}`}
      expander={false}
      copy={true}
    />
    <p>
      That's it. Each thread computes one addition. With 1 million elements and
      256 threads per block, we launch ~4000 blocks. All running simultaneously.
    </p>

    <h2>The Real Challenge: Matrix Multiplication</h2>
    <p>
      Now let's tackle something harder, matrix multiplication. This is the
      backbone of neural networks. Every linear layer, every attention head uses
      it.
    </p>
    <p>For matrices A (m×k) and B (k×n), each output element C[i,j] is:</p>
    <p style={{ textAlign: "center", fontSize: "1.1rem", margin: "1rem 0" }}>
      <code>
        C[i,j] = A[i,0]*B[0,j] + A[i,1]*B[1,j] + ... + A[i,k-1]*B[k-1,j]
      </code>
    </p>
    <p>
      In simple words: to get one output element, you take a row from A and a
      column from B, multiply them element-by-element, and add everything up.
      That's k multiplications and k-1 additions for each output element.
    </p>

    <h3>Attempt 1: The Naive Approach</h3>
    <p>
      The simplest idea: assign one thread to compute one output element. If our
      output matrix is 1024×1024, we launch about 1 million threads. Each thread
      loops through k values, multiplying and summing.
    </p>
    <p>
      Let's say thread #42 is responsible for computing C[5,7]. It will read the
      entire 5th row of A (that's k values), read the entire 7th column of B
      (another k values), multiply them pair-wise, and sum everything up.
      Simple, right?
    </p>
    <Code
      language="cpp"
      content={`__global__ void matmul_naive(const float* A, const float* B, float* C, 
                               int m, int n, int k) {
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    
    if (row < m && col < n) {
        float sum = 0.0f;
        for (int i = 0; i < k; ++i) {
            sum += A[row * k + i] * B[i * n + col];
        }
        C[row * n + col] = sum;
    }
}`}
      expander={false}
      copy={true}
    />
    <p>This works. But it's slow. Really slow.</p>

    <h3>The Problem: Memory is the Bottleneck</h3>
    <p>
      Here's what's happening: for a 1024×1024 matrix multiply, each output
      element needs to read 1024 values from A and 1024 from B. That's over 2
      trillion memory reads total.
    </p>
    <p>
      GPU global memory has high bandwidth (~900 GB/s on modern GPUs), but also
      high latency (~400 cycles). When every thread is hammering global memory
      independently, things get congested.
    </p>
    <div
      style={{
        borderLeft: "4px solid gray",
        paddingLeft: "10px",
        fontSize: "1.1rem",
        margin: "1rem 0",
      }}
    >
      <i>
        💡 <b>Think about it:</b> Threads computing C[0,0] and C[0,1] both need
        to read the entire first row of A. That's the same data read twice. What
        if 1000 threads all need row 0 of A?
      </i>
    </div>
    <p>Can you think of a way to avoid this redundant memory access?</p>

    <h3>Attempt 2: Shared Memory to the Rescue</h3>
    <p>
      Here's an analogy: imagine you need to look up facts from books to write
      an essay. You could walk to the library (10 km away) every time you need a
      fact. Or, you could bring a few books to your desk and look things up from
      there.
    </p>
    <p>
      The library is <b>global memory</b>, huge but far away. Your desk is{" "}
      <b>shared memory</b>, tiny but right next to you. It's about 100x faster
      to read from shared memory than global memory.
    </p>
    <p>
      The catch? Your desk (shared memory) is small, only about 48KB per block.
      You can't fit the whole matrix there. So we work in <b>tiles</b>: bring a
      small chunk of data to the desk, do all the work we can with it, then
      bring the next chunk.
    </p>
    <p>The strategy:</p>
    <ol>
      <li>
        All threads in a block cooperate to load a "tile" of A and B into shared
        memory
      </li>
      <li>
        Everyone computes their partial results using that fast, local data
      </li>
      <li>Repeat for the next tile until we've processed all of k</li>
    </ol>
    <Code
      language="cpp"
      content={`__global__ void matmul_tiled(const float* A, const float* B, float* C, 
                               int m, int n, int k) {
    const int TILE = 32;
    __shared__ float tileA[TILE][TILE];
    __shared__ float tileB[TILE][TILE];
    
    int row = blockIdx.y * TILE + threadIdx.y;
    int col = blockIdx.x * TILE + threadIdx.x;
    float sum = 0.0f;
    
    // Process tiles one at a time
    for (int t = 0; t < (k + TILE - 1) / TILE; ++t) {
        // Each thread loads ONE element into shared memory
        if (row < m && t * TILE + threadIdx.x < k)
            tileA[threadIdx.y][threadIdx.x] = A[row * k + t * TILE + threadIdx.x];
        else
            tileA[threadIdx.y][threadIdx.x] = 0.0f;
            
        if (col < n && t * TILE + threadIdx.y < k)
            tileB[threadIdx.y][threadIdx.x] = B[(t * TILE + threadIdx.y) * n + col];
        else
            tileB[threadIdx.y][threadIdx.x] = 0.0f;
        
        __syncthreads();  // Wait for everyone to finish loading
        
        // Now compute using fast shared memory
        for (int i = 0; i < TILE; ++i)
            sum += tileA[threadIdx.y][i] * tileB[i][threadIdx.x];
        
        __syncthreads();  // Wait before loading next tile
    }
    
    if (row < m && col < n)
        C[row * n + col] = sum;
}`}
      expander={false}
      copy={true}
    />
    <Expander>
      <p>
        <b>Why does this help?</b>
      </p>
      <p>
        Think about it: in the naive version, if 1024 threads all need row 0 of
        A, that row gets read from global memory 1024 times. What a waste!
      </p>
      <p>
        With tiling, we read row 0 once into shared memory, and all 32 threads
        in that tile read it from there. Instead of 1024 slow global reads, we
        do 1 slow read + 32 fast local reads. That's a 32× reduction in global
        memory traffic!
      </p>
      <p>
        The <code>__syncthreads()</code> calls are like saying "everyone stop
        and wait here." We need this because:
      </p>
      <ul>
        <li>Before computing: make sure everyone finished loading data</li>
        <li>Before loading next tile: make sure everyone finished computing</li>
      </ul>
      <p>
        Without these barriers, some threads might start computing before others
        have loaded their data, giving wrong results!
      </p>
    </Expander>

    <h3>Can We Do Better?</h3>
    <p>
      The tiled version is good, but we're still limited. Each thread computes
      just one output element. What if one thread could compute multiple
      elements?
    </p>
    <div
      style={{
        borderLeft: "4px solid gray",
        paddingLeft: "10px",
        fontSize: "1.1rem",
        margin: "1rem 0",
      }}
    >
      <i>
        💡 <b>Think about it:</b> When computing C[0,0] and C[1,0], both need
        the same column from B. If one thread computes both, it can reuse that
        column data. Where should we store it?
      </i>
    </div>

    <h3>Attempt 3: Register Blocking</h3>
    <p>
      We moved data from the library (global memory) to our desk (shared
      memory). But there's an even faster place: your hands. If you're copying
      numbers from a book, you don't look at each digit separately, you remember
      a few digits at a time in your head.
    </p>
    <p>
      <b>Registers</b> are like your short-term memory. They're the fastest
      storage on the GPU, even faster than shared memory. But each thread only
      gets a small number of them.
    </p>
    <p>
      The key insight: if one thread computes multiple output elements (say, an
      8×8 tile), it can load some values into registers and reuse them many
      times. Instead of one thread doing one output, one thread does 64 outputs
      and reuses data aggressively.
    </p>
    <Code
      language="cpp"
      content={`// Each thread computes a TM×TN tile of output
template<int BM, int BN, int BK, int TM, int TN>
__global__ void matmul_register_blocked(const float* A, const float* B, float* C,
                                        int m, int n, int k) {
    __shared__ float sA[BM * BK];
    __shared__ float sB[BK * BN];
    
    // Each thread's results stored in registers
    float results[TM][TN] = {0.0f};
    float regA[TM];
    float regB[TN];
    
    // ... load tiles into shared memory ...
    
    for (int dot = 0; dot < BK; ++dot) {
        // Load into registers
        for (int i = 0; i < TM; ++i)
            regA[i] = sA[/* thread's row */ * BK + dot];
        for (int i = 0; i < TN; ++i)
            regB[i] = sB[dot * BN + /* thread's col */];
        
        // Compute outer product - maximum register reuse!
        for (int i = 0; i < TM; ++i)
            for (int j = 0; j < TN; ++j)
                results[i][j] += regA[i] * regB[j];
    }
}`}
      expander={false}
      copy={true}
    />
    <p>
      The key trick: if we load 8 values from A (call them regA) and 8 values
      from B (call them regB), we can compute 8×8 = 64 results! Each value in
      regA gets multiplied with all 8 values in regB, and vice versa. That's the
      "outer product" approach, maximum reuse from minimum loads.
    </p>
    <p>To summarize our memory hierarchy journey:</p>
    <ul>
      <li>
        <b>Global memory</b> (Library): Huge, slow. Avoid when possible.
      </li>
      <li>
        <b>Shared memory</b> (Desk): Medium, fast. Share between threads.
      </li>
      <li>
        <b>Registers</b> (Your brain): Tiny, fastest. Reuse within a thread.
      </li>
    </ul>

    <h3>How Fast Did We Get?</h3>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "gray" }}>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
            }}
          >
            Implementation
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
            }}
          >
            Time (100 runs)
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
            }}
          >
            Speedup vs Naive
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            Naive (one element/thread)
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>3.37s</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>1.0×</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            Shared Memory Tiling
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>1.22s</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>2.8×</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            <b>Register Blocking</b>
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>0.95s</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            <b>3.5×</b>
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            PyTorch (cuBLAS)
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>0.41s</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>8.2×</td>
        </tr>
      </tbody>
    </table>
    <p>
      We went from 3.37s to 0.95s, about 3.5× faster. PyTorch (using cuBLAS) is
      still faster because they have years of optimization.
    </p>

    <h2>The Takeaways</h2>
    <p>GPU optimization boils down to a few key principles:</p>
    <ol>
      <li>
        <b>Memory is the bottleneck</b>: Compute is cheap; memory access is
        expensive. Minimize global memory reads.
      </li>
      <li>
        <b>Share data between threads</b>: Use shared memory when multiple
        threads need the same data.
      </li>
      <li>
        <b>More work per thread</b>: Having each thread compute multiple outputs
        means better data reuse.
      </li>
      <li>
        <b>Registers are your friend</b>: Keep frequently used values in
        registers, not shared memory.
      </li>
    </ol>

    <h2>Bonus: Automatic Differentiation</h2>
    <p>
      Fast matrix multiply is great, but neural networks need gradients. When
      you call <code>loss.backward()</code>, how does PyTorch know what
      gradients to compute?
    </p>
    <p>
      The trick is building a <b>computational graph</b> during the forward
      pass. Each operation records its inputs and what operation was performed.
    </p>
    <Code
      language="python"
      content={`# Forward pass builds the graph
x = Tensor([[2.0]], requires_grad=True)
w = Tensor([[3.0]], requires_grad=True)
y = w * x  # Records: y = mul(w, x)

# Backward traverses it in reverse
y.backward()
print(w.grad)  # dy/dw = x = 2
print(x.grad)  # dy/dx = w = 3`}
      expander={false}
      copy={true}
    />
    <p>For matrix multiply specifically, if C = A @ B, the gradients are:</p>
    <ul>
      <li>dL/dA = dL/dC @ B.T</li>
      <li>dL/dB = A.T @ dL/dC</li>
    </ul>
    <p>
      So the backward pass is... just more matrix multiplies! The same optimized
      kernels we wrote work for both forward and backward passes.
    </p>

    <h2>What's Next?</h2>
    <p>If you want to go deeper:</p>
    <ul>
      <li>
        <a
          href="https://siboehm.com/articles/22/CUDA-MMM"
          target="_blank"
          rel="noreferrer"
        >
          Simon Boehm's goated CUDA matmul tutorial
        </a>
      </li>
      <li>
        <a
          href="https://github.com/NotShrirang/tensorax"
          target="_blank"
          rel="noreferrer"
        >
          tensorax source code
        </a>
      </li>
      <li>
        <a
          href="https://leimao.github.io/article/CUDA-Matrix-Multiplication-Optimization/"
          target="_blank"
          rel="noreferrer"
        >
          Lei Mao's detailed exploration of CUDA matmul optimizations
        </a>
      </li>
      <li>
        <a
          href="https://docs.nvidia.com/cuda/cuda-programming-guide/index.html"
          target="_blank"
          rel="noreferrer"
        >
          NVIDIA's official CUDA programming guide
        </a>
      </li>
    </ul>
    <p>
      Try implementing your own kernel! Start with the naive version, verify
      it's correct, then optimize. There's no better way to learn than by doing.
    </p>
  </div>
);

const slug = title.replace(/\s+/g, "-").replaceAll(":", "").toLowerCase();
const image = cover;
const tags = [
  "CUDA",
  "GPU Programming",
  "Matrix Multiplication",
  "Deep Learning",
  "Performance Optimization",
  "C++",
  "High Performance Computing",
];

const date = "2026-01-11";
const readTime = 10;

const TensoraxBlog = new BaseBlog(
  title,
  content,
  slug,
  image,
  tags,
  date,
  readTime
);

export default TensoraxBlog;
