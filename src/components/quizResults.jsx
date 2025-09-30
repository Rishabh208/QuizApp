import { Button } from "@/components/ui/button";

export const QuizResults = ({ results, resetQuiz }) => (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Quiz Results & Evaluation</h2>
        <div 
            className="prose max-w-none p-4 border rounded-lg bg-gray-50 overflow-auto" 
            dangerouslySetInnerHTML={{ __html: results }} 
        />
        <Button 
            onClick={resetQuiz}
            className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700"
        >
            Start New Quiz
        </Button>
    </div>
);