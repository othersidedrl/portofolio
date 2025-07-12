"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "~lib/axios";
import {
  BiExport,
  BiLink,
  BiLinkExternal,
  BiLogoGithub,
  BiPencil,
  BiPlus,
  BiTrash,
  BiUpload,
  BiX,
} from "react-icons/bi";
import * as Ariakit from "@ariakit/react";
import { useState } from "react";
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
interface ProjectItemsResponse {
  data: ProjectItem[];
  length: number;
}

const ProjectItems = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: projectItems,
    isLoading,
    isError,
  } = useQuery<ProjectItemsResponse>({
    queryKey: ["project-items"],
    queryFn: async () => {
      const res = await axios.get("/admin/project/items");
      return res.data;
    },
  });

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

  const { data: skillsData, isLoading: isSkillsLoading } =
    useQuery<SkillResponse>({
      queryKey: ["skills"],
      queryFn: async () => {
        const res = await axios.get("admin/about/skills");
        return res.data;
      },
    });

  console.log(skillsData);

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
      setOpen(false); // Close modal on success
      resetForm();
    },
    onError: () => toast.error("Failed to create project."),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: ProjectItem) => {
      const res = await axios.put(
        `/admin/project/items/${payload.id}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Project updated!");
      queryClient.invalidateQueries({ queryKey: ["project-items"] });
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update project."),
  });

  const resetForm = () => {
    setForm({
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
    setIsEditing(false);
  };

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
    if (isEditing) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (item: ProjectItem) => {
    setForm(item);
    setIsEditing(true);
    setOpen(true);
  };

  const handleOpenModal = () => {
    resetForm();
    setOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      axios.delete(`/admin/project/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-items"] });
      toast.success("Project deleted!");
    },
    onError: () => toast.error("Failed to delete project."),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <h2 className="text-2xl font-bold text-[var(--text-strong)]">
          Projects
        </h2>
        <Ariakit.Button onClick={handleOpenModal} className="button">
          <BiPlus size={16} />
        </Ariakit.Button>
      </div>

      <Ariakit.Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        className="dialog fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm"
      >
        <div className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-[var(--bg-mid)] border border-[var(--border-color)] rounded-xl">
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
            <Ariakit.DialogHeading className="text-xl font-bold text-[var(--text-strong)]">
              {isEditing ? "Edit Project" : "Add Project"}
            </Ariakit.DialogHeading>
            <Ariakit.DialogDismiss className="text-[var(--text-muted)] hover:text-[var(--text-strong)]">
              <BiX size={24} />
            </Ariakit.DialogDismiss>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
          >
            {/* Left column */}
            <div className="flex flex-col gap-4">
              <div>
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

              <div>
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

              <div>
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
                  setForm((prev) => ({
                    ...prev,
                    type: value as ProjectItem["type"],
                  }))
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
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              <div>
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
                  className="input w-full h-32"
                  required
                />
              </div>

              <div>
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
                ${
                  form.techStack.includes(skill.name)
                    ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                    : "bg-[var(--bg-light)] text-[var(--text-normal)] border-[var(--border-color)] hover:border-[var(--color-primary)]"
                }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 w-full">
                <label className="block text-sm font-medium text-[var(--text-muted)]">
                  Upload Project Image
                </label>
                <div className="group relative w-full border-2 border-dashed p-4 transition-colors duration-200 bg-transparent border-[var(--border-color)] hover:border-[var(--color-primary)]">
                  {form.imageUrls[0] ? (
                    <div className="relative">
                      <img
                        src={form.imageUrls[0]}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, imageUrls: [""] }))
                        }
                        className="absolute top-2 right-2 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg bg-[var(--color-accent)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary)]"
                      >
                        <BiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="flex flex-col items-center justify-center h-48">
                        <BiUpload className="w-12 h-12 mb-4 text-[var(--border-color)]" />
                        <p className="font-medium mb-2 text-[var(--text-muted)]">
                          Click to upload
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">
                          Image 1
                        </p>
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
            </div>

            {/* Submit / Cancel buttons – full width */}
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="flex-1 py-2 px-4 border border-[var(--border-color)] rounded hover:bg-[var(--bg-light)] transition text-[var(--text-normal)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 py-2 px-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Project"
                  : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </Ariakit.Dialog>

      {isLoading ? (
        <p className="text-[var(--text-muted)]">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load projects.</p>
      ) : projectItems?.data?.length === 0 ? (
        <p className="text-[var(--text-muted)]">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectItems?.data?.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-[var(--border-color)] bg-[var(--bg-mid)] rounded-xl shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[var(--text-strong)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {item.type} • {item.contribution}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <BiPencil size={18} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => deleteMutation.mutate(item.id)}
                    title="Delete"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
              </div>

              <div className="text-sm text-[var(--text-normal)] whitespace-pre-wrap">
                {item.description}
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                {item.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[var(--bg-light)] border border-[var(--border-color)] rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 text-sm">
                {item.githubLink && (
                  <a
                    href={item.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline hover:text-[var(--color-accent)] transition-colors"
                  >
                    <span className="flex items-center gap-1 group">
                      <BiLogoGithub
                        size={16}
                        className="transition-colors"
                      />{" "}
                      GitHub
                    </span>
                  </a>
                )}
                {item.projectLink && (
                  <a
                    href={item.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline hover:text-[var(--color-accent)] transition-colors"
                  >
                    <span className="flex items-center gap-1 group">
                      Live Site{" "}
                      <BiLinkExternal
                        size={16}
                        className="transition-colors"
                      />
                    </span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {item.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Project ${item.name} ${i}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectItems;
