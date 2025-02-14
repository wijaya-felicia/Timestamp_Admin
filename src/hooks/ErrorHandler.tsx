import { createContext, useContext } from 'react';
import { AuthError, InvalidError, NetworkError } from '../utils/AppError';
import { usePopup } from './Context';
import { AlertPopup } from '../components/Popup';
import { useNavigate } from 'react-router-dom';

type HandleErrorType = NetworkError | InvalidError | AuthError;

interface ErrorHandlerContextProps {
    handleError: (error: HandleErrorType) => void;
}

const ErrorHandlerContext = createContext<ErrorHandlerContextProps | undefined>(undefined);

const ErrorHandlerProvider : React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { showPopup, hidePopup } = usePopup();
    const navigate = useNavigate();

    const handleError = (error: HandleErrorType) => {
        if (error instanceof NetworkError) {
            showPopup( <>
                <AlertPopup message={"Internet connection unavailable, please check your internet connection"} onConfirm={hidePopup} />
            </>)
        }
    
        if (error instanceof InvalidError) {
            showPopup( <>
                <AlertPopup message={"Page not found"} onConfirm={ () => {
                    hidePopup();
                    navigate(-1);
                }} />
            </>)
        }
    
        if (error instanceof AuthError) {
            showPopup( <>
                <AlertPopup message={"Token expired! Please login again"} onConfirm={ () => {
                    hidePopup();
                    navigate("/login");
                }} />
            </>)
        }
    }

    return (
        <ErrorHandlerContext.Provider value={{ handleError }}>
            {children}
        </ErrorHandlerContext.Provider>
    )
}

const errorHandler = () => {
    const context = useContext(ErrorHandlerContext);
    if (!context) {
        throw new Error("errorHandler must be used within a ErrorHandlerProvider");
    }
    return context;
}

export { ErrorHandlerProvider, errorHandler };