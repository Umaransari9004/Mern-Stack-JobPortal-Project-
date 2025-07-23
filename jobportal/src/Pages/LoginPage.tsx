import { Divider } from "@mantine/core";
import React from "react";

import Login from "../Components/SignupLogin/Login.tsx";

const LoginPage = () => {
    return (
        <div className="min-h-[90vh] bg-white font-['poppins']">
            <Divider size="xs" mx="md" />
         <Login/>
        </div>
      )
}

export default LoginPage;