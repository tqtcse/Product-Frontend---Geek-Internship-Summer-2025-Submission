import { Link, useLocation } from 'react-router-dom';
import { User, List } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import white from '../../../assets/white.png'
type SideNavProps = {
    collapsed: boolean;
    toggleCollapse: () => void;
};

const SideNav = ({ collapsed, toggleCollapse }: SideNavProps) => {
    const location = useLocation();
    const navItems = [
        { label: 'Albums', icon: <List size={20} />, to: '/albums' },
        { label: 'Users', icon: <User size={20} />, to: '/users' },
    ];

    return (
        <div
            className={`sticky top-0 h-screen bg-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}
        >
            <div className="p-4">
                <nav className="flex flex-col gap-1">
                    <div>
                        <Link to="/" className="flex items-center mb-6">
                            <img
                                src={`${collapsed ? white : white}`}
                                alt="Geek Up Logo"
                                className={`transition-all duration-300 ${collapsed
                                    ? 'ml-2 h-10 w-30 max-w-[200px] overflow-visible'
                                    : 'h-10 w-30 '
                                    }`}
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
                                {!collapsed && (
                                    <span
                                        className={`ml-3 transition duration-200 font-roboto group-hover:text-blue-500 ${isActive ? 'text-blue-500' : 'text-black'}`}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                    onClick={toggleCollapse}
                    className="cursor-pointer group p-2 rounded transition-colors "
                >
                    {collapsed ? (
                        <ChevronRight className=" text-blue-500 transition-colors" />
                    ) : (
                        <ChevronLeft className="text-blue-500 transition-colors" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default SideNav;