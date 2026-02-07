"use client";

import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
}

export const Button = ({ children }: ButtonProps) => {
    return (
        <button onClick={() => { alert('you clicked') }} type="button" className="ui:text-white ui:bg-gray-800 ui:hover:bg-gray-900 ui:focus:outline-none ui:focus:ring-4 ui:focus:ring-gray-300 ui:font-medium ui:rounded-lg ui:text-sm ui:px-5 ui:py-2.5 ui:me-2 ui:mb-2">
            {children}
        </button>

    );
};