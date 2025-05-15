import type { CommonProps } from "../../../@types/common";

const TopBar = ({ children }: CommonProps) => {
    return (
        <div className="top-bar  h-[70px] sticky top-0 z-50 bg-white">
            {children}

        </div>
    );
};

export default TopBar;
