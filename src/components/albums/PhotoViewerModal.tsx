import { useState } from "react";
import {
    X, ChevronLeft, ChevronRight, RotateCw, RotateCcw, ZoomIn, ZoomOut, FlipHorizontal,
    FlipVertical,
} from "lucide-react";

interface Photo {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

interface PhotoViewerModalProps {
    photoList: Photo[];
    currentIndex: number;
    onClose: () => void;
}

export default function PhotoViewerModal({ photoList, currentIndex, onClose }: PhotoViewerModalProps) {
    const [index, setIndex] = useState(currentIndex);
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [flipY, setFlipY] = useState(false);
    const [flipX, setFlipX] = useState(false);

    const photo = photoList[index];

    const rotateLeft = () => setRotation((r) => r - 90);
    const rotateRight = () => setRotation((r) => r + 90);
    const flipVertical = () => setFlipY((v) => !v);
    const zoomIn = () => setScale((s) => Math.min(s + 2, 20));
    const zoomOut = () => setScale((s) => Math.max(s - 2, 0.5));


    return (


        <div className="fixed inset-0 flex items-center justify-center z-150" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>

            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-800 hover:text-red-600 cursor-pointer"
            >
                <X size={28} />
            </button>
            <div className="flex items-center justify-center h-[400px]">
                <img
                    src={photo.url}

                    style={{
                        transform: `
                        rotate(${rotation}deg)
                        scale(${scale})
                        ${flipY ? "scaleY(-1)" : ""}
                        ${flipX ? "scaleX(-1)" : ""}
                    `,
                        transition: "transform 0.3s",
                        maxHeight: "100%",
                        maxWidth: "100%",
                    }}
                />
            </div>
            <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 text-gray-200  ">
                {index + 1} / {photoList.length}
            </div>
            <div className="absolute bottom-10">
                <div className="flex justify-center gap-8 mt-4 flex-wrap p-2 rounded-2xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <button onClick={flipVertical} className="btn-control cursor-pointer"><FlipVertical /></button>
                    <button onClick={() => setFlipX((v) => !v)} className="btn-control cursor-pointer"><FlipHorizontal /></button>

                    <button onClick={rotateLeft} className="btn-control cursor-pointer"><RotateCcw /></button>
                    <button onClick={rotateRight} className="btn-control cursor-pointer"><RotateCw /></button>

                    <button
                        onClick={zoomIn}
                        disabled={scale >= 20}
                        className={`btn-control ${scale >= 20 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        <ZoomIn />
                    </button>
                    <button
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                        className={`btn-control ${scale <= 0.5 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        <ZoomOut />
                    </button>


                </div>
            </div>

            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <button
                    disabled={index === 0}
                    onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                    className={`text-white ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-400 cursor-pointer'}`}
                >
                    <ChevronLeft size={36} />
                </button>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                    disabled={index === photoList.length - 1}
                    onClick={() => setIndex((i) => Math.min(i + 1, photoList.length - 1))}
                    className={`text-white ${index === photoList.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-gray-400 cursor-pointer'}`}
                >
                    <ChevronRight size={36} />
                </button>
            </div>

        </div>
    );
}
