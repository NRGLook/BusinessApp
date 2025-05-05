import React from "react";

export const Input = ({ className = "", ...props }) => {
    return (
        <input
            {...props}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
    );
};
