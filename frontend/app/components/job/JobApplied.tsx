"use client";

import { JobsAppliedType } from "@/app/me/applied/page";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import Loader from "../loader/Loader";

interface JobsAppliedProps {
  jobs: JobsAppliedType[];
}

const JobsApplied: React.FC<JobsAppliedProps> = ({ jobs }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobData, setJobData] = useState<JobsAppliedType[]>([]);
  
  useEffect(() => {
    setJobData(jobs);
    setIsLoading(false);
  }, [jobs]);  

  const columns = [
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
      name: "Education",
      sortable: true,
      selector: (row: any) => row.education,
    },
    {
      name: "Experience",
      sortable: true,
      selector: (row: any) => row.experience,
    },
    {
      name: "Applied On",
      sortable: true,
      selector: (row: any) => row.appliedOn,
    },
    {
      name: "Action",
      cell: (row: any) => row.action,
      ignoreRowClick: true,
    },
  ];

  if (isLoading) {
    return <Loader />
  }

  const data = jobData.map((item) => ({
    title: item.job.title,
    salary: item.job.salary,
    education: item.job.education,
    experience: item.job.experience,
    appliedOn: item.appliedAt.substring(0, 10),
    action: (
      <Link href={`/jobs/${item.job.id}`} className="btn btn-primary">
        <FaEye />
      </Link>
    ),
  }));

  return (
    <div className="row">
      <div className="col-2"></div>
      <div className="col-8 mt-5">
        <h4 className="my-5">Jobs Applied</h4>
        <DataTable columns={columns} data={data} pagination responsive />
      </div>
      <div className="col-2"></div>
    </div>
  );
};

export default JobsApplied;
