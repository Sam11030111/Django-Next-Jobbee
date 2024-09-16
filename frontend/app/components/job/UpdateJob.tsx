"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import JobContext from "../../context/JobContext";
import { jobTypeOptions, educationOptions, industriesOptions, experienceOptions } from "./data";
import { JobType } from "@/app/page";
import Loader from "../loader/Loader";

interface UpdateJobProps {
    job: JobType;
    access_token: string;
}

const UpdateJob: React.FC<UpdateJobProps> = ({
    job, access_token 
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [jobType, setJobType] = useState<string>("Permanent");
  const [education, setEducation] = useState<string>("Bachelors");
  const [industry, setIndustry] = useState<string>("Business");
  const [experience, setExperience] = useState<string>("No Experience");
  const [salary, setSalary] = useState<string>("");
  const [positions, setPositions] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const { error, loading, updated, updateJob, setUpdated } = useContext(JobContext);

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDescription(job.description);
      setEmail(job.email);
      setAddress(job.address);
      setJobType(job.jobType);
      setEducation(job.education);
      setIndustry(job.industry);
      setExperience(job.experience);
      setSalary(String(job.salary));
      setPositions(String(job.positions));
      setCompany(job.company);
      setIsLoading(false);
    }

    if (error) {
      console.log(error);
    }

    if (updated) {
      setUpdated(false);
      router.push("/employee/jobs");
    }
  }, [error, updated]);

  if (isLoading) {
    return <Loader />
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      title,
      description,
      email,
      address,
      jobType,
      education,
      industry,
      experience,
      salary: Number(salary),
      positions: Number(positions),
      company,
    };

    if (job.id) {
     updateJob(job.id, data, access_token);
    }
  };

  return (
    <div className="newJobcontainer">
      <div className="formWrapper">
        <div className="headerWrapper">
          <div className="headerLogoWrapper"></div>
          <h1>
            <i aria-hidden className="fas fa-copy mr-2"></i> UPDATE JOB
          </h1>
        </div>
        <form className="form" onSubmit={submitHandler}>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="inputWrapper">
                <div className="inputBox">
                  <i aria-hidden className="fab fa-tumblr"></i>
                  <input
                    type="text"
                    placeholder="Enter Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="inputBox">
                  <i aria-hidden className="fas fa-file-medical-alt"></i>
                  <textarea
                    className="description"
                    placeholder="Enter Job Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="inputBox">
                  <i aria-hidden className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    pattern="\S+@\S+\.\S+"
                    title="Your email is invalid"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="inputBox">
                  <i aria-hidden className="fas fa-map-marker-alt"></i>
                  <input
                    type="text"
                    placeholder="Enter Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="inputBox">
                  <i aria-hidden className="fas fa-dollar-sign"></i>
                  <input
                    type="number"
                    placeholder="Enter Salary Range"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                  />
                </div>
                <div className="inputBox">
                  <i aria-hidden className="fas fa-users"></i>
                  <input
                    type="number"
                    placeholder="Enter No. of Positions"
                    value={positions}
                    onChange={(e) => setPositions(e.target.value)}
                    required
                  />
                </div>
                <div className="inputBox">
                  <i aria-hidden className="fas fa-building"></i>
                  <input
                    type="text"
                    placeholder="Enter Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 ml-4 mt-4 mt-md-0 ml-md-0">
              <div className="boxWrapper">
                <h4>Job Types:</h4>
                <div className="selectWrapper">
                  <select
                    className="classic"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    {jobTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="boxWrapper">
                <h4>Education:</h4>
                <div className="selectWrapper">
                  <select
                    className="classic"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  >
                    {educationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="boxWrapper">
                <h4>Industry:</h4>
                <div className="selectWrapper">
                  <select
                    className="classic"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    {industriesOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="boxWrapper">
                <h4>Experience:</h4>
                <div className="selectWrapper">
                  <select
                    className="classic"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    {experienceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="col text-center mt-3">
              <button className="createButton">
                {loading ? "Updating..." : "Update Job"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJob;