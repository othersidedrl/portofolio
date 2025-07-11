'use client'

import TestimonyItems from "./_components/TestimonyItems"
import TestimonyForm from "./_components/TestimonyForm"

const TestimonyPage = () => {
  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <TestimonyForm />
        </div>
        <div>
          <TestimonyItems />
        </div>
      </div>
    </div>
  )
}

export default TestimonyPage