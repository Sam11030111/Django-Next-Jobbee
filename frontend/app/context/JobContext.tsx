"use client";

import axios from "axios";
import { useState, useEffect, createContext, ReactNode, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

import { JobType } from "../page";

interface JobProviderProps {
    children: ReactNode;
}

type StatsType = {
    total_jobs: number;
    avg_positions: number;
    avg_salary: number;
    min_salary: number;
    max_salary: number;
    message: string;
}

const defaultStats: StatsType = {
    total_jobs: 0,
    avg_positions: 0,
    avg_salary: 0,
    min_salary: 0,
    max_salary: 0,
    message: '',
};

interface JobContextType {
    loading: boolean;
    error: Error | null;
    updated: boolean;
    applied: boolean;
    stats: StatsType;
    created: boolean;
    deleted: boolean;
    setUpdated: Dispatch<SetStateAction<boolean>>;
    applyToJob: (id: number, access_token: string) => Promise<void>;
    checkJobApplied: (id: number, access_token: string) => Promise<void>;
    getTopicStats: (topic: string) => Promise<void>;
    setCreated: Dispatch<SetStateAction<boolean>>;
    createNewJob: (data: JobType, access_token: string) => Promise<void>;
    updateJob: (id: number, data: JobType, access_token: string) => Promise<void>;
    setDeleted: Dispatch<SetStateAction<boolean>>;
    deleteJob: (id: number, access_token: string) => Promise<void>;
}

const defaultContextValue: JobContextType = {
    loading: false,
    error: null,
    updated: false,
    applied: false,
    stats: defaultStats,
    created: false,
    deleted: false,
    setUpdated: () => {},
    applyToJob: async(id: number, access_token: string) => {},
    checkJobApplied: async(id: number, access_token: string) => {},
    getTopicStats: async(topic: string) => {},
    setCreated: () => {},
    createNewJob: async(data: JobType, access_token: string) => {},
    updateJob: async(id: number, data: JobType, access_token: string) => {},
    setDeleted: () => {},
    deleteJob: async(id: number, access_token: string) => {},
};

const JobContext = createContext<JobContextType>(defaultContextValue);

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [updated, setUpdated] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [stats, setStats] = useState<StatsType>(defaultStats);

  // Create a new job
  const createNewJob = async (data: JobType, access_token: string) => {
    try {
      setLoading(true);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/new/`, data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("🟢Create New Job: ", res.data);
      
      if (res.data) {
        setLoading(false);
        setCreated(true);
      }
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Update job
  const updateJob = async (id: number, data: JobType, access_token: string) => {
    try {
      setLoading(true);

      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}/update/`, data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("Update Job: ", res.data);

      if (res.data) {
        setLoading(false);
        setUpdated(true);
        toast.success("Update Successfully!")
      }
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Delete job
  const deleteJob = async (id: number, access_token: string) => {
    try {
      setLoading(true);

      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      
      setLoading(false);
      setDeleted(true);
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Apply to Job
  const applyToJob = async (id: number, access_token: string) => {    
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}/apply/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data.applied === true) {
        setLoading(false);
        setApplied(true);
      }
    } catch (error: any) {      
        toast.error(String(error.response.data.error));          
        setLoading(false);
        setError(
            error.response &&
            (error.response.data.detail || error.response.data.error)
        );
    }
  };

  // Check job applied
  const checkJobApplied = async (id: number, access_token: string) => {
      try {
        setLoading(true);
  
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}/check/`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        setLoading(false);
        setApplied(res.data);
      } catch (error: any) {
        setLoading(false);
        setError(
          error.response &&
            (error.response.data.detail || error.response.data.error)
        );
      }
  };

  // Get topic stats
  const getTopicStats = async (topic: string) => {
      try {
        setLoading(true);
  
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/${topic}/`);
            
        setLoading(false);
        setStats(res.data);
      } catch (error: any) {
        console.log(error);
        
        setLoading(false);
        setError(
          error.response &&
            (error.response.data.detail || error.response.data.error)
        );
      }
  };

  return (
    <JobContext.Provider
      value={{
        loading,
        error,
        updated,
        applied,
        stats,
        created,
        deleted,
        setUpdated,
        applyToJob,
        checkJobApplied,
        getTopicStats,
        setCreated,
        createNewJob,
        updateJob,
        setDeleted,
        deleteJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;