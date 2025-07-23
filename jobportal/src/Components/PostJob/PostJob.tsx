import { Button, Select, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextEditor from "./TextEditer.tsx";
import { notifications } from "@mantine/notifications";
import { JOB_API_END_POINT } from "../../utils/constant.js";
import { content } from "../../Data/PostJob.tsx";
import { IconLoader2 } from "@tabler/icons-react";
import useGetAllCompanies from "../../hooks/useGetAllCompanies.tsx";

const PostJob = () => {
  const form = useForm({
    initialValues: {
      jobTitle: "",
      companyId: "",
      experience: "",
      jobType: "",
      location: "",
      salary: "",
      skills: "",
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
      skills: isNotEmpty("Skills are required"),
      about: isNotEmpty("About the job is required"),
      description: (value) =>
        !value || value === "<p></p>" ? "Job description is required" : null,
    },
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useGetAllCompanies(); // Fetch companies when component mounts
  const { companies } = useSelector((store: any) => store.company);

  const handlePost = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        notifications.show({
          title: "Job Created Successfully",
          message: res.data.message,
          withBorder: true,
          className: "!border-blue-500",
        });
        navigate("/jobs-Table");
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        message: (error.response.data.message),
        color: "red",
        withBorder: true,
        className: "!border-red-500",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-16 bs-mx:px-5 py-5">
      <div className="text-2xl font-semibold">Post a Job</div>
      {companies.length === 0 && (
        <p className="text-xs text-red-600 font-bold my-3">
          *Please register a company first, before posting a job
        </p>
      )}

      <form onSubmit={form.onSubmit(handlePost)} className="flex flex-col gap-5 mt-8">
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
            data={companies.map((company) => ({
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

        <TextInput
          withAsterisk
          label="Skills"
          placeholder="Enter Skills (comma separated, e.g., JavaScript, React, Node.js)"
          {...form.getInputProps("skills")}
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
            <div className="text-red-500 text-xs mt-1">{form.errors.description}</div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          {loading ? (
            <Button color="blue.4" variant="light">
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" color="blue.4" variant="light" >
              Post Job
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostJob;

