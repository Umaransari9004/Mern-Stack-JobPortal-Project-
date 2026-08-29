import axios from "axios";
import { useEffect, useState } from "react";
import { USER_API_END_POINT } from "../utils/constant"; 

const useGetTalentById = (talentId: string | undefined) => {
    const [talent, setTalent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTalent = async () => {
            if (!talentId) return;
            
            setLoading(true);
            try {
                const res = await axios.get(`${USER_API_END_POINT}/talents/${talentId}`, {
                    withCredentials: true
                });

                if (res.data.success) {
                    setTalent(res.data.talent);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to fetch talent profile");
            } finally {
                setLoading(false);
            }
        };

        fetchTalent();
    }, [talentId]);

    return { talent, loading, error };
};

export default useGetTalentById;
