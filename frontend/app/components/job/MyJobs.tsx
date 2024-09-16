"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable from "react-data-table-component";

import JobContext from "../../context/JobContext";
import { JobType } from "@/app/page";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import Loader from "../loader/Loader";

interface MyJobsProps {
    jobs: JobType[];
    access_token: string;
}

const MyJobs: React.FC<MyJobsProps> = ({ jobs, access_token }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobData, setJobData] = useState<JobType[]>([]);
  
  const { error, loading, deleted, setDeleted, deleteJob } = useContext(JobContext);

  const router = useRouter();

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (deleted) {
      setDeleted(false);      
    }
  }, [error, deleted]);

  useEffect(() => {
    setJobData(jobs);
    setIsLoading(false);
  }, [jobs]);  

  const deleteJobHandler = async (id: number) => {
    await deleteJob(id, access_token);
    setJobData(prevJobs => prevJobs.filter(job => job.id !== id));
    toast.success("Job Deleted Successfully!")
  };

  const columns = [
    {
      name: "Job ID",
      sortable: true,
      selector: (row: any) => row.id,
    },
    {
      name: "Job name",
      sortable: true,
      selector: (row: any) => row.title,
    },
    {
      name: "Salary",
      sortable: true,
      selector: (row: any) => row.salary,
    },
    {
      name: "Action",
      sortable: true,
      selector: (row: any) => row.action,
    },
  ];

  if (isLoading) {
    return <Loader />
  }


  const data = jobData.map((job) => ({
    id: job.id,
    title: job.title,
    salary: job.salary,
    action: (
        <>
        <Link href={`/jobs/${job.id}`} className="btn btn-primary">
            <FaEye />
        </Link>
        <Link href={`/employee/jobs/candidates/${job.id}`} className="btn btn-success my-2 mx-1">
            <FaUsers />
        </Link>
        <Link href={`/employee/jobs/${job.id}`} className="btn btn-warning my-2 mx-1">
            <FaPencil />
        </Link>
        <button
            className="btn btn-danger mx-1"
            onClick={() => job.id !== undefined && deleteJobHandler(job.id)}
        >
            <FaTrash />
        </button>
        </>
    ),
  }));

  return (
    <div className="row">
      <div className="col-2"></div>
      <div className="col-8 mt-5">
        <h4 className="my-5">My Jobs</h4>
        <DataTable columns={columns} data={data} pagination responsive />
      </div>
      <div className="col-2"></div>
    </div>
  );
};

export default MyJobs;