from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import json

load_dotenv()

class QuizAI:
    def __init__(self, model_name="gpt-4o-mini"):
        self.model = ChatOpenAI(model=model_name)
        self.parser = StrOutputParser()

        self.question_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Quiz Generator. Always return valid JSON only."),
            ("human", 
            "The topic is: {topic}. "
            "Generate 5 multiple-choice questions in the following JSON format:\n\n"
            "{{\n"
            "  \"questions\": [\n"
            "    {{\n"
            "      \"id\": 1,\n"
            "      \"question\": \"Your question text here\",\n"
            "      \"options\": [\"Option1\", \"Option2\", \"Option3\", \"Option4\"],\n"
            "      \"answer\": \"Correct Option\"\n"
            "    }}\n"
            "  ]\n"
            "}}\n\n"
            "Use unique IDs for each question. Do not include any explanation, only JSON."
            )
        ])



        self.evaluation_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Quiz Evaluator."),
            ("human",
             "Here are the questions on {topic}: \n{questions}\n\n"
             "Here are my answers: {answers}. "
             "Now evaluate: \n"
             "- Show which ones are correct or incorrect. \n"
             "- Provide the correct answers where needed. \n"
             "- Give explanations. \n"
             "- Show total score."
            )
        ])

        self.question_chain = self.question_prompt | self.model | self.parser
        self.evaluation_chain = self.evaluation_prompt | self.model | self.parser

    def generate_questions(self, topic: str) -> list:
        questions_str = self.question_chain.invoke({"topic": topic})
        print(questions_str)
        try:
            questions_json = json.loads(questions_str)
        except json.JSONDecodeError:
            print("⚠️ Model did not return valid JSON, falling back to empty list.")
            questions_json = {"questions": []}
        return questions_json


    def evaluate_answers(self, topic: str, questions: str, answers: str) -> str:
        """Evaluate user answers for given questions."""
        return self.evaluation_chain.invoke({
            "topic": topic,
            "questions": questions,
            "answers": answers
        })

