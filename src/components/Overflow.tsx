interface OverflowProps {
    children: React.ReactNode;
    className?: string;
    height?: string;
    width?: string;
}

export const Overflow: React.FC<OverflowProps> = ({
    children, className = "", height = ""
}) => {
    return (
        <div className={"d-flex flex-column overflow-y-auto w-100 ".concat(className)} style={{ height: height }}>
            <style>
                {`
                    ::-webkit-scrollbar {
                        width: 12px;
                        height: 0px;
                        position: absolute;
                        right: 0;
                        margin: 0 0.5rem;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background-color: #5C7C89;
                        border-radius: 10px;
                        border: 3px solid transparent;
                        background-clip: content-box;
                    }
                `}
            </style>
            {children}
        </div>
    )
}

export const OverflowX: React.FC<OverflowProps> = ({
    children, className="", width=""
}) => {
    return (
        <div className={"d-flex flex-nowrap overflow-x-scroll ".concat(className)} style={{width: width}}>
            <style>
                {`
                    ::-webkit-scrollbar {
                        height: 0 px;
                        width: 12 px;
                        position: absolute;
                        bottom: 0;
                        margin: 0 0.5rem;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background-color: #5C7C89;
                        border-radius: 10px;
                        border: 3px solid transparent;
                        background-clip: content-box;
                    }
                `}
            </style>
            {children}
        </div>
    )
}