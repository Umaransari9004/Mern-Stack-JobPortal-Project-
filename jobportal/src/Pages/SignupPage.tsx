import { Divider } from "@mantine/core";
import React from "react";
import Signup from "../Components/SignupLogin/Signup.tsx";

const SignupPage = () => {
    return (
        <div className="min-h-[90vh] bg-white font-['poppins'] ">
            <Divider size="xs" mx="md" />
         <Signup/>
        </div>
      )
}

export default SignupPage;
