"use client";

import AboutForm from "./_components/AboutForm";
import CareerForm from "./_components/CareerForm";
import SkillsForm from "./_components/SkillsForm";

const AboutPage = () => {
  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ABOUT - spans full width (both columns) */}
        <div className="md:col-span-2">
          <AboutForm />
        </div>

        {/* SKILLS - left column */}
        <div>
          <SkillsForm />
        </div>

        {/* CAREER - right column */}
        <div>
          <CareerForm />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
