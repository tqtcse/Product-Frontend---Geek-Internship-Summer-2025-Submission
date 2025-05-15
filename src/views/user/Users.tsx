import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import { Eye } from "lucide-react";


const USERS_API = "https://jsonplaceholder.typicode.com/users";


interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;

}





const Users = () => {
    const [users, setUsers] = useState<Record<number, User>>({});

    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const location = useLocation();

    const customStyles = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "16px",
                color: "#1F2937",
                backgroundColor: "rgb(244, 247, 247)",


            },
            highlightOnHoverStyle: {
                backgroundColor: "#f3f4f6",
                borderBottomColor: "#e5e7eb",
                outline: "none",
            },
        },

        rows: {
            style: {
                minHeight: "10vh",
                fontSize: "14px",
            }
        },
    };

    const hslToHex = (h: number, s: number, l: number) => {
        s /= 100;
        l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) =>
            Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
        return `#${[f(0), f(8), f(4)]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("")}`;
    };

    const generateAvatarColor = (name: string) => {
        const initials = name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
        const hash = [...initials].reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        const saturation = 70;
        const lightness = 60;
        const backgroundColor = hslToHex(hue, saturation, lightness);
        const textColor = lightness > 50 ? "1F2937" : "FFFFFF";
        return { backgroundColor, textColor };
    };

    useEffect(() => {
        const fetchData = async () => {
            const [userRes] = await Promise.all([

                axios.get<User[]>(USERS_API),
            ]);

            const userMap: Record<number, User> = {};
            userRes.data.forEach((user) => {
                userMap[user.id] = user;
            });


            setUsers(userMap);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );



    const columns: TableColumn<User>[] = [
        {
            name: "ID",
            selector: row => row.id,
            width: "6%",
        },
        {
            name: "Avatar",
            selector: row => row.id,
            width: "8%",
            cell: (row) => {
                const user = users[row.id];
                if (!user) return null;
                const { backgroundColor, textColor } = generateAvatarColor(user.name);
                return (
                    <div

                        className="flex items-center gap-2 hover:underline text-blue-600"
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${backgroundColor.replace("#", "")}&color=${textColor.replace("#", "")}`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                        />

                    </div>
                );
            },
        },
        {
            name: "Name",
            selector: row => row.name,
            width: "15%",

        },
        {
            name: "Email",
            selector: row => row.email,
            width: "20%",
            cell: (row) => (
                <a
                    href={`mailto:${row.email}`}
                    className="text-blue-600 font-medium hover:text-blue-400"
                >
                    {row.email}
                </a>
            ),
        },
        {
            name: "Phone",
            cell: (row) => (
                <a
                    href={`tel:${row.phone}`}
                    className="text-blue-600 font-medium hover:text-blue-400"
                >
                    {row.phone}
                </a>
            ),
            width: "20%",
        },
        {
            name: "Website",

            cell: (row) => (
                <span className="text-blue-600 font-medium cursor-pointer hover:text-blue-300" onClick={() => window.open(`https://${row.website}`, '_blank')}>
                    {row.website}
                </span>
            ),
            width: "15%",
        },
        {
            name: "Actions",
            width: "16%",
            cell: (row) => (
                <button
                    onClick={() => navigate(`/users/${row.id}`, {
                        state: { from: location, user: row }

                    })}
                    className="group flex items-center gap-2 border-1 border-gray-300 hover:border-blue-500 px-3 py-1 rounded transition cursor-pointer"
                >
                    <Eye className="w-4 h-4 group-hover:text-blue-500 transition" />
                    <span className="group-hover:text-blue-500 transition">Show</span>
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ]

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-[90%] ">
                <DataTable
                    columns={columns}
                    data={Object.values(users)}
                    customStyles={customStyles}
                    progressPending={loading}
                    highlightOnHover
                />
            </div>
        </div>
    )
};

export default Users;


