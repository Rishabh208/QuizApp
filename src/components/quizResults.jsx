import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

export const QuizResults = ({ results, resetQuiz }) => (
  <div className="p-6 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
      Quiz Results & Evaluation
    </h2>

    <div className="prose max-w-none p-4 mb-6 border rounded-lg bg-white overflow-auto">
      <ReactMarkdown>{results}</ReactMarkdown>
    </div>
    <div className="flex flex-row justify-evenly">
        <Button
        onClick={resetQuiz}
        className="w-2/5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
        Start New Quiz
        </Button>
        <Link to='/' className="w-2/5 bg-red-600 hover:bg-red-700 text-white font-semibold">
            <Button
            onClick={resetQuiz}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold flex justify-center"
            >
            Home
            </Button>
        </Link>
    </div>

  </div>
);
