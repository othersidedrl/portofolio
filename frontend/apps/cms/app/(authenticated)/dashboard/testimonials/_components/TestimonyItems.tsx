"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "~lib/axios";
import { BiCheck, BiTrash } from "react-icons/bi";
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

const TestimonyItems = () => {
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      axios.delete(`/admin/testimony/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony-items"] });
      toast.success("Testimony deleted!");
    },
    onError: () => toast.error("Failed to delete testimony."),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[var(--text-strong)]">
        Testimonials
      </h2>
      {isLoading ? (
        <p className="text-[var(--text-muted)]">Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load testimonies.</p>
      ) : testimonyItems?.data?.length === 0 ? (
        <p className="text-[var(--text-muted)]">No testimonies yet.</p>
      ) : (
        testimonyItems?.data?.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 border border-[var(--border-color)] bg-[var(--bg-mid)] rounded-xl shadow-sm"
          >
            <img
              src={
                item.profile_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`
              }
              alt={item.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-[var(--text-strong)]">
                  {item.name}
                </p>
                <div className="flex gap-2">
                  {!item.approved && (
                    <button
                      onClick={() => approveMutation.mutate(item.id)}
                      className="text-green-600 hover:text-green-700"
                      title="Approve"
                    >
                      <BiCheck size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="text-red-500 hover:text-red-600"
                    title="Delete"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
              </div>
              <div className="bg-[var(--bg-light)] text-[var(--text-normal)] text-sm whitespace-pre-wrap p-3 rounded-lg border border-[var(--border-color)]">
                {item.description}
              </div>
              <div className="flex items-start gap-2 text-sm text-[var(--text-muted)] italic border border-dashed border-[var(--border-color)] bg-[var(--bg-light)] p-3 rounded">
                <LuSparkles className="w-4 h-4 text-[var(--color-primary)] mt-0.5 shrink-0" />
                <span>{item.ai_summary}</span>
              </div>


              {item.approved && (
                <span className="text-xs text-green-600 font-medium">
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
