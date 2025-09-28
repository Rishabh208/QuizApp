import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { mcqData } from "@/constants/mcqData"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"


const formSchema = z.object(
  mcqData.reduce((acc, q) => {
    acc[q.id] = z.string({ required_error: "Please select an option" })
    return acc
  }, {})
)

export const QuesForm = () => {
  const [ currentQ, setCurrentQ ] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: mcqData.reduce((acc, q) => {
      acc[q.id] = ""
      return acc
    }, {})
  })

  const onSubmit = (values) => {
    const allAnswered = mcqData.every(q => values[q.id]);
    
    if (!allAnswered) {
      alert("Please answer all questions before submitting!");
      return;
    }

    let score = 0
    mcqData.forEach((q) => {
      if (values[q.id] === q.answer) score++
    })
    alert(`Your Score: ${score} / ${mcqData.length}`)
    console.log("Answers:", values)
  }

  const goNext = (e) => {
    e.preventDefault()
    if(currentQ < mcqData.length-1) setCurrentQ(currentQ + 1);
  }

  const goPrev = (e) => {
    e.preventDefault()
    if(currentQ > 0) setCurrentQ(currentQ - 1);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <FormField
            key={mcqData[currentQ].id}
            control={form.control}
            name={mcqData[currentQ].id.toString()}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  Q{currentQ + 1}. {mcqData[currentQ].question}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {mcqData[currentQ].options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option}
                        id={`${mcqData[currentQ].id}-${idx}`}
                      />
                      <label htmlFor={`${mcqData[currentQ].id}-${idx}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={currentQ === 0}
          >
            Previous
          </Button>

          {currentQ === mcqData.length - 1 ? (
            <Button type="submit">Submit Quiz</Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
