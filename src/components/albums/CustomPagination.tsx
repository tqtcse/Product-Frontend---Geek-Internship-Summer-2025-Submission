import React, { useRef, useEffect } from "react";
import type { PaginationComponentProps } from "react-data-table-component";
import { Combobox } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

const CustomPagination: React.FC<PaginationComponentProps> = ({
    rowsPerPage,
    rowCount,
    onChangePage,
    currentPage,
    onChangeRowsPerPage,
}) => {
    const pageCount = Math.ceil(rowCount / rowsPerPage);
    const pageSizeOptions = [10, 20, 50, 100];
    const [query, setQuery] = React.useState("");
    const [selectedSize, setSelectedSize] = React.useState(rowsPerPage);
    const comboboxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null!);

    const [showDisplayValue, setShowDisplayValue] = React.useState(true);
    useEffect(() => {
        setSelectedSize(rowsPerPage);
    }, [rowsPerPage]);

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const pages: number[] = [];
        let startPage: number, endPage: number;

        if (pageCount <= maxPagesToShow) {
            startPage = 1;
            endPage = pageCount;
        } else {
            const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
            const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;

            if (startPage < 1) {
                startPage = 1;
                endPage = maxPagesToShow;
            }
            if (endPage > pageCount) {
                endPage = pageCount;
                startPage = pageCount - maxPagesToShow + 1;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        const result: (number | string)[] = [];
        if (startPage > 1) {
            result.push(1);
            if (startPage > 2) result.push("left-ellipsis");
        }
        result.push(...pages);
        if (endPage < pageCount) {
            if (endPage < pageCount - 1) result.push("right-ellipsis");
            result.push(pageCount);
        }

        return result;
    };

    const handleEllipsisClick = (direction: "left" | "right") => {
        let targetPage: number;
        if (direction === "right") {
            targetPage = Math.min(currentPage + 5, pageCount);
        } else {
            targetPage = Math.max(currentPage - 5, 1);
        }
        onChangePage(targetPage, rowsPerPage);
    };


    const filteredOptions =
        query === ""
            ? pageSizeOptions
            : pageSizeOptions.filter((size) =>
                size.toString().includes(query)
            );


    const handleInputClick = () => {
        setQuery("");
        setShowDisplayValue(false);
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.focus();
        }
    };
    const handleInputBlur = () => {
        if (!query) {
            setShowDisplayValue(true);
        }
    };
    return (
        <div className="flex justify-end items-center px-4 py-2 space-x-4">
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onChangePage(currentPage - 1, rowsPerPage)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-200 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {"<"}
                </button>

                {getPageNumbers().map((page, index) =>
                    page === "left-ellipsis" || page === "right-ellipsis" ? (
                        <button
                            key={`ellipsis-${index}`}
                            onClick={() =>
                                handleEllipsisClick(page === "left-ellipsis" ? "left" : "right")
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer group"
                        >
                            <span className="group-hover:hidden">...</span>
                            <span className="hidden group-hover:block">
                                {page === "left-ellipsis" ? "<<" : ">>"}
                            </span>
                        </button>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onChangePage(page as number, rowsPerPage)}
                            className={`px-3 py-1 rounded cursor-pointer ${page === currentPage
                                ? "bg-white border border-blue-500 text-blue-500 font-bold"
                                : "text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onChangePage(currentPage + 1, rowsPerPage)}
                    disabled={currentPage === pageCount}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-200 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {">"}
                </button>
            </div>

            <div className="relative" ref={comboboxRef}>
                <Combobox value={selectedSize} onChange={(value) => {
                    if (value) {
                        setSelectedSize(value);
                        onChangeRowsPerPage(value, currentPage);

                        setShowDisplayValue(true);
                        setQuery("");
                        inputRef.current?.blur();
                    }
                }}>
                    {({ open }) => (
                        <>
                            <Combobox.Button className="relative w-32">
                                <Combobox.Input
                                    className="w-full border border-gray-300 px-3 py-1 rounded bg-white text-gray-600 font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(event) => setQuery(event.target.value)}
                                    displayValue={(size: number) => (showDisplayValue && size ? `${size} / page` : "")}
                                    placeholder={selectedSize ? `${selectedSize} / page` : "Select size"}
                                    onClick={handleInputClick}
                                    onBlur={handleInputBlur}
                                    ref={(el) => {
                                        inputRef.current = el;
                                    }}
                                />
                                <ChevronUpIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </Combobox.Button>

                            {open && (
                                <Combobox.Options className="absolute bottom-full mb-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                                    {filteredOptions.length === 0 && query !== "" ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                            Không tìm thấy.
                                        </div>
                                    ) : (
                                        filteredOptions.map((size) => (
                                            <Combobox.Option
                                                key={size}
                                                value={size}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 px-4 ${active ? " text-blue-600" : "text-gray-900"}`
                                                }
                                            >
                                                {({ selected }) => (
                                                    <span
                                                        className={`block truncate ${selected ? "font-medium text-blue-600" : "font-normal"}`}
                                                    >
                                                        {size} / page
                                                    </span>
                                                )}
                                            </Combobox.Option>
                                        ))
                                    )}
                                </Combobox.Options>
                            )}
                        </>
                    )}
                </Combobox>

            </div>
        </div>
    );
};

export default CustomPagination;