import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import PhotoViewerModal from "../../components/albums/PhotoViewerModal";
import { Eye } from "lucide-react";
import { List } from "lucide-react";

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

interface Photo {
    id: number;
    title: string;
    thumbnailUrl: string;
    url: string;
}


const ALBUMS_API = "https://jsonplaceholder.typicode.com/albums";
const USERS_API = "https://jsonplaceholder.typicode.com/users";


const AlbumShow = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [album, setAlbum] = useState<Album | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Avatar color generation (copied from AlbumList)
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);


                const albumResponse = await axios.get<Album>(`${ALBUMS_API}/${id}`);
                setAlbum(albumResponse.data);
                console.log(albumResponse.data)
                const [userResponse, photosResponse] = await Promise.all([
                    axios.get<User>(`${USERS_API}/${albumResponse.data.userId}`),
                    axios.get<Photo[]>(`${ALBUMS_API}/${id}/photos`),
                ]);

                setUser(userResponse.data);
                setPhotos(photosResponse.data.slice(0, 10));
            } catch (err) {
                setError("Failed to fetch album, user, or photos.");
                console.error(err);
            } finally {

                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );

    if (error || !album || !user) {
        return (
            <div className="flex flex-col items-center">
                <div className="w-full max-w-[90%] mx-auto">
                    <p className="text-red-600">{error || "Album or user not found."}</p>
                </div>
            </div>
        );
    }

    const { backgroundColor, textColor } = generateAvatarColor(user.name);

    return (
        <div>


            <div className="flex flex-col items-center">
                <div className="w-full max-w-[90%] mx-auto">

                    <div className="text-left mb-4">
                        <div className="flex items-center gap-1 ">
                            <List size={16} />
                            <button
                                onClick={() => {
                                    if (location.state?.from) {
                                        const query = new URLSearchParams(location.search);
                                        const currentSize = query.get("pageSize") || "10";
                                        navigate(`/albums?page=1&pageSize=${currentSize}`);
                                    } else {
                                        navigate("/albums");
                                    }
                                }}
                                className="flex cursor-pointer !text-gray-500 hover:bg-gray-300 p-1 rounded"
                            >
                                Albums</button> <span>/ Show</span>
                        </div>
                        <div className="flex items-center gap-6 text-xl font-bold mt-2 ">
                            <button
                                onClick={() => {
                                    if (location.state?.from) {
                                        navigate(location.state.from);
                                    } else {
                                        navigate("/albums");
                                    }
                                }}
                                className="flex items-center  "
                            >
                                <ArrowLeft className="w-6 h-6 cursor-pointer" />
                            </button>
                            Show Album
                        </div>
                    </div>
                    <div className=" bg-white p-6 rounded-lg shadow-md">
                        <div className="border-gray-200 border-1 rounded-lg p-4">
                            <div className="space-y-6">
                                <div className="flex flex-col">

                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${backgroundColor.replace("#", "")}&color=${textColor.replace("#", "")}`}
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
                                        <p className=" text-sm text-blue-600 hover:text-blue-400 cursor-pointer ml-16">{user.email}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200"></div>

                                <div>
                                    <h1 className="text-xl font-bold font-sans mb-2">{album.title}</h1>

                                </div>


                                <div>

                                    {photos.length === 0 ? (
                                        <p className="text-gray-600">No photos found.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                            {photos.map((photo, idx) => (
                                                <a
                                                    key={photo.id}
                                                    onClick={() => {
                                                        setCurrentIndex(idx);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="relative group block cursor-pointer rounded overflow-hidden"
                                                >
                                                    <img src={photo.thumbnailUrl} alt={photo.title} className="w-full h-auto" />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-80 flex items-center justify-center text-white transition gap-2">
                                                        <Eye />
                                                        Preview
                                                    </div>
                                                </a>
                                            ))}

                                            {isModalOpen && (
                                                <PhotoViewerModal
                                                    photoList={photos}
                                                    currentIndex={currentIndex}
                                                    onClose={() => setIsModalOpen(false)}
                                                />
                                            )}

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    );
};

export default AlbumShow;