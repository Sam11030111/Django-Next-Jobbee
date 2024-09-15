'use client';

import { useState, useContext, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";
import { UpdateProfileProps } from "./UpdateProfile";

const UploadResume: React.FC<UpdateProfileProps> = ({ access_token }) => {
  const [resume, setResume] = useState<File | null>(null);
  const { loading, user, error, uploaded, setUploaded, uploadResume } = useContext(AuthContext);    

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (uploaded) {
      setUploaded(false);
      toast.success("Your resume is uploaded successfully.");
    }
  }, [error, uploaded, user]);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (resume) { 
        const formData = new FormData();
        formData.append("resume", resume);
    
        uploadResume(formData, access_token);
      } else {
        console.error("No resume file selected");
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setResume(e.target.files[0]);
    }
  };

  return (
    <div className="modalMask">
      <div className="modalWrapper">
        <div className="left">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image src="/images/resume-upload.svg" alt="resume" fill priority />
          </div>
        </div>
        <div className="right">
          <div className="rightContentWrapper">
            <div className="headerWrapper">
              <h3> UPLOAD RESUME </h3>
            </div>
            <form className="form" onSubmit={submitHandler}>
              <div className="inputWrapper">
                <div className="inputBox">
                  <i aria-hidden className="fas fa-upload"></i>
                  <input
                    type="file"
                    name="resume"
                    id="customFile"
                    accept="application/pdf"
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {user && user.resume && (
                <>
                  <h4 className="text-center my-3">OR</h4>

                  <Link
                    href={`https://jobbee-samlee.s3.us-east-2.amazonaws.com/${user.resume}`}
                    className="text-success text-center ml-4"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <b>
                    <i aria-hidden className="fas fa-download"></i> Download
                    Your Resume
                    </b>
                  </Link>
                </>
              )}

              <div className="uploadButtonWrapper">
                <button type="submit" className="uploadButton">
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;