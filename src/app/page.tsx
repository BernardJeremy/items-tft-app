"use client";

import { useState, useEffect } from 'react';
import { itemsData } from './itemsData';
import Image from 'next/image';

// Type definitions
type Item = {
  id: string;
  label: string;
  src?: string;
  image?: string;
};

type QuestionType = {
  item?: Item;
  components?: Item[];
  resultItem?: Item;
};

export default function Home() {
  // Game states
  const [gameMode, setGameMode] = useState<number>(1); // 1: Guess Components, 2: Guess Complete Item
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Item[]>([]);
  const [result, setResult] = useState<boolean | null>(null); // null: no result, true: correct, false: incorrect
  const [correctAnswer, setCorrectAnswer] = useState<Item | Item[] | null>(null);

  // Generate a new question based on the current game mode
  const generateQuestion = () => {
    if (gameMode === 1) {
      // Mode 1: Show complete item, guess components
      const randomItem = itemsData.complete[Math.floor(Math.random() * itemsData.complete.length)];
      
      // Find components for this item
      const components: Item[] = [];
      for (const combo in itemsData.combos) {
        if (Object.prototype.hasOwnProperty.call(itemsData.combos, combo)) {
          const comboKey = combo as keyof typeof itemsData.combos;
          if (itemsData.combos[comboKey] === randomItem.id) {
            const [comp1, comp2] = combo.split('+');
            const component1 = itemsData.components.find(c => c.id === comp1);
            const component2 = itemsData.components.find(c => c.id === comp2);
            if (component1 && component2) {
              components.push(component1, component2);
              break;
            }
          }
        }
      }
      
      setCurrentQuestion({
        item: randomItem,
        components
      });
      setCorrectAnswer(components);
      
    } else {
      // Mode 2: Show components, guess complete item
      // Pick a random combination
      const combos = Object.keys(itemsData.combos);
      const randomCombo = combos[Math.floor(Math.random() * combos.length)];
      const [comp1Id, comp2Id] = randomCombo.split('+');
      
      const component1 = itemsData.components.find(c => c.id === comp1Id);
      const component2 = itemsData.components.find(c => c.id === comp2Id);
      
      if (component1 && component2) {
        const comboKey = randomCombo as keyof typeof itemsData.combos;
        const resultItemId = itemsData.combos[comboKey];
        
        // Find the result item (could be in complete or emblems)
        const resultItem = itemsData.complete.find(item => item.id === resultItemId) || 
                     itemsData.emblems.find(item => item.id === resultItemId);
        
        if (resultItem) {
          setCurrentQuestion({
            components: [component1, component2],
            resultItem
          });
          setCorrectAnswer(resultItem);
        }
      }
    }
    
    setSelectedAnswers([]);
    setResult(null);
  };

  // Start a new game
  const startNewGame = (mode: number) => {
    setGameMode(mode);
    setScore(0);
    setTotalQuestions(0);
    setSelectedAnswers([]);
    setResult(null);
  };

  // Check if the answer is correct
  const checkAnswer = () => {
    let isCorrect = false;
    setTotalQuestions(totalQuestions + 1);
    
    if (currentQuestion) {
      if (gameMode === 1) {
        // Mode 1: Check if selected components match the correct ones
        // We need exactly 2 components selected
        if (selectedAnswers.length === 2 && currentQuestion.components) {
          const correctIds = currentQuestion.components.map(c => c.id).sort();
          const selectedIds = selectedAnswers.map(a => a.id).sort();
          isCorrect = correctIds[0] === selectedIds[0] && correctIds[1] === selectedIds[1];
        }
      } else {
        // Mode 2: Check if selected complete item matches the correct one
        if (selectedAnswers.length === 1 && currentQuestion.resultItem) {
          isCorrect = selectedAnswers[0].id === currentQuestion.resultItem.id;
        }
      }
    }
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setResult(isCorrect);
    
    // Generate new question after a delay
    setTimeout(() => {
      generateQuestion();
    }, 2000);
  };

  // Handle item click in the answer area
  const handleItemClick = (item: Item) => {
    if (result !== null) return; // Don't allow new selections when showing result
    
    if (gameMode === 1) {
      // In mode 1, we need to select exactly 2 components
      if (selectedAnswers.find(a => a.id === item.id)) {
        // If already selected, remove it
        setSelectedAnswers(selectedAnswers.filter(a => a.id !== item.id));
      } else if (selectedAnswers.length < 2) {
        // Add to selection if we have less than 2 items selected
        setSelectedAnswers([...selectedAnswers, item]);
      }
      
      // Auto-check if we've selected 2 items
      if (selectedAnswers.length === 1 && !selectedAnswers.find(a => a.id === item.id)) {
        setTimeout(() => {
          checkAnswer();
        }, 500);
      }
    } else {
      // In mode 2, we need to select exactly 1 complete item
      setSelectedAnswers([item]);
      
      // Auto-check after selecting
      setTimeout(() => {
        checkAnswer();
      }, 500);
    }
  };

  // Initialize the game
  useEffect(() => {
    generateQuestion();
  }, [gameMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render item image
  const ItemImage = ({ item, selected, onClick }: { item: Item, selected: boolean, onClick?: (item: Item) => void }) => (
    <Image 
      src={item.src || item.image || ''}
      alt={item.label}
      className={`item-img ${selected ? 'selected' : ''}`}
      onClick={() => onClick && onClick(item)}
      width={64}
      height={64}
    />
  );

  return (
    <>
      <div className="controls">
        <button onClick={() => startNewGame(1)}>Mode 1 (Guess Components)</button>
        <button onClick={() => startNewGame(2)}>Mode 2 (Guess Completed Item)</button>
      </div>

      <div className="game-container">
        {/* Result area - shows score and feedback */}
        <section className="result-area">
          <h2>Score: {score}/{totalQuestions}</h2>
          
          {result !== null && (
            <div className={`result-message ${result ? 'correct' : 'incorrect'}`}>
              {result ? (
                <h3 className="text-green-500">Correct!</h3>
              ) : (
                <div>
                  <h3 className="text-red-500">Incorrect!</h3>
                  {gameMode === 1 && Array.isArray(correctAnswer) ? (
                    <div className="correct-answer">
                      <p>Correct components:</p>
                      <div className="item-row">
                        {correctAnswer.map((item, i) => (
                          <ItemImage key={`${item.id}-${i}`} item={item} selected={false} />
                        ))}
                      </div>
                    </div>
                  ) : correctAnswer && !Array.isArray(correctAnswer) ? (
                    <div className="correct-answer">
                      <p>Correct item:</p>
                      <ItemImage item={correctAnswer} selected={false} />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Question area */}
        {currentQuestion && (
          <section id="question-area" className="question-area">
            {gameMode === 1 ? (
              // Mode 1: Show complete item
              <>
                <h3>What components make this item?</h3>
                {currentQuestion.item && (
                  <ItemImage item={currentQuestion.item} selected={false} />
                )}
              </>
            ) : (
              // Mode 2: Show components
              <>
                <h3>What item do these components create?</h3>
                <div className="component-row">
                  {currentQuestion.components?.map((component) => (
                    <ItemImage key={component.id} item={component} selected={false} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Answer area */}
        <section id="answer-area" className="answer-area">
          {gameMode === 1 ? (
            // Mode 1: Show components to choose from
            itemsData.components.map((component) => (
              <ItemImage 
                key={component.id}
                item={component}
                selected={!!selectedAnswers.find(a => a.id === component.id)}
                onClick={handleItemClick}
              />
            ))
          ) : (
            // Mode 2: Show complete items to choose from
            [...itemsData.complete, ...itemsData.emblems].map((item) => (
              <ItemImage 
                key={item.id}
                item={item}
                selected={!!selectedAnswers.find(a => a.id === item.id)}
                onClick={handleItemClick}
              />
            ))
          )}
        </section>
      </div>
    </>
  );
}
