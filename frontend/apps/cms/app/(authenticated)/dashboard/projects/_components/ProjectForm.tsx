"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import axios from "~lib/axios";
import { BiLoaderAlt, BiUpload, BiX } from "react-icons/bi";
import Dropdown from "~/components/ui/Dropdown";

interface ProjectItem {
  id: number;
  name: string;
  imageUrls: string[];
  description: string;
  techStack: string[];
  githubLink: string;
  type: "Web" | "Mobile" | "Machine Learning";
  contribution: "Personal" | "Team";
  projectLink: string;
}

interface TechnicalSkill {
    id: string;
    name: string;
    description: string;
    specialities: string[];
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    category: "Backend" | "Frontend" | "Other";
  }

interface SkillResponse {
  data: TechnicalSkill[];
  length: number;
}

const ProjectForm = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProjectItem>({
    id: 0,
    name: "",
    imageUrls: [""],
    description: "",
    techStack: [],
    githubLink: "",
    type: "Web",
    contribution: "Personal",
    projectLink: "",
  });

  const { data: skillsData, isLoading: isSkillsLoading } = useQuery<SkillResponse>({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await axios.get("admin/about/skills");
      return res.data;
    },
  });

  console.log(skillsData)

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/admin/project/items/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => toast.success("Image uploaded!"),
    onError: () => toast.error("Failed to upload image."),
  });

  const createMutation = useMutation({
    mutationFn: async (payload: ProjectItem) => {
      const res = await axios.post("/admin/project/items", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Project created!");
      queryClient.invalidateQueries({ queryKey: ["project-items"] });
    },
    onError: () => toast.error("Failed to create project."),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImageMutation.mutate(file, {
      onSuccess: (data) => {
        setForm((prev) => ({ ...prev, imageUrls: [data.url] }));
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTech = (skill: string) => {
    setForm((prev) => {
      const current = prev.techStack;
      return current.includes(skill)
        ? { ...prev, techStack: current.filter((s) => s !== skill) }
        : { ...prev, techStack: [...current, skill] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-[var(--bg-mid)] border border-[var(--border-color)] rounded-xl"
    >
      <h2 className="text-xl font-bold text-[var(--text-strong)]">
        Add Project
      </h2>

      <div className="flex flex-col">
        <label
          htmlFor="name"
          className="mb-1 text-sm font-medium text-[var(--text-muted)]"
        >
          Project Name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project Name"
          className="input w-full"
          required
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="mb-1 text-sm font-medium text-[var(--text-muted)]"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="input w-full"
          required
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="githubLink"
          className="mb-1 text-sm font-medium text-[var(--text-muted)]"
        >
          GitHub Link
        </label>
        <input
          id="githubLink"
          name="githubLink"
          value={form.githubLink}
          onChange={handleChange}
          placeholder="GitHub Link"
          className="input w-full"
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="projectLink"
          className="mb-1 text-sm font-medium text-[var(--text-muted)]"
        >
          Project Link
        </label>
        <input
          id="projectLink"
          name="projectLink"
          value={form.projectLink}
          onChange={handleChange}
          placeholder="Project Link"
          className="input w-full"
        />
      </div>

      <Dropdown
        label="Type"
        value={form.type}
        options={["Web", "Mobile", "Machine Learning"]}
        onChange={(value) =>
          setForm((prev) => ({ ...prev, type: value as ProjectItem["type"] }))
        }
      />

      <Dropdown
        label="Contribution"
        value={form.contribution}
        options={["Personal", "Team"]}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            contribution: value as ProjectItem["contribution"],
          }))
        }
      />

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-[var(--text-muted)]">
          Tech Stack
        </label>
        <div className="flex flex-wrap gap-2">
          {skillsData?.data?.map((skill) => (
            <button
              key={skill.name}
              type="button"
              onClick={() => toggleTech(skill.name)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors duration-200
                ${form.techStack.includes(skill.name)
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                  : "bg-[var(--bg-light)] text-[var(--text-normal)] border-[var(--border-color)] hover:border-[var(--color-primary)]"}`}
            >
              {skill.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 w-full">
        <label className="block text-lg font-semibold mb-4 text-[var(--text-strong)]">
          Upload Project Image
        </label>
        <div className="group relative w-full border-2 border-dashed p-6 transition-colors duration-200 bg-transparent border-[var(--border-color)] hover:border-[var(--color-primary)]">
          {form.imageUrls[0] ? (
            <div className="relative">
              <img
                src={form.imageUrls[0]}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg bg-[var(--color-accent)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary)]"
              >
                <BiX size={16} />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs bg-black bg-opacity-50 text-[var(--text-normal)]">
                Project Image
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex flex-col items-center justify-center h-48">
                <BiUpload className="w-12 h-12 mb-4 text-[var(--border-color)]" />
                <p className="font-medium mb-2 text-[var(--text-muted)]">
                  Click to upload
                </p>
                <p className="text-sm text-[var(--text-muted)]">Image 1</p>
              </div>
            </div>
          )}
          <label htmlFor="image-upload" className="sr-only">
            Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default ProjectForm;