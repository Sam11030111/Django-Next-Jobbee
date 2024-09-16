"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import JobItem from "./components/job/JobItem";
import Filters from "./components/filters/Filters";

export interface JobType {
  id?: number;
  title: string;
  company: string;
  address: string;
  industry: string;
  jobType: string;
  description: string;
  salary: number;
  education: string;
  experience: string;
  email: string;
  lastDate?: string;
  createdAt?: Date;
  point?: string;
  positions: number;
}

export default function Home({
   searchParams 
  }: { 
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
  const router = useRouter();

  const [jobs, setJobs] = useState<JobType[]>([]);
  const [resPerPage, setResPerPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const keyword = searchParams.keyword || '';
  const location = searchParams.location || '';
  const jobType = searchParams.jobType || '';
  const education = searchParams.education || '';
  const experience = searchParams.experience || '';
  const salary = searchParams.salary || '';
  const page = parseInt((searchParams.page as string) || '1');

  let queryStr = `page=${page}`;

  if (keyword) queryStr += `&keyword=${keyword}`;
  if (location) queryStr += `&location=${location}`;  
  if (jobType) queryStr += `&jobType=${jobType}`;
  if (education) queryStr += `&education=${education}`;
  if (experience) queryStr += `&experience=${experience}`;
  if (salary) queryStr += `&salary=${salary}`;

  const fetchJobs = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/?${queryStr}`);

    const jobs = await res.data.jobs;
    const resPerPage = await res.data.resPerPage;
    const count = await res.data.count;
  
    setJobs(jobs);
    setResPerPage(resPerPage);
    setCount(count);
    setCurrentPage(page);
  }

  useEffect(() => {
    fetchJobs();
  }, [keyword, location, jobType, education, experience, salary, page])

  const totalPages = Math.ceil(count / resPerPage);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const handlePageClick = (pageNumber: number) => {
    let newQueryStr = `/?page=${pageNumber}`;
    
    if (keyword) {
      newQueryStr += `&keyword=${keyword}`;
    }

    if (location) {
      newQueryStr += `&location=${location}`;
    }

    if (searchParams.jobType) {
      newQueryStr += `&jobType=${searchParams.jobType}`;
    }

    if (searchParams.education) {
        newQueryStr += `&education=${searchParams.education}`;
    }

    if (searchParams.experience) {
        newQueryStr += `&experience=${searchParams.experience}`;
    }
    
    if (searchParams.salary) {
        newQueryStr += `&salary=${searchParams.salary}`;
    }

    router.push(newQueryStr);
  };

  return (
    <div className="container container-fluid">
      <div className="row">
        <div className="col-xl-3 col-lg-4">
          <Filters />
        </div>

        <div className="col-xl-9 col-lg-8 content-left-offset">
          <div className="my-5">
            <h4 className="page-title">
              {keyword ? `${jobs?.length} Results for ${keyword}` : 'Latest Jobs'}
            </h4>
            <Link href="/stats">
              <button className="btn btn-secondary float-end stats_btn">
                Get Topic stats
              </button>
            </Link>
            <div className="d-block">
              <Link href="/search">Go to Search</Link>
            </div>
          </div>
          {jobs && jobs.map((job: JobType) => (
            <JobItem key={job.id} job={job}  />
          ))}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => handlePageClick(currentPage - 1)}
                    >
                      Previous
                    </a>
                  </li>
                  {pages.map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => handlePageClick(pageNumber)}
                      >
                        {pageNumber}
                      </a>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => handlePageClick(currentPage + 1)}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
