import clsx from "clsx";
import geek from "../../../assets/geek2.png"
import { Link, useLocation } from "react-router-dom";
import { User, List } from 'lucide-react';
interface SideNavMobileProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideNavMobile = ({ isOpen, onClose }: SideNavMobileProps) => {
    const location = useLocation();
    const navItems = [
        { label: 'Albums', icon: <List size={20} />, to: '/albums' },
        { label: 'Users', icon: <User size={20} />, to: '/users' },
    ];

    return (
        <div
            className={clsx(
                "fixed inset-0 z-90 transition-all duration-300",
                {
                    "pointer-events-none opacity-0": !isOpen,
                    "pointer-events-auto opacity-100": isOpen,
                }
            )}
        >
            {isOpen && (
                <div
                    className="absolute inset-0"
                    onClick={onClose}
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                />
            )}

            <div
                className={clsx(
                    "fixed top-0 left-0 h-full w-58 bg-white shadow-lg z-60 transform transition-transform duration-300",
                    {
                        "-translate-x-full": !isOpen,
                        "translate-x-0": isOpen,
                    }
                )}
            >
                <div className="p-4">
                    <div>
                        <Link to="/" className="flex items-center mb-6">
                            <img
                                src={geek}
                                alt="Geek Up Logo"
                                className={`transition-all duration-300
                                    ml-2 h-10 w-30 max-w-[200px] overflow-visible
                                    
                                    `}
                            />
                        </Link>
                    </div>
                    {navItems.map((item, index) => {
                        const isActive = location.pathname.startsWith(item.to);
                        return (
                            <Link
                                key={index}
                                to={item.to}
                                className={`flex items-center py-3 px-4 transition-colors group hover:text-blue-500 ${isActive ? 'bg-blue-100 rounded-lg' : 'text-gray-200'}`}
                            >
                                <span
                                    className={`group-hover:text-blue-500 ${isActive ? 'text-blue-500' : 'text-black'}`}
                                >
                                    {item.icon}
                                </span>

                                <span
                                    className={`ml-3 transition duration-200 font-roboto group-hover:text-blue-500 ${isActive ? 'text-blue-500' : 'text-black'}`}
                                >
                                    {item.label}
                                </span>

                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideNavMobile;
