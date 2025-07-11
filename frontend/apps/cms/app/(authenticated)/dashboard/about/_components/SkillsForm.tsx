"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Dropdown from "~/components/ui/Dropdown";
import { toast } from "sonner";
import axios from "~lib/axios";
import { useState } from "react";
import { BiTrash, BiPencil, BiX } from "react-icons/bi";
import * as Ariakit from "@ariakit/react";

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

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
const categories = ["All", "Backend", "Frontend", "Other"] as const;

const SkillsForm = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<TechnicalSkill, "id">>({
    name: "",
    description: "",
    specialities: [],
    level: "Beginner",
    category: "Backend",
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      specialities: [],
      level: "Beginner",
      category: "Backend",
    });
    setEditId(null);
    setOpen(false);
  };

  const {
    data: skills,
  } = useQuery<SkillResponse>({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await axios.get("admin/about/skills");
      return res.data;
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (newSkill: Omit<TechnicalSkill, "id">) => {
      const res = await axios.post("admin/about/skills", newSkill);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill created!");
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Create failed.");
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, updated }: { id: string; updated: Omit<TechnicalSkill, "id"> }) => {
      const res = await axios.patch(`admin/about/skills/${id}`, updated);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill updated!");
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Update failed.");
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`admin/about/skills/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Delete failed.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateSkillMutation.mutate({ id: editId, updated: form });
    } else {
      createSkillMutation.mutate(form);
    }
  };

  const filteredSkills = skills?.data?.filter((s) =>
    activeCategory === "All" ? true : s.category === activeCategory
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-strong)]">Technical Skills</h2>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-1.5 rounded hover:opacity-90 transition"
        >
          + Add Skill
        </button>
      </div>

      {/* Skill Cards */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-[var(--border-color)] pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`text-sm px-4 py-1 rounded-full ${
                activeCategory === cat
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                  : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-strong)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredSkills && filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="flex flex-col gap-1 p-4 bg-[var(--bg-mid)] rounded shadow-sm border border-[var(--border-color)]"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  {skill.name} ({skill.level})
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(skill.id);
                      setForm({
                        name: skill.name,
                        description: skill.description,
                        specialities: [...skill.specialities],
                        level: skill.level,
                        category: skill.category,
                      });
                      setOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <BiPencil size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSkillMutation.mutate(skill.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)]">{skill.description}</p>
              {skill.specialities.length > 0 && (
                <ul className="list-disc list-inside text-sm text-[var(--text-normal)] mt-1">
                  {skill.specialities.map((spec, j) => (
                    <li key={j}>{spec}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-[var(--text-muted)] bg-[var(--bg-mid)] rounded border border-[var(--border-color)]">
            No items in {activeCategory}
          </div>
        )}
      </div>

      {/* Modal */}
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
              {editId ? "Edit Skill" : "Add Skill"}
            </Ariakit.DialogHeading>
            <Ariakit.DialogDismiss className="text-[var(--text-muted)] hover:text-[var(--text-strong)]">
              <BiX size={24} />
            </Ariakit.DialogDismiss>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <input
              placeholder="Skill Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              required
            />

            <textarea
              placeholder="Skill Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />

            <Dropdown
              label="Skill Level"
              value={form.level}
              onChange={(val) => setForm({ ...form, level: val as TechnicalSkill["level"] })}
              options={[...levels]}
              placeholder="Select level"
            />

            <Dropdown
              label="Category"
              value={form.category}
              onChange={(val) => setForm({ ...form, category: val as TechnicalSkill["category"] })}
              options={["Backend", "Frontend", "Other"]}
              placeholder="Select category"
            />

            <div className="space-y-2">
              {form.specialities.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={spec}
                    onChange={(e) => {
                      const updated = [...form.specialities];
                      updated[i] = e.target.value;
                      setForm({ ...form, specialities: updated });
                    }}
                    placeholder={`Speciality ${i + 1}`}
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        specialities: prev.specialities.filter((_, j) => j !== i),
                      }))
                    }
                    className="text-sm text-red-500 hover:underline"
                  >
                    <BiTrash size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, specialities: [...prev.specialities, ""] }))
                }
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                + Add Speciality
              </button>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition"
              >
                {editId ? "Update Skill" : "Save Skill"}
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

export default SkillsForm;
    