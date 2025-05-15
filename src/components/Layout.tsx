// import TopBar from "./layouts/components/TopBar";
import type { CommonProps } from "../@types/common";
import TopBar from "./layouts/components/TopBar";
import SideNav from "./layouts/components/SideNav";
import SideNavMobile from "./layouts/components/SideNavMobile";
import { useState } from "react";
import geek from "../assets/geek2.png"
import { List } from "lucide-react";


const Layouts = ({ children }: CommonProps) => {

    const [collapsed, setCollapsed] = useState(false)
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [showButton, setShowButton] = useState(true);

    const openMenu = () => {
        setShowMobileNav(true);
        setShowButton(false);
    };

    const closeMenu = () => {
        setShowMobileNav(false);
        setShowButton(false);
        setTimeout(() => {
            setShowButton(true);
        }, 200);
    };

    return (
        <div className="app-layout flex flex-col">
            <SideNavMobile isOpen={showMobileNav} onClose={closeMenu} />
            <div className="flex  min-w-0">
                <div className="fixed left top-9 -translate-y-1/2 z-50 pointer-events-none z-100">
                    <img
                        src={geek}
                        alt="Geek Up Logo"
                        className={`transition-all duration-300 ${collapsed
                            ? 'ml-6 h-10 w-30 max-w-[200px] lg:block hidden'
                            : 'ml-4 h-10 w-30 lg:block hidden'
                            }`}
                    />
                </div>
                {showButton && (
                    <div className="lg:hidden fixed top-17 left- z-100">
                        <button
                            onClick={openMenu}
                            className=" bg-white text-white px-3 py-2 rounded-md border-gray-300 border-1 cursor-pointer hover:border-blue-500 hover:border-1"
                        >
                            <List size={22} />
                        </button>
                    </div>
                )}


                <div className="hidden lg:block">
                    <SideNav collapsed={collapsed} toggleCollapse={() => setCollapsed(!collapsed)} />
                </div>

                <div className="flex flex-col min-w-0 w-full">
                    <TopBar />
                    <div className="h-full flex flex-auto flex-col bg-gray-100 pt-6">
                        {children}
                    </div>
                </div>

            </div>


        </div>
    );
};

export default Layouts;
