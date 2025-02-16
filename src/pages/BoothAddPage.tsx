import { useState } from "react";
import BackButton from "../components/BackButton";
import { usePage } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { CreateBooth } from "../types/Booth";
import { useNavigate } from "react-router-dom";

const BoothAddPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Booths");
    const { handleError } = errorHandler();

    const [form, setForm] = useState<CreateBooth>();
    const [error, setError] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target as HTMLInputElement;
        setForm({...form as CreateBooth, [name]: value });
    }


    return (
        <>
            <BackButton />
        </>
    )
}

export default BoothAddPage;