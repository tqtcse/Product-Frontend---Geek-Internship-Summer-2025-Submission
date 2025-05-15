import { useParams, useNavigate, useLocation } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import { Eye } from "lucide-react";

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface Album {
    userId: number;
    id: number;
    title: string;
}




const USERS_API = "https://jsonplaceholder.typicode.com/users";
const ALBUMS_API = "https://jsonplaceholder.typicode.com/albums";

const UserShow = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [user, setUser] = useState<User | null>(null); // State để lưu user
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch user
                const userResponse = await axios.get<User>(`${USERS_API}/${id}`);
                setUser(userResponse.data);

                // Fetch albums
                const albumResponse = await axios.get<Album[]>(`${ALBUMS_API}`);
                const userAlbums = albumResponse.data.filter(
                    (album) => album.userId === Number(id)
                );
                setAlbums(userAlbums);
            } catch (err) {
                setError("Failed to fetch user or albums.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

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
            },
        },
    };

    const hslToHex = (h: number, s: number, l: number) => {
        s /= 100;
        l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) =>
            Math.round(
                255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
            );
        return `#${[f(0), f(8), f(4)]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("")}`;
    };

    const generateAvatarColor = (name: string) => {
        const initials = name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
        const hash = [...initials].reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
        );
        const hue = hash % 360;
        const saturation = 70;
        const lightness = 60;
        const backgroundColor = hslToHex(hue, saturation, lightness);
        const textColor = lightness > 50 ? "1F2937" : "FFFFFF";
        return { backgroundColor, textColor };
    };

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    if (error || !user) return <div>{error || "User not found"}</div>;

    const { backgroundColor, textColor } = generateAvatarColor(user.name);

    const columns: TableColumn<Album>[] = [
        {
            id: "albumId",
            name: "ID",
            width: "10%",
            selector: (row) => row.id,
        },
        {
            name: "Title",
            width: "50%",
            selector: (row) => row.title,
        },
        {
            name: "Actions",
            width: "40%",
            cell: (row) => (
                <button
                    onClick={() => navigate(`/albums/${row.id}`, {
                        state: { from: location },
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
    ];

    return (
        <div>
            <div className="flex flex-col items-center">
                <div className="w-full max-w-[90%] mx-auto">
                    <div className="text-left mb-4">
                        <div className="flex items-center gap-1">
                            <User size={16} />
                            <button
                                onClick={() => navigate("/users")}
                                className="flex cursor-pointer !text-gray-500 hover:bg-gray-300 p-1 rounded"
                            >
                                Users
                            </button>{" "}
                            <span>/ Show</span>
                        </div>
                        <div className="flex items-center gap-6 text-xl font-bold mt-2">
                            <button
                                onClick={() => navigate("/users")}
                                className="flex items-center"
                            >
                                <ArrowLeft className="w-6 h-6 cursor-pointer" />
                            </button>
                            Show User
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="border-gray-200 border-1 rounded-lg p-4">
                            <div className="space-y-6">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.name
                                            )}&background=${backgroundColor.replace(
                                                "#",
                                                ""
                                            )}&color=${textColor.replace("#", "")}`}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <span
                                                onClick={() => navigate(`/users/${user.id}`)}
                                                className="text-blue-600 hover:text-blue-400 cursor-pointer font-medium"
                                            >
                                                {user.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm text-blue-600 hover:text-blue-400 cursor-pointer ml-16">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200"></div>

                                <div>
                                    <h1 className="text-xl font-bold font-sans mb-2">Albums</h1>
                                </div>
                                <div>
                                    <DataTable
                                        columns={columns}
                                        data={albums}
                                        progressPending={loading}
                                        highlightOnHover
                                        pointerOnHover
                                        customStyles={customStyles}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserShow;