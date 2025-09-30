import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { QuestionDisplay } from "./questionDisplay";
import { QuizResults } from "./quizResults";


export const QuesForm = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [mcqData, setMcqData] = useState([]);
  const [answers, setAnswers] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null); 
  
  const { title } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: title }),
        });
        const data = await response.json();

        const questions = data.questions.questions.map((q, idx) => ({
          ...q,
          id: q.id ?? idx + 1,
        }));
        setMcqData(questions);

        const initialAnswers = questions.reduce((acc, q) => {
          acc[`q_${q.id}`] = "";
          return acc;
        }, {});
        setAnswers(initialAnswers);

      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    fetchData();
  }, [title]);

  if (mcqData.length === 0) return <div>Loading quiz...</div>
  
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(answers).some(a => a === "")) {
      console.log("Please answer all questions before submitting.");
      return; 
    }

    setIsLoading(true);

    try {
        const topic = title;
        const questions_payload = JSON.stringify(mcqData); 
        const answers_payload = JSON.stringify(answers);
        
        const response = await fetch("http://localhost:5000/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                topic: topic,
                questions: questions_payload,
                answers: answers_payload,
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data.evaluation);
        
    } catch (error) {
        console.error("Evaluation failed:", error);
        setResults("Error: Failed to fetch evaluation results.");
    } finally {
        setIsLoading(false);
    }
  };

  const goNext = (e) => {
    e.preventDefault();
    if (currentQ < mcqData.length - 1) setCurrentQ(currentQ + 1);
  };

  const goPrev = (e) => {
    e.preventDefault();
    if (currentQ > 0) setCurrentQ(currentQ - 1)
  };
  
  const resetQuiz = () => {
    setResults(null);
    setCurrentQ(0);
    const newInitialAnswers = mcqData.reduce((acc, q) => { acc[`q_${q.id}`] = ""; return acc; }, {});
    setAnswers(newInitialAnswers);
  };

  const currentQuestion = mcqData[currentQ];
  const fieldName = `q_${currentQuestion.id}`;
  const selectedAnswer = answers[fieldName];
  const isAnswered = selectedAnswer !== ""; 
  

  if (isLoading) {
    return (
        <div className="p-6 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-700">Evaluating Quiz...</h2>
            <p className="mt-4 text-gray-600">Please wait while the AI generates your score and explanations.</p>
        </div>
    );
  }

  if (results) {
    return <QuizResults results={results} resetQuiz={resetQuiz} />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-xl">
      <form onSubmit={onSubmit} className="space-y-6">
        
        <QuestionDisplay 
            currentQuestion={currentQuestion}
            currentQ={currentQ}
            totalQuestions={mcqData.length}
            fieldName={fieldName}
            selectedAnswer={selectedAnswer}
            handleAnswerChange={handleAnswerChange}
            isAnswered={isAnswered}
        />

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={currentQ === 0}
            className="px-6 py-2"
          >
            Previous
          </Button>

          {currentQ === mcqData.length - 1 ? (
            <Button 
              type="submit" 
              className="px-6 py-2 bg-green-600 hover:bg-green-700"
              disabled={Object.values(answers).some(a => a === "")} 
            >
              Submit Quiz
            </Button>
          ) : (
            <Button type="button" onClick={goNext} className="px-6 py-2">
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};