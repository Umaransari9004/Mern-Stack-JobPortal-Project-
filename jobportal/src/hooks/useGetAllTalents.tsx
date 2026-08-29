import axios from "axios";
import { useEffect, useState } from "react";
// Adjust import path as needed when copying to main project
import { USER_API_END_POINT } from "../utils/constant.js"; 

const useGetAllTalents = (searchQuery = "", locationFilter = "", page = 1) => {
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

    useEffect(() => {
        const fetchTalents = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${USER_API_END_POINT}/talents`, {
                    params: {
                        keyword: searchQuery,
                        location: locationFilter,
                        page
                    },
                    withCredentials: true
                });

                if (res.data.success) {
                    setTalents(res.data.talents);
                    setPagination({
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages
                    });
                }
            } catch (err) {
                console.error(err);
                setError(err instanceof axios.AxiosError ? err.response?.data?.message || "Failed to fetch talents" : "Failed to fetch talents");
            } finally {
                setLoading(false);
            }
        };

        fetchTalents();
    }, [searchQuery, locationFilter, page]);

    return { talents, loading, error, pagination };
};

export default useGetAllTalents;
