'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "~lib/axios"
import {toast} from 'sonner'

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

interface CareerItem {
  started_at: string;
  ended_at: string;
  title: string;
  affiliation: string;
  description: string;
  location: string;
  type: "Education" | "Job";
}

interface TechnicalSkill {
  name: string;
  description: string;
  specialities: string[];
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface SkillResponse {
  data: TechnicalSkill[];
  length: number;
}

interface CareerResponse {
  data: CareerItem[];
  length: number;
}

const AboutForm = () => {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: about,
    isLoading: isAboutLoading,
    isError: isAboutError,
  } = useQuery<About>({
    queryKey: ['about'],
    queryFn: async () => {
      const response = await axios.get('admin/about');
      return response.data;
    },
  });

  const {
    data: skills,
    isLoading: isSkillsLoading,
    isError: isSkillsError,
  } = useQuery<SkillResponse>({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await axios.get('admin/about/skills');
      return response.data;
    },
  });

  const {
    data: career,
    isLoading: isCareerLoading,
    isError: isCareerError,
  } = useQuery<CareerResponse>({
    queryKey: ['career'],
    queryFn: async () => {
      const response = await axios.get('admin/about/careers');
      return response.data;
    },
  });

  // Mutations
  // POST (Create) Technical Skill
  const createSkillMutation = useMutation({
    mutationFn: async (newSkill: Omit<TechnicalSkill, "level"> & { level: TechnicalSkill["level"] }) => {
      const response = await axios.post('admin/about/skills', newSkill);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success("Skill created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to create skill.");
    },
  });

  // UPDATE (Patch) Technical Skill
  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, updatedSkill }: { id: string; updatedSkill: Partial<TechnicalSkill> }) => {
      const response = await axios.patch(`admin/about/skills/${id}`, updatedSkill);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success("Skill updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to update skill.");
    },
  });

  // DELETE Technical Skill
  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`admin/about/skills/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success("Skill deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to delete skill.");
    },
  });

  // POST (Create) Career Item
  const createCareerMutation = useMutation({
    mutationFn: async (newCareer: CareerItem) => {
      const response = await axios.post('admin/about/careers', newCareer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career'] });
      toast.success("Career item created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to create career item.");
    },
  });

  // UPDATE (Patch) Career Item
  const updateCareerMutation = useMutation({
    mutationFn: async ({ id, updatedCareer }: { id: string; updatedCareer: Partial<CareerItem> }) => {
      const response = await axios.patch(`admin/about/careers/${id}`, updatedCareer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career'] });
      toast.success("Career item updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to update career item.");
    },
  });

  // DELETE Career Item
  const deleteCareerMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`admin/about/careers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career'] });
      toast.success("Career item deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to delete career item.");
    },
  });

  // UPDATE (Patch) About Section
  const updateAboutMutation = useMutation({
    mutationFn: async (updatedAbout: Partial<About>) => {
      const response = await axios.patch('admin/about', updatedAbout);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success("About section updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to update about section.");
    },
  });

  return (
    <div>page</div>
  )
}

export default AboutForm