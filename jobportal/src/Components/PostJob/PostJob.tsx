import { Button, Select, TagsInput, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "./TextEditer.tsx";
import { notifications } from "@mantine/notifications";
import { JOB_API_END_POINT } from "../../utils/constant.js";
import { content } from "../../Data/PostJob.tsx";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import useGetAllCompanies from "../../hooks/useGetAllCompanies.tsx";

const PostJob = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [jobStatus, setJobStatus] = useState('active');
  const form = useForm({
    initialValues: {
      jobTitle: "",
      companyId: "",
      experience: "",
      jobType: "",
      location: "",
      salary: "",
      skills: [] as string[],
      about: "",
      description: content, // Initialize with default content
    },
    validate: {
      jobTitle: isNotEmpty("Job title is required"),
      companyId: isNotEmpty("Please select a company"),
      experience: isNotEmpty("Experience is required"),
      jobType: isNotEmpty("Job type is required"),
      location: isNotEmpty("Location is required"),
      salary: (value) =>
        !value || isNaN(Number(value)) ? "Salary must be a valid number" : null,
      skills: (value) =>
        !value || value.length === 0 ? "Skills are required" : null,
      about: isNotEmpty("About the job is required"),
      description: (value) =>
        !value || value.length === 0 ? "Skills are required" : null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);
  const navigate = useNavigate();
  useGetAllCompanies(); // Fetch companies when component mounts
  const { companies } = useSelector((store: any) => store.company);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) return;
      try {
        setFetchingJob(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const job = res.data.job;
          setJobStatus(job.status || 'active');
          const jobSkills = Array.isArray(job.skills)
            ? job.skills
            : job.skills
            ? job.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];

          form.setValues({
            jobTitle: job.jobTitle || "",
            companyId: job.company?._id || job.company || "",
            experience: job.experience || "",
            jobType: job.jobType || "",
            location: job.location || "",
            salary: job.salary ? String(job.salary) : "",
            skills: jobSkills,
            about: job.about || "",
            description: job.description || content,
          });
        }
      } catch (error) {
        console.error(error);
        notifications.show({
          title: "Error",
          message: "Failed to load job data for editing.",
          color: "red",
          withBorder: true,
          className: "!border-red-500",
        });
      } finally {
        setFetchingJob(false);
      }
    };
    fetchJobData();
  }, [id]);

  const handlePost = async (values: any) => {
    try {
      setLoading(true);

      // When publishing a draft or posting new, set status to active
      const payload = { ...values, status: 'active' };

      let res;
      if (isEditMode) {
        res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        notifications.show({
          title: isEditMode && jobStatus === 'draft'
            ? "Job Published Successfully"
            : isEditMode
            ? "Job Updated Successfully"
            : "Job Created Successfully",
          message: res.data.message,
          withBorder: true,
          className: "!border-blue-500",
        });
        navigate("/jobs-Table");
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        message: error.response.data.message,
        color: "red",
        withBorder: true,
        className: "!border-red-500",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    // Only validate jobTitle and companyId for drafts
    const errors: any = {};
    if (!form.values.jobTitle) errors.jobTitle = "Job title is required";
    if (!form.values.companyId) errors.companyId = "Please select a company";
    
    if (Object.keys(errors).length > 0) {
      form.setErrors(errors);
      return;
    }

    try {
      setDraftLoading(true);
      const payload = { ...form.values, status: 'draft' };

      let res;
      if (isEditMode) {
        res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        notifications.show({
          title: "Saved as Draft",
          message: "Job saved as draft. You can continue editing later.",
          withBorder: true,
          className: '!border-blue-500',
        });
        navigate("/jobs-Table");
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        message: error?.response?.data?.message || "Something went wrong",
        color: "red",
        withBorder: true,
        className: "!border-red-500",
      });
    } finally {
      setDraftLoading(false);
    }
  };

  if (fetchingJob) {
    return (
      <div className="px-16 bs-mx:px-5 py-5 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-500 font-medium">Loading job data...</p>
        </div>
      </div>
    );
  }

  const isDraft = isEditMode && jobStatus === 'draft';
  const pageTitle = isDraft ? "Edit Draft" : isEditMode ? "Edit Job" : "Post a Job";
  const publishLabel = isDraft ? "Publish Job" : isEditMode ? "Update Job" : "Post Job";

  return (
    <div className="px-16 bs-mx:px-5 py-5">
      <Button
        leftSection={<IconArrowLeft size={20} />}
        onClick={() => navigate(-1)}
        color="blue.4"
        variant="light"
      >
        Back
      </Button>
      <div className="text-2xl font-semibold mt-6">
        {pageTitle}
        {isDraft && (
          <span className="ml-3 text-sm font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            Draft
          </span>
        )}
      </div>
      {companies.length === 0 && (
        <p className="text-xs text-red-600 font-bold my-3">
          *Please register a company first, before posting a job
        </p>
      )}

      <form
        onSubmit={form.onSubmit(handlePost)}
        className="flex flex-col gap-5 mt-8"
      >
        <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
          <TextInput
            withAsterisk
            label="Job Title"
            placeholder="Enter Job Title"
            {...form.getInputProps("jobTitle")}
          />
          <Select
            label="Select a Company"
            placeholder="Choose a company"
            withAsterisk
            data={companies.map((company: any) => ({
              value: company._id,
              label: company.name,
            }))}
            {...form.getInputProps("companyId")}
            searchable
            nothingFoundMessage="No companies found"
          />
        </div>

        <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
          <TextInput
            withAsterisk
            label="Experience"
            placeholder="Enter Experience Level"
            {...form.getInputProps("experience")}
          />
          <TextInput
            withAsterisk
            label="Job Type"
            placeholder="Enter Job Type"
            {...form.getInputProps("jobType")}
          />
        </div>

        <div className="flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:!w-full sm-mx:flex-wrap">
          <TextInput
            withAsterisk
            label="Location"
            placeholder="Enter Job Location"
            {...form.getInputProps("location")}
          />
          <TextInput
            withAsterisk
            label="Salary"
            placeholder="Enter Salary"
            {...form.getInputProps("salary")}
          />
        </div>

       {/* Skills Tag Input */}
        <TagsInput
          withAsterisk
          label="Skills"
          placeholder="Enter skill and press Enter"
          splitChars={[',']}
          {...form.getInputProps('skills')}
        />

        <TextInput
          withAsterisk
          label="About Job"
          placeholder="Enter About Job"
          {...form.getInputProps("about")}
        />

        <div className="[&_button[data-active='true']]:!text-blue-400 [&_button[data-active='true']]:!bg-blue-400/20">
          <div className="text-sm font-medium">
            Job Description <span className="text-red-500">*</span>
          </div>
          <TextEditor
            form={{
              getValues: () => form.values,
              setFieldValue: (key, value) => form.setFieldValue(key, value),
            }}
          />
          {form.errors.description && (
            <div className="text-red-500 text-xs mt-1">
              {form.errors.description}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          {/* Save as Draft Button */}
          {draftLoading ? (
            <Button color="blue.4" variant="light">
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </Button>
          ) : (
            <Button 
              type="button" 
              color="blue.4" 
              variant="outline"
              onClick={handleSaveAsDraft}
            >
              Save as Draft
            </Button>
          )}

          {/* Post/Publish Button */}
          {loading ? (
            <Button color="blue.4" variant="light">
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" color="blue.4" variant="light">
              {publishLabel}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostJob;
