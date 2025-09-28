import { topics } from "@/constants/topics"
import { Button } from "@/components/ui/button"
import { QuesForm } from "@/components/ques_form"

export const Home = () => {
    return (
        <>
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div className="text-5xl">Select your Favourite Topic</div>
                <ul className="w-4/5 h-4/5 flex flex-col justify-evenly items-center">
                    {
                        topics?.map((topic, index) => {
                            return (
                                <li key={index}>
                                    <Button variant="destructive">
                                        {topic.title}
                                    </Button>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <QuesForm />
        </>
    )
}