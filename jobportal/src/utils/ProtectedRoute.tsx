import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'student' | 'employer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user } = useSelector((store: any) => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            if (role === 'student' && user.role === 'employer') {
                navigate("/companies");
            } else if (role === 'employer' && user.role === 'student') {
                navigate("/");
            }
        }
    }, [user, navigate, role]);

    return user?.role === role ? <>{children}</> : null;
};

export default ProtectedRoute;