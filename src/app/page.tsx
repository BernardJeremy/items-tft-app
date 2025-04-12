
export default function Home() {
  return (
    <>
      <div className="controls">
          <button>Mode 1 (Guess Components)</button>
          <button>Mode 2 (Guess Completed Item)</button>
      </div>

      <div className="game-container">
          <section id="question-area" className="question-area"></section>
          <section id="answer-area" className="answer-area"></section>
      </div>
    </>
  );
}
