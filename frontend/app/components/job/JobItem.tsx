import Link from "next/link";

import moment from "moment";

import { FaRegClock } from "react-icons/fa";
import { FaIndustry } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { FaMoneyCheckAlt } from "react-icons/fa";

import { JobType } from "@/app/page";

export interface JobProps {
  job: JobType;
  candidates?: number;
}

const JobItem: React.FC<JobProps> = ({
  job
}) => {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="job-listing">
        <div className="job-listing-details">
          <div className="job-listing-description">
            <h4 className="job-listing-company">{job.company}</h4>
            <h3 className="job-listing-title">{job.title}</h3>
            <p className="job-listing-text">
              {job.description.substring(0, 200)}...
            </p>
          </div>

          <span className="bookmark-icon"></span>
        </div>

        <div className="job-listing-footer">
          <ul>
            <li className="job-mark">
              <FaIndustry /> {job.industry}
            </li>
            <li className="job-mark">
              <FaBriefcase /> {job.jobType}
            </li>
            <li className="job-mark">
              <FaMoneyCheckAlt /> {job.salary}
            </li>
            <li className="job-mark">
              <FaRegClock />
              {moment.utc(job.createdAt).local().startOf("seconds").fromNow()}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default JobItem;