'use client';

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "~lib/axios";

interface ProjectPage {
  title: string;
  description: string;
}

const ProjectForm = () => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ProjectPage>({
    title: "",
    description: "",
  });

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery<ProjectPage>({
    queryKey: ["project"],
    queryFn: async () => {
      const res = await axios.get("/admin/project");
      return res.data;
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updated: ProjectPage) => {
      const res = await axios.patch("/admin/project", updated);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Project page updated!");
    },
    onError: () => toast.error("Failed to update Project page."),
  });

  useEffect(() => {
    if (project) {
      setForm(project);
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectMutation.mutate(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-4 md:p-8 space-y-8 bg-[var(--bg-mid)] border border-[var(--border-color)] rounded-xl shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[var(--text-strong)]">Project Page Settings</h2>

      {/* Title */}
      <div className="flex flex-col">
        <label
          htmlFor="title"
          className="mb-1 text-sm font-medium text-[var(--text-muted)]"
        >
          Section Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter section title"
          className="input w-full"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="mb-1 text-sm font-medium text-[var(--text-muted)]"
        >
          Section Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe this section..."
          className="input w-full"
          required
        />
      </div>

      <button
        type="submit"
        disabled={updateProjectMutation.isPending}
        className="w-full py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition"
      >
        {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default ProjectForm;
