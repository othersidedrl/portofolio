'use client'

import ProjectItems from "./_components/ProjectItems"
import ProjectPageForm from "./_components/ProjectPageForm"

const ProjectPage = () => {
  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="gap-6 flex flex-col">
          <ProjectPageForm />
        </div>
        <div>
          <ProjectItems />
        </div>
      </div>
    </div>
  )
}

export default ProjectPage