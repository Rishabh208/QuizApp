export const QuestionDisplay = ({ currentQuestion, currentQ, totalQuestions, fieldName, selectedAnswer, handleAnswerChange, isAnswered }) => (
    <div 
        key={currentQuestion.id} 
        className="space-y-4 bg-white p-6 rounded-lg border border-gray-200"
    >
        <label className="font-extrabold text-xl text-gray-800 block">
            Q{currentQ + 1} of {totalQuestions}. {currentQuestion.question}
        </label>
        
        <div role="radiogroup" className="flex flex-col space-y-3 pt-2">
            {currentQuestion.options.map((option, idx) => (
                <div 
                    key={idx} 
                    className="flex items-center space-x-3 p-4 border border-gray-300 hover:border-blue-500 rounded-lg transition-all duration-150 cursor-pointer 
                                bg-white has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50"
                >
                    <input
                        type="radio"
                        name={fieldName} 
                        value={option}
                        checked={selectedAnswer === option} 
                        onChange={() => handleAnswerChange(fieldName, option)}
                        id={`${currentQuestion.id}_${idx}`}
                        className="h-5 w-5 border-gray-400 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500 accent-blue-600 transition-colors duration-150"
                    />
                    
                    <label 
                        htmlFor={`${currentQuestion.id}_${idx}`} 
                        className="font-medium w-full cursor-pointer text-gray-700 select-none"
                    >
                        {option}
                    </label>
                </div>
            ))}
        </div>
        {!isAnswered && currentQ === totalQuestions - 1 && (
            <p className="text-sm font-semibold text-orange-600 pt-1">
                Please answer this question before submitting.
            </p>
        )}
    </div>
);