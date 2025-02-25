import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { usePage, usePopup } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Overflow } from "../components/Overflow";
import { Theme } from "../types/Theme";
import { CreateFrame } from "../types/Frame";
import _theme from "../services/ThemeService";
import _frame from "../services/FrameService";
import LoadingPage from "./LoadingPage";
import { ConfirmPopup } from "../components/Popup";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../utils/ImageUploader";

const FrameAddPage: React.FC = () => {
    const { setPage } = usePage();
    setPage("Frames");
    const { showPopup, hidePopup } = usePopup();
    const { handleError } = errorHandler();
    const navigate = useNavigate();
    
    const [ isFetching, setIsFetching ] = useState<boolean>(true);
    
    const [ themes, setThemes ] = useState<Theme[]>([]);

    const { control, handleSubmit } = useForm<CreateFrame>();
    
    useEffect(() => {
        const fetch = async () => {
            _theme.get()
                .then(response => {
                    setThemes(response);
                }).catch(error => {
                    handleError(error);
                }).finally(() => {
                    setIsFetching(false);
                })
        }
        fetch();
    }, []);
    
    const onSubmit = (data: CreateFrame) => {
        showPopup(
            <>
                <ConfirmPopup message="Are you sure you want to create this frame?" onConfirm={() => {
                    data.count = data.layouts.length;
                    _frame.post(data)
                        .then(response => {
                            uploadImage(response.url, data.image);
                            hidePopup();
                            navigate("/frames");
                        }).catch(error => {
                            handleError(error);
                        })
                    hidePopup();
                    }} onCancel={() => {
                        hidePopup();
                    }}
                />
            </>
        )
    }

    const [ selectedImage, setSelectedImage ] = useState<string>();

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
                            <h3 className="text-white mb-0 fw-bold">Create Frame</h3>
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
                                                <label className="form-label">Frame Name</label>
                                                <input {...field} className="form-control" placeholder="Type the frame name here"/>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="price"
                                        rules={{required: true, min: 0}}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="form-group">
                                                <label className="form-label">Frame Price</label>
                                                <input {...field} type="number" className="form-control" placeholder="Type the frame price here"/>
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="d-flex flex-column w-50 gap-3">
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
                                    <Controller
                                        name="split"
                                        defaultValue={false}
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <>
                                                    <div className="form-group">
                                                        <label className="form-label">Split Frame</label>
                                                        <div className="d-flex gap-3 align-items-center justify-content-start form-control border-0 bg-secondary">
                                                            <div className="form-check">
                                                                <input 
                                                                    {...field} 
                                                                    type="radio" 
                                                                    className="form-check-input" 
                                                                    value="false" 
                                                                    checked={field.value === false} 
                                                                    onChange={() => field.onChange(false)}
                                                                    id="full-frame"
                                                                />
                                                                <label className="form-check-label" htmlFor="full-frame">Full Frame</label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input 
                                                                    {...field} 
                                                                    type="radio" 
                                                                    className="form-check-input" 
                                                                    value="true" 
                                                                    checked={field.value === true} 
                                                                    onChange={() => field.onChange(true)}
                                                                    id="half-frame"
                                                                />
                                                                <label className="form-check-label" htmlFor="half-frame">Half Frame</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                            <Controller
                                name="image"
                                rules={{ required: true }}
                                control={control}
                                render={({ field: { onChange, ref } }) => (
                                    <div className="form-group">
                                        <label className="form-label">Frame Image</label>
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
                            <div className="d-flex flex-column gap-3">
                                <label className="form-label">Layouts</label>
                                <Controller
                                    name="layouts"
                                    control={control}
                                    defaultValue={[]}
                                    render={() => {
                                        const { fields, append, remove } = useFieldArray({
                                            control,
                                            name: "layouts"
                                        });

                                        return (
                                            <>
                                                {fields.map((item, index) => (
                                                    <div key={item.id} className="d-flex gap-3 align-items-center">
                                                        <Controller
                                                            name={`layouts.${index}.x`}
                                                            control={control}
                                                            defaultValue={item.x}
                                                            render={({ field }) => (
                                                                <div className="flex-grow-1 d-flex gap-3 align-items-center">
                                                                    <label className="form-label text-nowrap">X :</label>
                                                                    <input
                                                                        {...field}
                                                                        placeholder="X"
                                                                        className="form-control"
                                                                        type="number"
                                                                        step="any"
                                                                    />
                                                                </div>
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`layouts.${index}.y`}
                                                            control={control}
                                                            defaultValue={item.y}
                                                            render={({ field }) => (
                                                                <div className="flex-grow-1 d-flex gap-3 align-items-center">
                                                                    <label className="form-label text-nowrap">Y :</label>
                                                                    <input
                                                                        {...field}
                                                                        placeholder="Y"
                                                                        className="form-control"
                                                                        type="number"
                                                                        step="any"
                                                                    />
                                                                </div>
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`layouts.${index}.width`}
                                                            control={control}
                                                            defaultValue={item.width}
                                                            render={({ field }) => (
                                                                <div className="flex-grow-1 d-flex gap-3 align-items-center">
                                                                    <label className="form-label text-nowrap">Width :</label>
                                                                    <input
                                                                        {...field}
                                                                        placeholder="Width"
                                                                        className="form-control"
                                                                        type="number"
                                                                        step="any"
                                                                    />
                                                                </div>
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`layouts.${index}.height`}
                                                            control={control}
                                                            defaultValue={item.height}
                                                            render={({ field }) => (
                                                                <div className="flex-grow-1 d-flex gap-3 align-items-center">
                                                                    <label className="form-label text-nowrap">Height :</label>
                                                                    <input
                                                                        {...field}
                                                                        placeholder="Height"
                                                                        className="form-control"
                                                                        type="number"
                                                                        step="any"
                                                                    />
                                                                </div>
                                                            )}
                                                        />
                                                        <button type="button" className="btn btn-danger" onClick={() => remove(index)}>Remove</button>
                                                    </div>
                                                ))}
                                                <button type="button" className="btn btn-tertiary" onClick={() => append({ x: 0, y: 0, width: 0, height: 0 })}>Add Layout</button>
                                            </>
                                        );
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">Create Frame</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Overflow>
        </>
    )
}

export default FrameAddPage;