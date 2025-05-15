import { Routes, Route, Navigate } from "react-router-dom";
import AlbumList from "./albums/AlbumList";
import Users from "./user/Users";
import AlbumShow from "./albums/AlbumShow";
import UserShow from "./user/UserShow";

const Views = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/albums" replace />} />
            <Route path="/albums" element={<AlbumList />} />
            <Route path="/users" element={<Users />} />
            <Route path="/albums/:id" element={<AlbumShow />} />
            <Route path="/users/:id" element={<UserShow />} />
        </Routes>
    );
};

export default Views;


