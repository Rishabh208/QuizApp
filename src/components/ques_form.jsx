import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuestionDisplay } from "./questionDisplay";
import { QuizResults } from "./quizResults";
import { fetchQuizData, evaluateQuiz } from "../utils/aiService";
import { Progress } from "@/components/ui/progress"

export const QuesForm = () => {
  const { title } = useParams();
  const [mcqData, setMcqData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      setIsLoading(true);
      try {
        const { questions, initialAnswers } = await fetchQuizData(title);
        setMcqData(questions);
        setAnswers(initialAnswers);
      } catch (err) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [title]);

  if (isLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

    );

  if (error) return <div>Error: {error}</div>;
  if (!mcqData.length) return <div>No questions available.</div>;

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(answers).some(a => a === "")) return;

    setIsLoading(true);
    try {
      const evalResult = await evaluateQuiz(title, mcqData, answers);
      setResults(evalResult);
    } catch (err) {
      setResults("Error: Failed to fetch evaluation results.");
    } finally {
      setIsLoading(false);
    }
  };

  const goNext = () => currentQ < mcqData.length - 1 && setCurrentQ(currentQ + 1);
  const goPrev = () => currentQ > 0 && setCurrentQ(currentQ - 1);

  const resetQuiz = () => {
    setResults(null);
    setCurrentQ(0);
    const newInitialAnswers = mcqData.reduce((acc, q) => { acc[`q_${q.id}`] = ""; return acc; }, {});
    setAnswers(newInitialAnswers);
  };

  const currentQuestion = mcqData[currentQ];
  const fieldName = `q_${currentQuestion.id}`;
  const selectedAnswer = answers[fieldName];

  if (results) return <QuizResults results={results} resetQuiz={resetQuiz} />;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-xl">
      <Progress value={((currentQ + 1) / mcqData.length) * 100} />
      <form onSubmit={onSubmit} className="space-y-6">
        <QuestionDisplay
          currentQuestion={currentQuestion}
          currentQ={currentQ}
          totalQuestions={mcqData.length}
          fieldName={fieldName}
          selectedAnswer={selectedAnswer}
          handleAnswerChange={handleAnswerChange}
          isAnswered={selectedAnswer !== ""}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={goPrev} disabled={currentQ === 0}>
            Previous
          </Button>

          {currentQ === mcqData.length - 1 ? (
            <Button type="submit" disabled={Object.values(answers).some(a => a === "")}>
              Submit Quiz
            </Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
