import React from "react";
import JobCard from "./JobCard";

/** Renders a list of job card components */
function JobCardList({ jobs, apply }) {
  return (
      <div className="JobCardList">
        {jobs.map(job => (
            <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                salary={job.salary}
                equity={job.equity}
                companyName={job.companyName}
            />
        ))}
      </div>
  );
}

export default JobCardList;