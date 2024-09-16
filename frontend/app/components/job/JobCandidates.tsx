"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DataTable from "react-data-table-component";

import { JobsAppliedType } from "@/app/me/applied/page";
import Loader from "../loader/Loader";
import { FaDownload } from "react-icons/fa";

interface JobCandidatesProps {
    candidatesApplied: JobsAppliedType[];
}

const JobCandidates: React.FC<JobCandidatesProps> = ({ candidatesApplied }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobCandidates, setJobCandidates] = useState<JobsAppliedType[]>([]);

  useEffect(() => {
    setJobCandidates(candidatesApplied);
    setIsLoading(false);
  }, [jobCandidates]);  

  const columns = [
    {
      name: "Job Name",
      sortable: true,
      selector: (row: any) => row.title,
    },
    {
      name: "User ID",
      sortable: true,
      selector: (row: any) => row.id,
    },
    {
      name: "Candidate Resume",
      sortable: true,
      selector: (row: any) => row.resume,
    },
    {
      name: "Applied At",
      sortable: true,
      selector: (row: any) => row.appliedAt,
    },
  ];

  if (isLoading) {
    return <Loader />
  }

  const data = jobCandidates.map((item) => ({
    title: item.job.title,
    id: item.user,
    salary: item.job.salary,
    resume: (
        <Link href={`https://jobbee-samlee.s3.us-east-2.amazonaws.com/${item.resume}`} className="text-success text-center ml-4" rel="noreferrer" target="_blank">
        <b>
            <FaDownload /> View Resume
        </b>
        </Link>
    ),
    appliedAt: item.appliedAt.substring(0, 10),
  }));

  return (
    <div className="row">
      <div className="col-2"></div>
      <div className="col-8 mt-5">
        <h4 className="my-5">
          {jobCandidates && `${jobCandidates.length} Candidates applied to this job`}
        </h4>
        <DataTable columns={columns} data={data} pagination responsive />
      </div>
      <div className="col-2"></div>
    </div>
  );
};

export default JobCandidates;