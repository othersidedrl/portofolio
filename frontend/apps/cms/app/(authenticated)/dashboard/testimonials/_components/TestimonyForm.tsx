'use client';

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "~lib/axios";

interface TestimonyPage {
  title: string;
  description: string;
}

const TestimonyForm = () => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<TestimonyPage>({
    title: "",
    description: "",
  });

  const {
    data: testimony,
    isLoading,
    isError,
  } = useQuery<TestimonyPage>({
    queryKey: ["testimony"],
    queryFn: async () => {
      const res = await axios.get("/admin/testimony");
      return res.data;
    },
  });

  const updateTestimonyMutation = useMutation({
    mutationFn: async (updated: TestimonyPage) => {
      const res = await axios.patch("/admin/testimony", updated);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony"] });
      toast.success("Testimony page updated!");
    },
    onError: () => toast.error("Failed to update testimony page."),
  });

  useEffect(() => {
    if (testimony) {
      setForm(testimony);
    }
  }, [testimony]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTestimonyMutation.mutate(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-4 md:p-8 space-y-8 bg-[var(--bg-mid)] border border-[var(--border-color)] rounded-xl shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[var(--text-strong)]">Testimony Page Settings</h2>

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
        disabled={updateTestimonyMutation.isPending}
        className="w-full py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition"
      >
        {updateTestimonyMutation.isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default TestimonyForm;
