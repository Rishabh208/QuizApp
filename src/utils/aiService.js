import axios from "axios";

const api = "http://localhost:5000"

export const fetchQuizData = async (topic) => {
  try {
    const response = await axios.post(`${api}/generate`, { topic });
    
    const data = response.data;

    const questions = data.questions.questions.map((q, idx) => ({
      ...q,
      id: q.id ?? idx + 1,
    }));

    const initialAnswers = questions.reduce((acc, q) => {
      acc[`q_${q.id}`] = "";
      return acc;
    }, {});

    return { questions, initialAnswers };
  } catch (err) {
    console.error("Failed to fetch quiz data:", err);
    throw err;
  }
};

export const evaluateQuiz = async (topic, questions, answers) => {
  try {
    const response = await axios.post(`${api}/evaluate`, {
      topic,
      questions: JSON.stringify(questions),
      answers: JSON.stringify(answers),
    });

    return response.data.evaluation;
  } catch (err) {
    console.error("Failed to evaluate quiz:", err);
    throw err;
  }
};
