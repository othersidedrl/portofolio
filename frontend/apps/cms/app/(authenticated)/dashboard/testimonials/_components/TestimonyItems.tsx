"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "~lib/axios";
import { toast } from "sonner";
import { BiCheck, BiTrash, BiX } from "react-icons/bi";
import { LuSparkles } from "react-icons/lu";

interface TestimonyItem {
  id: string;
  name: string;
  profile_url: string;
  affiliation: string;
  rating: number;
  description: string;
  ai_summary: string;
  approved: boolean;
}

interface TestimonyItemsResponse {
  data: TestimonyItem[];
  length: number;
}

const tabs = ["Approved", "Pending"] as const;

const TestimonyItems = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Approved");

  const {
    data: testimonyItems,
    isLoading,
    isError,
  } = useQuery<TestimonyItemsResponse>({
    queryKey: ["testimony-items"],
    queryFn: async () => {
      const res = await axios.get("/admin/testimony/items");
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) =>
      axios.patch(`/admin/testimony/items/${id}/approve`, { approved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony-items"] });
      toast.success("Testimony approved!");
    },
    onError: () => toast.error("Failed to approve testimony."),
  });

  const unapproveMutation = useMutation({
    mutationFn: async (id: string) =>
      axios.patch(`/admin/testimony/items/${id}/approve`, { approved: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony-items"] });
      toast.success("Testimony unapproved!");
    },
    onError: () => toast.error("Failed to unapprove testimony."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      axios.delete(`/admin/testimony/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony-items"] });
      toast.success("Testimony deleted!");
    },
    onError: () => toast.error("Failed to delete testimony."),
  });

  const filteredItems = testimonyItems?.data.filter((item) =>
    activeTab === "Approved" ? item.approved : !item.approved
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
        Testimonials
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border-color)] pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-1 rounded-full ${
              activeTab === tab
                ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-strong)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <p className="text-[var(--text-muted)]">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load testimonies.</p>
      ) : filteredItems?.length === 0 ? (
        <p className="text-[var(--text-muted)]">No {activeTab.toLowerCase()} testimonies.</p>
      ) : (
        filteredItems?.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-[var(--bg-mid)] border border-[var(--border-color)] rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* Avatar */}
            <img
              src={
                item.profile_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`
              }
              alt={item.name}
              className="w-12 h-12 rounded-full object-cover border border-[var(--border-color)]"
            />

            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-[var(--text-strong)]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {item.affiliation}
                  </p>
                </div>

                <div className="flex gap-1">
                  {item.approved ? (
                    <button
                      onClick={() => unapproveMutation.mutate(item.id)}
                      className="text-yellow-500 hover:text-yellow-400 p-1 rounded hover:bg-yellow-500/10"
                      title="Unapprove"
                    >
                      <BiX size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => approveMutation.mutate(item.id)}
                      className="text-green-500 hover:text-green-400 p-1 rounded hover:bg-green-500/10"
                      title="Approve"
                    >
                      <BiCheck size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10"
                    title="Delete"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="text-sm text-[var(--text-normal)] whitespace-pre-wrap bg-[var(--bg-light)] p-3 rounded-md border border-[var(--border-color)]">
                {item.description}
              </div>

              {/* AI Summary */}
              <div className="flex items-start gap-2 bg-[var(--bg-light)]/50 border border-dashed border-[var(--border-color)] p-3 rounded-md text-sm italic text-[var(--text-muted)]">
                <LuSparkles className="w-4 h-4 mt-0.5 text-[var(--color-primary)] shrink-0" />
                <span>{item.ai_summary}</span>
              </div>

              {/* Status Badge */}
              {item.approved && (
                <span className="inline-block text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full w-fit">
                  Approved
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TestimonyItems;
