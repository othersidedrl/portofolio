"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "~lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import * as Ariakit from "@ariakit/react";
import { BiTrash, BiPencil, BiCalendar, BiX } from "react-icons/bi";
import Dropdown from "~/components/ui/Dropdown";

interface CareerItem {
  id: number;
  started_at: string;
  ended_at: string;
  title: string;
  affiliation: string;
  description: string;
  location: string;
  type: "Education" | "Job";
}

const CareerForm = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isPresent, setIsPresent] = useState(false);

  const [form, setForm] = useState<Omit<CareerItem, "id">>({
    started_at: "",
    ended_at: "",
    title: "",
    affiliation: "",
    description: "",
    location: "",
    type: "Education",
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
    setEditId(null);
    setOpen(false);
  };

  const { data: career } = useQuery({
    queryKey: ["career"],
    queryFn: async () => {
      const res = await axios.get("admin/about/careers");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCareer: Omit<CareerItem, "id">) =>
      (await axios.post("admin/about/careers", newCareer)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career"] });
      toast.success("Career created");
      resetForm();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.error || "Create failed."),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updated,
    }: {
      id: number;
      updated: Omit<CareerItem, "id">;
    }) => (await axios.patch(`admin/about/careers/${id}`, updated)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career"] });
      toast.success("Career updated");
      resetForm();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.error || "Update failed."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      (await axios.delete(`admin/about/careers/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career"] });
      toast.success("Career deleted");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.error || "Delete failed."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      ended_at: isPresent ? "Present" : form.ended_at,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, updated: payload });
    } else {
      createMutation.mutate(payload);
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
    setEditId(item.id);
    setOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-strong)]">Career Timeline</h2>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-1.5 rounded hover:opacity-90 transition"
        >
          + Add Career
        </button>
      </div>

      <div className="space-y-4">
        {career?.data?.map((item: CareerItem) => (
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
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <BiPencil size={18} />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <BiTrash size={18} />
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              {item.started_at} - {item.ended_at} | {item.location} | {item.type}
            </p>
            <p className="text-sm text-[var(--text-normal)]">{item.description}</p>
          </div>
        ))}
      </div>

      <Ariakit.Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        className="dialog fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-[var(--bg-mid)] border border-[var(--border-color)] rounded-xl">
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
            <Ariakit.DialogHeading className="text-xl font-bold text-[var(--text-strong)]">
              {editId ? "Edit Career" : "Add Career"}
            </Ariakit.DialogHeading>
            <Ariakit.DialogDismiss className="text-[var(--text-muted)] hover:text-[var(--text-strong)]">
              <BiX size={24} />
            </Ariakit.DialogDismiss>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-[var(--text-muted)]">Start Date</label>
                <input
                  type="date"
                  value={form.started_at}
                  onChange={(e) => setForm({ ...form, started_at: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-[var(--text-muted)]">End Date</label>
                {isPresent ? (
                  <input
                    type="text"
                    disabled
                    value="Present"
                    className="input italic bg-[var(--bg-light)] text-[var(--text-muted)] cursor-not-allowed"
                  />
                ) : (
                  <input
                    type="date"
                    value={form.ended_at}
                    onChange={(e) => setForm({ ...form, ended_at: e.target.value })}
                    className="input w-full"
                    required
                  />
                )}
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isPresent}
                    onChange={(e) => setIsPresent(e.target.checked)}
                    className="accent-[var(--color-primary)] w-4 h-4"
                  />
                  Present
                </label>
              </div>
            </div>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              required
            />

            <input
              placeholder="Affiliation"
              value={form.affiliation}
              onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
              className="input"
              required
            />

            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />

            <Dropdown
              label="Type"
              value={form.type}
              onChange={(val) => setForm({ ...form, type: val as CareerItem["type"] })}
              options={["Education", "Job"]}
              placeholder="Select type"
            />

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition"
              >
                {editId ? "Update Career" : "Save Career"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-2 px-4 border border-[var(--border-color)] rounded hover:bg-[var(--bg-light)] transition text-[var(--text-normal)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Ariakit.Dialog>
    </>
  );
};

export default CareerForm;
