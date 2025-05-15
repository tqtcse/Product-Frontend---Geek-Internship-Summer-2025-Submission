import { Combobox } from '@headlessui/react'
import { useState } from 'react'

const pageSizes = [10, 20, 50, 100]

type PageSizeSelectorProps = {
    rowsPerPage: number;
    onChangeRowsPerPage: (newPageSize: number, currentPage: number) => void;
    currentPage: number;
}

export default function PageSizeSelector({ rowsPerPage, onChangeRowsPerPage, currentPage }: PageSizeSelectorProps) {
    const [query, setQuery] = useState(rowsPerPage.toString())

    const filteredSizes =
        query === ''
            ? pageSizes
            : pageSizes.filter((size) =>
                size.toString().includes(query)
            )

    return (
        <div className="w-40">
            <Combobox
                value={query}
                onChange={(value) => {
                    if (value !== null) {
                        setQuery(value.toString())
                        onChangeRowsPerPage(Number(value), currentPage)
                    }
                }}
            >
                <div className="relative">
                    <Combobox.Input
                        className="w-full border border-gray-300 px-3 py-1 rounded bg-white text-gray-600 font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(value: string | null) => value ?? ''}
                        placeholder="Rows per page"
                    />
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredSizes.map((size) => (
                            <Combobox.Option
                                key={size}
                                value={size}
                                className={({ active }) =>
                                    `relative cursor-default select-none px-4 py-2 ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-900'
                                    }`
                                }
                            >
                                {size} / page
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    )
}
