import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'student' | 'employer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user } = useSelector((store: any) => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (role) {
            if (role === 'student' && user.role === 'employer') {
                navigate("/companies");
            } else if (role === 'employer' && user.role === 'student') {
                navigate("/");
            }
        }
    }, [user, navigate, role]);

    if (!user) return null;
    if (role && user.role !== role) return null;
    
    return <>{children}</>;
};

export default ProtectedRoute;