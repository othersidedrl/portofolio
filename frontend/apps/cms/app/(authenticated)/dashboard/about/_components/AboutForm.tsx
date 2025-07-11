'use client';

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "~lib/axios";

interface AboutCard {
  title: string;
  description: string;
}

interface About {
  description: string;
  cards: AboutCard[];
  linkedin_link: string;
  github_link: string;
  available: boolean;
}

const AboutForm = () => {
  const queryClient = useQueryClient();

  const {
    data: about,
    isLoading,
    isError,
  } = useQuery<About>({
    queryKey: ["about"],
    queryFn: async () => {
      const response = await axios.get("admin/about");
      return response.data;
    },
  });

  const updateAboutMutation = useMutation({
    mutationFn: async (updatedAbout: Partial<About>) => {
      const response = await axios.patch("admin/about", updatedAbout);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About section updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to update about section."
      );
    },
  });

  const [form, setForm] = useState<About>({
    description: "",
    linkedin_link: "",
    github_link: "",
    cards: [],
    available: false,
  });

  useEffect(() => {
    if (about) {
      setForm(about);
    }
  }, [about]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && "checked" in e.target ? (e.target as HTMLInputElement).checked : undefined;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutMutation.mutate(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-4 md:p-8 space-y-8 bg-[var(--bg-mid)] border border-[var(--border-color)] rounded-xl shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[var(--text-strong)]">About Section</h2>

      {/* Description */}
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="mb-1 text-sm font-medium text-[var(--text-muted)]"
        >
          Bio
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Tell the world who you are..."
          className="input w-full"
          required
        />
      </div>

      {/* Links */}
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <div className="flex flex-col">
          <label
            htmlFor="linkedin_link"
            className="mb-1 text-sm font-medium text-[var(--text-muted)]"
          >
            LinkedIn
          </label>
          <input
            id="linkedin_link"
            name="linkedin_link"
            type="url"
            value={form.linkedin_link}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
            className="input w-full"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="github_link"
            className="mb-1 text-sm font-medium text-[var(--text-muted)]"
          >
            GitHub
          </label>
          <input
            id="github_link"
            name="github_link"
            type="url"
            value={form.github_link}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
            className="input w-full"
          />
        </div>
      </div>

      {/* Availability */}
      <label className="flex items-center gap-2 mt-1 text-[var(--text-muted)]">
        <input
          type="checkbox"
          name="available"
          checked={form.available}
          onChange={handleChange}
        />
        Available for hire
      </label>

      <button
        type="submit"
        disabled={updateAboutMutation.isPending}
        className="w-full py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition"
      >
        {updateAboutMutation.isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default AboutForm;
