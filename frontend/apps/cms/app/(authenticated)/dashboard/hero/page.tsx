"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "~lib/axios";
import { useState, useEffect } from "react";
import { BiLoaderAlt, BiPlus, BiUpload, BiX } from "react-icons/bi";
import { toast } from "sonner";

type HeroData = {
  name: string;
  rank: string;
  title: string;
  subtitle: string;
  resume_link: string;
  contact_link: string;
  image_urls: string[];
  hobbies: string[];
};

export default function HeroForm() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const response = await axios.get("/admin/hero");
      return response.data as HeroData;
    },
  });

  const [form, setForm] = useState({
    name: "",
    rank: "",
    title: "",
    subtitle: "",
    resumeLink: "",
    contactLink: "",
    imageUrls: [""],
    hobbies: [""],
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        rank: data.rank || "",
        title: data.title || "",
        subtitle: data.subtitle || "",
        resumeLink: data.resume_link || "",
        contactLink: data.contact_link || "",
        imageUrls:
          data.image_urls && data.image_urls.length > 0
            ? data.image_urls
            : [""],
        hobbies: data.hobbies && data.hobbies.length > 0 ? data.hobbies : [""],
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    field: "imageUrls" | "hobbies",
    index: number,
    value: string
  ) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm((prev) => ({
      ...prev,
      [field]: updated,
    }));
  };

  const addToArray = (field: "imageUrls" | "hobbies") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/admin/hero/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Image successfuly uploaded!");
    },
    onError: (error: any) => {
      toast.error("Failed to upload hero section image.");
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      console.error("Error uploading image:", error);
    },
  });

  const savePageMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      const payload: HeroData = {
        name: formData.name,
        rank: formData.rank,
        title: formData.title,
        subtitle: formData.subtitle,
        resume_link: formData.resumeLink,
        contact_link: formData.contactLink,
        image_urls: formData.imageUrls.filter((url) => url),
        hobbies: formData.hobbies.filter((h) => h),
      };
      const res = await axios.patch("/admin/hero", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Hero section updated!");
      queryClient.invalidateQueries({ queryKey: ["hero"] });
    },
    onError: (error: any) => {
      toast.error("Failed to update hero section.");
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      console.error("Error updating hero section:", error);
    },
  });

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadImageMutation.mutate(file, {
      onSuccess: (data) => {
        const updated = [...form.imageUrls];
        updated[index] = data.url;
        setForm((prev) => ({ ...prev, imageUrls: updated }));
      },
      onError: (error) => {
        console.error("Image upload failed", error);
        alert("Upload failed. Please try again.");
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePageMutation.mutate(form);
  };

  return (
    <div className="relative w-full">
      {uploadImageMutation.isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-[var(--bg-mid)] rounded-xl shadow-2xl p-6 flex flex-col items-center gap-4 border border-[var(--border-color)]">
            <BiLoaderAlt
              className="animate-spin text-[var(--color-primary)]"
              size={32}
            />
            <span className="text-md font-medium text-[var(--text-strong)]">
              Uploading image... 📸
            </span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full p-4 md:p-8 space-y-8">
        <h2 className="text-2xl font-bold text-[var(--text-strong)]">
          Hero Section
        </h2>

        {/* Basic Fields */}
        <div className="grid md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-sm font-medium text-[var(--text-muted)]"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="rank"
              className="mb-1 text-sm font-medium text-[var(--text-muted)]"
            >
              Rank
            </label>
            <input
              id="rank"
              name="rank"
              placeholder="Rank"
              value={form.rank}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label
              htmlFor="title"
              className="mb-1 text-sm font-medium text-[var(--text-muted)]"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label
              htmlFor="subtitle"
              className="mb-1 text-sm font-medium text-[var(--text-muted)]"
            >
              Subtitle
            </label>
            <textarea
              id="subtitle"
              name="subtitle"
              placeholder="Subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="resumeLink"
              className="mb-1 text-sm font-medium text-[var(--text-muted)]"
            >
              Resume Link
            </label>
            <input
              id="resumeLink"
              name="resumeLink"
              placeholder="Resume Link"
              value={form.resumeLink}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="contactLink"
              className="mb-1 text-sm font-medium text-[var(--text-muted)]"
            >
              Contact Link
            </label>
            <input
              id="contactLink"
              name="contactLink"
              placeholder="Contact Link"
              value={form.contactLink}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
        </div>

        {/* Image Uploads */}
        <div className="space-y-4 w-full">
          <label className="block text-lg font-semibold mb-4 text-[var(--text-strong)]">
            Upload Images (4 max)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {Array.from({ length: 4 }).map((_, i) => {
              const url = form.imageUrls[i] || "";
              return (
                <div key={i} className="group relative w-full">
                  <div className="border-2 border-dashed p-6 transition-colors duration-200 bg-transparent border-[var(--border-color)] hover:border-[var(--color-primary)]">
                    {url ? (
                      <div className="relative">
                        <img
                          src={url}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          // onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg bg-[var(--color-accent)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary)]"
                        >
                          <BiX size={16} />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs bg-black bg-opacity-50 text-[var(--text-normal)]">
                          Image {i + 1}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="flex flex-col items-center justify-center h-48">
                          <BiUpload className="w-12 h-12 mb-4 text-[var(--border-color)]" />
                          <p className="font-medium mb-2 text-[var(--text-muted)]">
                            Click to upload
                          </p>
                          <p className="text-sm text-[var(--text-muted)]">
                            Image {i + 1}
                          </p>
                        </div>
                      </div>
                    )}

                    <label htmlFor={`image-upload-${i}`} className="sr-only">
                      Upload Image {i + 1}
                    </label>
                    <input
                      id={`image-upload-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(i, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hobbies */}
        <div className="w-full">
          <label className="block text-md font-medium text-[var(--text-strong)] mb-2">
            Hobbies
          </label>
          <div className="space-y-2 w-full">
            {form.hobbies.map((hobby: string, i: number) => (
              <div key={i} className="flex flex-col">
                <label
                  htmlFor={`hobby-${i}`}
                  className="mb-1 text-xs font-medium text-[var(--text-muted)]"
                >
                  Hobby {i + 1}
                </label>
                <input
                  id={`hobby-${i}`}
                  value={hobby}
                  placeholder={`Hobby ${i + 1}`}
                  onChange={(e) =>
                    handleArrayChange("hobbies", i, e.target.value)
                  }
                  className="input w-full"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addToArray("hobbies")}
            className="mt-2 text-sm text-[var(--color-accent)] hover:underline"
          >
            + Add Hobby
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold rounded hover:opacity-90 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}
