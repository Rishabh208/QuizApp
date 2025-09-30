import { topics } from "@/constants/topics";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-5xl font-bold mb-12 text-center text-gray-800">
                Choose Your Favorite Topic
            </h1>

            <ul className="flex flex-col space-y-6 w-3/5 max-w-md">
                {topics?.map((topic, index) => (
                    <li key={index} className="flex justify-center">
                        <Link to={`/${topic.title}`}>
                            <Button
                                variant="destructive"
                                className="w-full py-5 text-lg font-medium bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100
 text-gray-800 shadow-md rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
                            >
                                {topic.title}
                            </Button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
