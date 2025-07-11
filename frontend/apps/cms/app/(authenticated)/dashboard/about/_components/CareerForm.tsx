"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "~lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import { BiTrash, BiPencil, BiCalendarEdit, BiCalendar } from "react-icons/bi";
import Dropdown from "~/components/ui/Dropdown";

interface CareerItem {
  id: number;
  started_at: string;
  ended_at: string; // Can be "Present"
  title: string;
  affiliation: string;
  description: string;
  location: string;
  type: "Education" | "Job";
}

interface CareerResponse {
  data: CareerItem[];
  length: number;
}

const CareerForm = () => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<Omit<CareerItem, "id">>({
    started_at: "",
    ended_at: "",
    title: "",
    affiliation: "",
    description: "",
    location: "",
    type: "Education",
  });

  const [isPresent, setIsPresent] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: career } = useQuery<CareerResponse>({
    queryKey: ["career"],
    queryFn: async () => {
      const response = await axios.get("admin/about/careers");
      return response.data;
    },
  });

  const createCareerMutation = useMutation({
    mutationFn: async (newCareer: Omit<CareerItem, "id">) => {
      const response = await axios.post("admin/about/careers", newCareer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career"] });
      toast.success("Career item created successfully!");
      resetForm();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to create career item."
      );
    },
  });

  const updateCareerMutation = useMutation({
    mutationFn: async ({
      id,
      updatedCareer,
    }: {
      id: number;
      updatedCareer: Partial<Omit<CareerItem, "id">>;
    }) => {
      const response = await axios.patch(
        `admin/about/careers/${id}`,
        updatedCareer
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career"] });
      toast.success("Career item updated successfully!");
      resetForm();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to update career item."
      );
    },
  });

  const deleteCareerMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`admin/about/careers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career"] });
      toast.success("Career item deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to delete career item."
      );
    },
  });

  const resetForm = () => {
    setForm({
      started_at: "",
      ended_at: "",
      title: "",
      affiliation: "",
      description: "",
      location: "",
      type: "Education",
    });
    setIsPresent(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      ended_at: isPresent ? "Present" : form.ended_at,
    };
    if (editingId !== null) {
      updateCareerMutation.mutate({ id: editingId, updatedCareer: payload });
    } else {
      createCareerMutation.mutate(payload);
    }
  };

  const handleEdit = (item: CareerItem) => {
    setForm({
      started_at: item.started_at,
      ended_at: item.ended_at === "Present" ? "" : item.ended_at,
      title: item.title,
      affiliation: item.affiliation,
      description: item.description,
      location: item.location,
      type: item.type,
    });
    setIsPresent(item.ended_at === "Present");
    setEditingId(item.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--text-strong)]">
        Career Timeline
      </h2>

      <div className="flex flex-col space-y-4">
        {/* Started At, Ended At, Present */}
        <div className="flex gap-2">
          <div className="flex flex-col flex-1">
            <label
              htmlFor="started_at"
              className="mb-1 text-sm font-medium text-[var(--text-muted)]"
            >
              Start Date
            </label>
            <div className="relative">
              <input
                id="started_at"
                type="date"
                value={form.started_at}
                onChange={(e) =>
                  setForm({ ...form, started_at: e.target.value })
                }
                className="input pr-10"
                required
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]">
                <BiCalendar />
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <label
              htmlFor="ended_at"
              className="mb-1 text-sm font-medium text-[var(--text-muted)]"
            >
              End Date
            </label>
            <div className="relative">
              {isPresent ? (
                <input
                  type="text"
                  value="Present"
                  disabled
                  className="input pr-10 italic text-[var(--text-muted)] bg-[var(--bg-light)] cursor-not-allowed"
                />
              ) : (
                <input
                  id="ended_at"
                  type="date"
                  value={form.ended_at}
                  onChange={(e) =>
                    setForm({ ...form, ended_at: e.target.value })
                  }
                  className="input pr-10"
                  required
                />
              )}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]">
                <BiCalendar />
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-1">
              <input
                type="checkbox"
                checked={isPresent}
                onChange={(e) => setIsPresent(e.target.checked)}
                className="accent-[var(--color-primary)] w-4 h-4 rounded border-[var(--border-color)] focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />
              <span className="select-none text-[var(--text-strong)]">
                Present
              </span>
            </label>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label
            htmlFor="career-title"
            className="mb-1 text-sm font-medium text-[var(--text-muted)]"
          >
            Title
          </label>
          <input
            id="career-title"
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
            required
          />
        </div>

        {/* Affiliation */}
        <div className="flex flex-col">
          <label
            htmlFor="career-affiliation"
            className="mb-1 text-sm font-medium text-[var(--text-muted)]"
          >
            Affiliation
          </label>
          <input
            id="career-affiliation"
            type="text"
            placeholder="Affiliation"
            value={form.affiliation}
            onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
            className="input"
            required
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label
            htmlFor="career-location"
            className="mb-1 text-sm font-medium text-[var(--text-muted)]"
          >
            Location
          </label>
          <input
            id="career-location"
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="input"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label
            htmlFor="career-description"
            className="mb-1 text-sm font-medium text-[var(--text-muted)]"
          >
            Description
          </label>
          <textarea
            id="career-description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
          />
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <Dropdown
            label="Type"
            value={form.type}
            onChange={(val) =>
              setForm((prev) => ({
                ...prev,
                type: val as CareerItem["type"],
              }))
            }
            options={["Education", "Job"]}
            placeholder="Select type"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition"
          >
            {editingId !== null ? "Update" : "Save"} Career
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-[var(--text-muted)] underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--border-color)] space-y-4">
        <h3 className="text-lg font-semibold text-[var(--text-strong)]">
          Your Career Items
        </h3>
        {career?.data?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-1 p-4 bg-[var(--bg-mid)] rounded shadow-sm border border-[var(--border-color)]"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold">
                {item.title} — {item.affiliation}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <BiPencil size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCareerMutation.mutate(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <BiTrash size={18} />
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              {item.started_at} - {item.ended_at} | {item.location} |{" "}
              {item.type}
            </p>
            <p className="text-sm text-[var(--text-normal)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </form>
  );
};

export default CareerForm;
