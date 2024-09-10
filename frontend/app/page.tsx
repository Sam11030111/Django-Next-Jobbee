import Link from "next/link";
import axios from "axios";

import JobItem from "./components/job/JobItem";

export interface JobType {
  id: number;
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
  lastDate: string;
  createdAt: Date;
  point: string;
}

export default async function Home() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/`);
  const jobs = await res.data.jobs;

  console.log(jobs);
  

  return (
    <div className="container container-fluid">
      <div className="row">
        <div className="col-xl-3 col-lg-4">{/* <Filters /> */}</div>

        <div className="col-xl-9 col-lg-8 content-left-offset">
          <div className="my-5">
            <h4 className="page-title">Latest Jobs</h4>
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
        </div>
      </div>
    </div>
  );
}
