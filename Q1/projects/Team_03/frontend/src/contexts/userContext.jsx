import { createContext, useState, useEffect } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserProfile = async () => {
    try {
        const res = await axios.get("/api/users/profile", {withCredentials: true});
        return res.data;
    } catch (err) {
        console.error(err.response?.data || err.message);
        return null;
    }
    };
    // fetch user on page load
    useEffect(() => {
        const fetchUser = async () => {
        const userData = await getUserProfile();
        console.log(userData);
        setUser(userData);
        setLoading(false);
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value = {{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
