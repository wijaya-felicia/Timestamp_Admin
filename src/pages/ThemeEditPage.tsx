import { useNavigate, useParams } from "react-router-dom";
import { usePage, usePopup } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { Overflow } from "../components/Overflow";
import BackButton from "../components/BackButton";
import { argbToHex, colorGenerator } from "../utils/ColorGenerator";
import { Controller, useForm } from "react-hook-form";
import { CreateTheme, Theme } from "../types/Theme";
import { ConfirmPopup } from "../components/Popup";
import _theme from "../services/ThemeService";
import { useEffect, useState } from "react";
import { uploadImage } from "../utils/ImageUploader";
import LoadingPage from "./LoadingPage";
import InvalidPage from "./InvalidPage";

const ThemeEditPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Themes");
    const { showPopup, hidePopup } = usePopup();
    const { handleError } = errorHandler();
    const navigate = useNavigate();

    const { id } = useParams();
    const [ isInvalid, setIsInvalid ] = useState<boolean>(false);
    const [ isFetching, setIsFetching ] = useState<boolean>(true);

    const [ theme, setTheme ] = useState<Theme | undefined>(undefined);

    const { control, handleSubmit } = useForm<CreateTheme>();

    useEffect(() => {
        const fetch = async () => {
            _theme.get(id)
                .then(response => {
                    if(response[0] && response[0].id === id) {
                        setTheme(response[0]);
                        setSelectedImage(response[0].url);
                    }
                    else setIsInvalid(true);
                }).catch(error => {
                    handleError(error);
                }).finally(() => {
                    setIsFetching(false);
                });
        }
        fetch();
    }, []);

    const onSubmit = (data: CreateTheme) => {
        showPopup(
            <>
                <ConfirmPopup message="Are you sure you want to update this theme?" onConfirm={async () => {
                        var config = Object.fromEntries(
                            Object.entries(colorGenerator(data.config)).map(([key, value]) => [key, argbToHex(value)])
                        );
                        data.config = JSON.stringify(config);
                        if (id) {
                            _theme.put(id, data)
                                .then(response => {
                                    uploadImage(response.url, data.background);
                                    hidePopup();
                                    navigate(-1);
                                }).catch(error => {
                                    handleError(error);
                                })
                        }
                    }} onCancel={() => {
                        hidePopup();
                    }}
                />
            </>
        )
    }

    const [ selectedImage, setSelectedImage ] = useState<string>();

    if(isInvalid) {
        return <InvalidPage />;
    }

    if(isFetching) {
        return <LoadingPage />;
    }

    return (
        <>
            <Overflow height="calc(100vh - 90px)">
                <div className="p-3">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center justify-content-start gap-3">
                            <BackButton />
                            <h3 className="text-white mb-0 fw-bold">Edit Theme</h3>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
                            <div className="d-flex gap-3 align-items-stretch">
                                <Controller
                                    name="name"
                                    control={control}
                                    defaultValue={theme?.name}
                                    render={({ field }) => (
                                        <div className="form-group flex-grow-1">
                                            <label className="form-label">Theme Name</label>
                                            <input {...field} className="form-control" placeholder="Type the theme name here" />
                                        </div>
                                    )}
                                />
                                <Controller
                                    name="config"
                                    control={control}
                                    defaultValue={theme?.config ? JSON.parse(theme.config).primary : "#000000"}
                                    render={({ field }) => (
                                        <div className="form-group flex-grow-1">
                                            <label className="form-label">Theme Color</label>
                                            <input {...field} type="color" className="form-control form-control-color w-100" />
                                        </div>
                                    )}
                                />
                            </div>
                            <Controller
                                name="background"
                                control={control}
                                render={({ field: { onChange, ref } }) => (
                                    <div className="form-group">
                                        <label className="form-label">Background Image</label>
                                        <div className="d-flex gap-3">
                                            {
                                                selectedImage &&
                                                    <div className="d-flex align-items-center justify-content-center" style={{ width: "40%", height: "300px" }}>
                                                        <img src={selectedImage} alt="background" className="object-fit-contain h-100 w-100" />
                                                    </div>
                                            }
                                            <input
                                                type="file"
                                                ref={ref}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setSelectedImage(file ? URL.createObjectURL(file) : undefined);
                                                    onChange(file);
                                                }}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                )}
                            />
                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">Update Theme</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Overflow>
        </>
    )
}

export default ThemeEditPage;