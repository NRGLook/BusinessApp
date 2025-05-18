import React from "react";

export const Button = ({ className = "", children, ...props }) => {
    return (
        <button
            {...props}
            className={`w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition ${className}`}
        >
            {children}
        </button>
    );
};
