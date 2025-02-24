import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { usePage, usePopup } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { CreateBooth } from "../types/Booth";
import { Controller, useForm } from "react-hook-form";
import { Overflow, OverflowX } from "../components/Overflow";
import { Theme } from "../types/Theme";
import { Frame } from "../types/Frame";
import _booth from "../services/BoothService";
import _theme from "../services/ThemeService";
import _frame from "../services/FrameService";
import LoadingPage from "./LoadingPage";
import { ConfirmPopup } from "../components/Popup";
import { useNavigate } from "react-router-dom";

const BoothAddPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Booths");
    const { showPopup, hidePopup } = usePopup();
    const { handleError } = errorHandler();
    const navigate = useNavigate();
    
    const [ isFetching, setIsFetching ] = useState<boolean>(true);
    
    const [ themes, setThemes ] = useState<Theme[]>([]);
    const [ frames, setFrames ] = useState<Frame[]>([]);

    const { control, handleSubmit } = useForm<CreateBooth>({
        defaultValues: {
            frameIds: []
        }
    });
    
    useEffect(() => {
        const fetch = async () => {
            _theme.get()
            .then(response => {
                    setThemes(response);
                }).catch(error => {
                    handleError(error);
                })
            _frame.get()
                .then(response => {
                    setFrames(response);
                }).catch(error => {
                    handleError(error);
                }).finally(() => {
                    setIsFetching(false);
                })
        }
        fetch();
    }, []);
    
    const onSubmit = (data: CreateBooth) => {
        showPopup(
            <>
                <ConfirmPopup message="Are you sure you want to create this booth?" onConfirm={() => {
                        _booth.post(data)
                            .then(() => {
                                hidePopup();
                                navigate(-1);
                            })
                            .catch(error => {
                                handleError(error);
                            });
                    }} onCancel={() => {
                        hidePopup();
                    }}
                />
            </>
        )
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
                            <h3 className="text-white mb-0 fw-bold">Create Booth</h3>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
                            <div className="d-flex gap-3 align-items-stretch">
                                <div className="d-flex flex-column w-50 gap-3">
                                    <Controller
                                        name="name"
                                        rules={{required: true}}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="form-group">
                                                <label className="form-label">Booth Name</label>
                                                <input {...field} className="form-control" placeholder="Type the booth name here"/>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="clientKey"
                                        rules={{required: true}}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="form-group">
                                                <label className="form-label">Client Key</label>
                                                <input {...field} className="form-control" placeholder="Type your client key here"/>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="serverKey"
                                        rules={{required: true}}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="form-group">
                                                <label className="form-label">Server Key</label>
                                                <input {...field} className="form-control" placeholder="Type your server key here"/>
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="d-flex flex-column w-50 gap-3">
                                    <Controller
                                        name="description"
                                        rules={{required: true}}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="d-flex flex-column form-group flex-grow-1">
                                                <label className="form-label">Description</label>
                                                <textarea {...field} className="form-control flex-grow-1" placeholder="Type the description here" style={{height: ""}}/>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="themeId"
                                        rules={{required: true}}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="form-group">
                                                <label className="form-label">Theme</label>
                                                <select {...field} className="form-select">
                                                    <option value="" disabled selected>Select a theme</option>
                                                    {themes.map(theme => (
                                                        <option key={theme.id} value={theme.id} >
                                                            {theme.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <Controller
                                name="frameIds"
                                control={control}
                                render={({ field }) => {
                                    const { value, onChange } = field;

                                    const toggleFrame = (frameId: string) => {
                                        const updatedFrames = value.includes(frameId) ? value.filter(id => id !== frameId) : [...value, frameId];
                                        onChange(updatedFrames);
                                    };

                                    return (
                                        <>
                                            <label className="form-label">Frames</label>
                                            <OverflowX width="calc(100vw - 169px)">
                                                <div className="d-flex w-100 align-items-stretch gap-3 bg-primary p-3 rounded-3">
                                                    {frames.map((frame) => {
                                                    const isSelected = value.includes(frame.id);
                                                    return (
                                                        <div key={frame.id} className={`col-2 p-3 rounded-3 ${isSelected ? "bg-tertiary" : ""}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleFrame(frame.id)}
                                                                className="position-absolute top-0 start-0 invisible"
                                                            />
                                                            <div
                                                                className="rounded-3"
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => toggleFrame(frame.id)}
                                                            >
                                                                <img
                                                                    src={frame.url}
                                                                    alt={frame.name}
                                                                    className="w-100 object-fit-contain"
                                                                    style={{
                                                                        filter: "drop-shadow(0px 0px 5px #333)",
                                                                        height: "200px"
                                                                    }}
                                                                />
                                                            </div>
                                                            <h5 className="text-center text-white mt-2">{frame.name}</h5>
                                                        </div>
                                                    );
                                                    })}
                                                </div>
                                            </OverflowX>
                                        </>
                                    )
                                }}
                            />
                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">Create Booth</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Overflow>
        </>
    )
}

export default BoothAddPage;