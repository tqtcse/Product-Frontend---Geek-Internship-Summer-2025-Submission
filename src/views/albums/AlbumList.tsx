import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import CustomPagination from "../../components/albums/CustomPagination";
import { Eye } from "lucide-react";

const ALBUMS_API = "https://jsonplaceholder.typicode.com/albums";
const USERS_API = "https://jsonplaceholder.typicode.com/users";

interface Album {
    userId: number;
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

const AlbumList = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [pagedData, setPagedData] = useState<Album[]>([]);
    const [perPage, setPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const fetchData = async () => {
            const [albumRes, userRes] = await Promise.all([
                axios.get<Album[]>(ALBUMS_API),
                axios.get<User[]>(USERS_API),
            ]);

            const userMap: Record<number, User> = {};
            userRes.data.forEach((user) => {
                userMap[user.id] = user;
            });

            setAlbums(albumRes.data);
            setUsers(userMap);
            setLoading(false);
        };

        fetchData();
    }, []);


    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const page = parseInt(query.get("page") || "1");
        const size = parseInt(query.get("pageSize") || "10");

        setCurrentPage(page);
        setPerPage(size);

        const start = (page - 1) * size;
        const end = page * size;
        setPagedData(albums.slice(start, end));
    }, [location.search, albums]);

    const handleChangePage = (newPage: number) => {
        navigate(`?page=${newPage}&pageSize=${perPage}`);
    };


    const handleChangeRowsPerPage = (newPerPage: number, page: number) => {
        navigate(`?page=${page}&pageSize=${newPerPage}`);
    };

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

    const columns: TableColumn<Album>[] = [
        {
            name: "ID",
            selector: row => row.id,

            width: "6%",
        },
        {
            name: "Title",
            selector: row => row.title,
            width: "47%",
        },
        {
            name: "User",
            selector: row => row.userId,
            wrap: true,
            width: "23.5%",
            cell: (row) => {
                const user = users[row.userId];
                if (!user) return null;
                const { backgroundColor, textColor } = generateAvatarColor(user.name);
                return (
                    <div
                        onClick={() => navigate(`/users/${user.id}`)}
                        className="flex items-center gap-2 cursor-pointer hover:underline text-blue-600"
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${backgroundColor.replace("#", "")}&color=${textColor.replace("#", "")}`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                        />
                        <span>{user.name}</span>
                    </div>
                );
            },
        },
        {
            name: "Actions",
            width: "23.5%",
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
        <div className="flex flex-col items-center">
            <div className="w-full max-w-[90%] ">
                <DataTable
                    columns={columns}
                    data={pagedData}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationPerPage={perPage}
                    paginationTotalRows={albums.length}
                    paginationDefaultPage={currentPage}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    paginationRowsPerPageOptions={[10, 20, 50, 100]}
                    paginationComponent={CustomPagination}
                    customStyles={customStyles}
                    highlightOnHover
                />
            </div>
        </div>
    );
};

export default AlbumList;
