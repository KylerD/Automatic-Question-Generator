import { RadioGroup, Transition } from '@headlessui/react';
import Head from 'next/head'
import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { ExamAnswers } from '@/components/ExamAnswers';

interface GenerateResponse {
  question: string,
  answers: string[],
  correctAnswer: string
}


export default function Home() {

  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<GenerateResponse>();
  const [showAnswer, setShowAnswer] = useState(false);

  const displayAnswer = () => {
    setShowAnswer(true);
  }

  const generateQuestion = async () => {
    setGeneratingQuestion(true);

    const resp = await fetch('/api/generate');

    setGeneratingQuestion(false);
    setShowAnswer(false);

    if (resp.ok) {
      const generateResponse: GenerateResponse = await resp.json();
      setGeneratedResponse(generateResponse);
    }
  }


  return (
    <>
      <Head>
        <title>Automatic Question Geneartion</title>
        <meta name="description" content="Generated by KD" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="bg-white">
          <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
            <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:py-40 lg:px-8">
              <div className="px-6 lg:px-0 lg:pt-4">
                <div className="mx-auto max-w-2xl">
                  <div className="max-w-lg">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                      Automatic Question Generation
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Hit the generate button below, we will use AI to generate a multi-choice question with one correct answer.
                    </p>
                    <div className="mt-10 flex items-center gap-x-6">
                      {generatingQuestion ?
                        <button
                          type="button"
                          className="rounded-md bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Generating...
                        </button>
                        :
                        <button
                          type="button"
                          onClick={generateQuestion}
                          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Generate <span aria-hidden="true">→</span>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              </div>
              {generatedResponse &&
                <Transition
                  show={!!generatedResponse}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
                    <div
                      className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36"
                      aria-hidden="true"
                    />

                    <div className="shadow-lg md:rounded-3xl">
                      <div className="bg-indigo-500 flex flex-col items-center p-4 text-white [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                        <h2 className='font-semibold'>Question - {generatedResponse.question}</h2>

                        <ExamAnswers answers={generatedResponse.answers} />

                        {showAnswer ?
                          <p className='p-4 w-full bg-green-400 rounded-lg mt-2'>{generatedResponse.correctAnswer}</p>
                          :
                          <button
                            type='button'
                            onClick={displayAnswer}
                            className='bg-white text-slate-800 rounded-lg p-2 mt-2'>
                            Show Answer
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                </Transition>
              }

            </div>
            <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
          </div>
        </div>
      </main>
    </>
  )
}
