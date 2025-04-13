import React, { useState, useEffect } from "react";
import { ArrowUp, Info } from "lucide-react";
import styles from "./Diagram.module.css";

const NeuralNetworkDiagram = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const componentDescriptions = {
    embedding:
      "Converts discrete input tokens into dense vector representations of fixed dimensionality, capturing semantic relationships between tokens",
    groupedQueryAttention:
      "Enables the model to dynamically focus on relevant parts of the input sequence by computing attention scores between all tokens, while KV cache stores previously computed key-value pairs to improve inference efficiency",
    rmsNorm1:
      "Root Mean Square Normalization that stabilizes training by normalizing layer inputs without the need for bias terms, applied before self-attention",
    rmsNorm2:
      "Secondary RMS normalization applied after the self-attention block and residual connection to maintain stable activations",
    feedForward:
      "Multi-layer perceptron with SwiGLU activation (a variant of GLU with swish activation) that transforms representations individually for each token position, increasing model capacity",
    rmsNorm3:
      "Final normalization layer that ensures stable outputs before the projection layer",
    linear:
      "Linear projection layer that maps the hidden representation to logits over the vocabulary space",
    softmax:
      "Normalizes the logits into a probability distribution over the vocabulary, with the highest probabilities corresponding to the most likely next tokens",
    rope: "Rotary Positional Embedding (RoPE) encodes absolute positional information via rotation matrices, allowing the model to understand token positions while maintaining translation invariance. It efficiently captures relative positions between tokens, enhancing the model's ability to understand sequence ordering.",
  };

  const handleNodeClick = (node) => {
    setActiveNode(activeNode === node ? null : node);
  };

  const renderTooltip = (node) => {
    if (activeNode !== node) return null;

    return (
      <div className={styles.tooltip} style={{ zIndex: 1000 }}>
        {componentDescriptions[node]}
      </div>
    );
  };

  const NodeBox = ({
    id,
    label,
    onClick,
    extraClass = "",
    animationDelay = 0,
  }) => (
    <div
      className={`${styles.nodeBox} ${extraClass} ${
        activeNode === id ? styles.active : ""
      }`}
      onClick={() => onClick(id)}
      style={{
        animationDelay: `${animationDelay}s`,
        transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${animationDelay}s`,
      }}
    >
      {label}
      {renderTooltip(id)}
      <span className={styles.infoIcon}>
        <Info size={16} />
      </span>
    </div>
  );

  const ArrowConnection = ({ animationDelay = 0 }) => (
    <div
      className={styles.arrowConnection}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <ArrowUp className="text-blue-500" />
    </div>
  );

  const PlusCircle = ({ animationDelay = 0 }) => (
    <div
      className={styles.plusCircle}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className={styles.plusCircleInner}>+</div>
    </div>
  );

  const RotaryPositionalEmbedding = () => (
    <div className={styles.nodeBox} onClick={() => handleNodeClick("rope")}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <div
          style={{
            marginTop: "0.25rem",
            fontSize: "2rem",
            border: "1px solid",
            borderRadius: "50%",
            width: "2rem",
            height: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          ~
        </div>
        <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
          Rotary
          <br />
          Positional
          <br />
          Embedding
        </div>
      </div>
      <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
        {renderTooltip("rope")}
        <span className={styles.infoIcon}>
          <Info size={16} />
        </span>
      </div>
    </div>
  );

  return (
    <div
      className={`${styles.container} ${
        isVisible ? styles["diagram-appear"] : ""
      }`}
    >
      <div className={styles.title}>Llama 2 Architecture</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          width: "100%",
        }}
      >
        <div className={styles.flexColumn}>
          <NodeBox
            id="softmax"
            label="Softmax"
            onClick={handleNodeClick}
            animationDelay={0.1}
          />
          <ArrowConnection animationDelay={0.15} />
          <NodeBox
            id="linear"
            label="Linear"
            onClick={handleNodeClick}
            animationDelay={0.2}
          />
          <ArrowConnection animationDelay={0.25} />
          <NodeBox
            id="rmsNorm3"
            label="RMS Norm"
            onClick={handleNodeClick}
            animationDelay={0.3}
          />
          <ArrowConnection animationDelay={0.35} />
          <div className={styles.repeatingBlock}>
            <div className={styles.blockLabel}>× N</div>
            <div className={styles.flexColumn}>
              <PlusCircle animationDelay={0.4} />
              <ArrowConnection animationDelay={0.45} />
              <NodeBox
                id="feedForward"
                label="Feed Forward SwiGLU"
                onClick={handleNodeClick}
                animationDelay={0.45}
              />
              <ArrowConnection animationDelay={0.5} />
              <NodeBox
                id="rmsNorm2"
                label="RMS Norm"
                onClick={handleNodeClick}
                animationDelay={0.55}
              />
              <ArrowConnection animationDelay={0.6} />
              <PlusCircle animationDelay={0.65} />
              <div
                className={styles.flexColumn}
                style={{ position: "relative" }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <NodeBox
                      id="groupedQueryAttention"
                      label={
                        <div>
                          Grouped Query Attention with KV Cache
                          <br />
                        </div>
                      }
                      onClick={handleNodeClick}
                      extraClass="w-64"
                      animationDelay={0.7}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        Q
                        <div
                          style={{
                            margin: "0.25rem",
                            fontSize: "2rem",
                            border: "1px solid",
                            borderRadius: "50%",
                            width: "2rem",
                            height: "2rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                          }}
                        >
                          ~
                        </div>
                        <ArrowConnection animationDelay={0.7} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        K
                        <div
                          style={{
                            margin: "0.25rem",
                            fontSize: "2rem",
                            border: "1px solid",
                            borderRadius: "50%",
                            width: "2rem",
                            height: "2rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                          }}
                        >
                          ~
                        </div>
                        <ArrowConnection animationDelay={0.7} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        V
                        <ArrowConnection animationDelay={0.7} />
                      </div>
                    </div>
                    <NodeBox id="projection" label="Projection" />
                  </div>
                </div>
                <ArrowConnection animationDelay={0.75} />
                <NodeBox
                  id="rmsNorm1"
                  label="RMS Norm"
                  onClick={handleNodeClick}
                  animationDelay={0.8}
                />
              </div>
            </div>
          </div>
          <ArrowConnection animationDelay={0.85} />
          <NodeBox
            id="embedding"
            label="Embedding"
            onClick={handleNodeClick}
            extraClass={styles.pulse}
            animationDelay={0.9}
          />
        </div>
        <div style={{ marginTop: "50%" }}>
          <RotaryPositionalEmbedding />
        </div>
      </div>
      <div className={styles.instruction}>
        Click on any component to learn about its function in the transformer
        architecture
      </div>
    </div>
  );
};

export default NeuralNetworkDiagram;
