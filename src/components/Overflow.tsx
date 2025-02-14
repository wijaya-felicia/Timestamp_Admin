interface OverflowProps {
    children: React.ReactNode;
}

const Overflow: React.FC<OverflowProps> = ({
    children
}) => {
    return (
        <div className="row flex-md-wrap flex-fill p-3" style={{ overflowY: "scroll", maxHeight: "calc(100vh - 122px)" }}>
            <style>
                {`
                    ::-webkit-scrollbar {
                        width: 12px;
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

export default Overflow;