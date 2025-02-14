import React, { createContext } from "react";

interface PageContextProps {
    page: string;
    setPage: (page: string) => void;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [page, setPage] = React.useState<string>("Home");

    return (
        <PageContext.Provider value={{ page, setPage }}>
            {children}
        </PageContext.Provider>
    )
}

const usePage = () => {
    const context = React.useContext(PageContext);
    if (!context) {
        throw new Error("usePage must be used within a PageProvider");
    }
    return context;
}

export { PageProvider, usePage };

interface PopupContextProps {
    showPopup: (content: React.ReactNode) => void;
    hidePopup: () => void;
    popupContent?: React.ReactNode;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [popupContent, setPopupContent] = React.useState<React.ReactNode | null>(null);

    const showPopup = (content: React.ReactNode) => {
        setPopupContent(content);
    }

    const hidePopup = () => {
        setPopupContent(null);
    }

    return (
        <PopupContext.Provider value={{ showPopup, hidePopup, popupContent }}>
            {children}
        </PopupContext.Provider>
    );
};

const usePopup = () => {
    const context = React.useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
}

export { PopupProvider, usePopup };