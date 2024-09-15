"use client";

import axios from "axios";
import { useState, useEffect, createContext, ReactNode, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
    setUpdated: Dispatch<SetStateAction<boolean>>;
    applyToJob: (id: number, access_token: string) => Promise<void>;
    checkJobApplied: (id: number, access_token: string) => Promise<void>;
    getTopicStats: (topic: string) => Promise<void>;
}

const defaultContextValue: JobContextType = {
    loading: false,
    error: null,
    updated: false,
    applied: false,
    stats: defaultStats,
    setUpdated: () => {},
    applyToJob: async(id: number, access_token: string) => {},
    checkJobApplied: async(id: number, access_token: string) => {},
    getTopicStats: async(topic: string) => {}
};

const JobContext = createContext<JobContextType>(defaultContextValue);

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [updated, setUpdated] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);
  const [stats, setStats] = useState<StatsType>(defaultStats);

  const router = useRouter();

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
        setUpdated,
        applyToJob,
        checkJobApplied,
        getTopicStats,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;