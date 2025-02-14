import { usePage } from "../hooks/Context";

const DashboardPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Home");

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    TEST
                </div>
            </div>
        </>
    )
}

export default DashboardPage;