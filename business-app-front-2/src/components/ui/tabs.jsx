import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext();

export const Tabs = ({ value: controlledValue, onValueChange, children }) => {
    const [internalValue, setInternalValue] = useState(controlledValue || "");
    const value = controlledValue ?? internalValue;
    const setValue = onValueChange ?? setInternalValue;

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div>{children}</div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className = "" }) => (
    <div className={`flex gap-2 mb-4 ${className}`}>{children}</div>
);

export const TabsTrigger = ({ value, children }) => {
    const { value: activeTab, setValue } = useContext(TabsContext);
    const isActive = value === activeTab;

    return (
        <button
            onClick={() => setValue(value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-black"
            }`}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ value, children }) => {
    const { value: activeTab } = useContext(TabsContext);
    return activeTab === value ? <div>{children}</div> : null;
};
