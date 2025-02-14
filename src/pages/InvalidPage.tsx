import BackButton from "../components/BackButton";

const InvalidPage: React.FC = () => {
    return (
        <>
            <BackButton />
            <div className="d-flex flex-column justify-content-center align-items-center h-100">
                <h1 className="display-1 text-white">404 Not Found :(</h1>
                <p className="display-6">Oops! The page you are looking for does not exist.</p>
            </div>
        </>
    );
}

export default InvalidPage;