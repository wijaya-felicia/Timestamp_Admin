import BackButton from "../components/BackButton";
import { usePage, usePopup } from "../hooks/Context";
import { errorHandler } from "../hooks/ErrorHandler";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Overflow } from "../components/Overflow";
import { CreateFilter, Preset } from "../types/Filter";
import _filter from "../services/FilterService";
import { ConfirmPopup } from "../components/Popup";
import { useNavigate } from "react-router-dom";
import { FilterPreview } from "../components/FilterPreview";
import { useEffect, useMemo } from "react";

const FilterAddPage: React.FC = () => {
  const { setPage } = usePage();
  setPage("Filters");
  const { showPopup, hidePopup } = usePopup();
  const { handleError } = errorHandler();
  const navigate = useNavigate();

  const { control, watch, handleSubmit } = useForm<CreateFilter>({
    defaultValues: {
      name: "",
      preset: {},
    },
  });
  const fields = watch();

  useEffect(() => {}, [fields]);

  const onSubmit = (data: CreateFilter) => {
    showPopup(
      <>
        <ConfirmPopup
          message="Are you sure you want to create this filter?"
          onConfirm={() => {
            _filter
              .post(data)
              .then(() => {
                hidePopup();
                navigate(-1);
              })
              .catch((error) => {
                handleError(error);
              });
            hidePopup();
          }}
          onCancel={() => {
            hidePopup();
          }}
        />
      </>,
    );
  };

  const {
    fields: blendFields,
    append: appendBlend,
    remove: removeBlend,
  } = useFieldArray({
    control,
    name: "preset.blend",
  });

  return (
    <>
      <Overflow height="calc(100vh - 90px)">
        <div className="p-3">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-start gap-3">
              <BackButton />
              <h3 className="text-white mb-0 fw-bold">Create Filter</h3>
            </div>

            <div className="d-flex flex-row gap-3">
              {/* Filter Preview */}
              <div className="flex-fill d-flex align-items-start justify-content-center">
                <FilterPreview filters={fields} />
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-fill d-flex flex-column gap-3"
              >
                <Controller
                  name="name"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <div className="form-group">
                      <label className="form-label">Filter Name</label>
                      <input
                        {...field}
                        className="form-control"
                        placeholder="Type the filter name here"
                      />
                    </div>
                  )}
                />

                {/* Grayscale */}
                <div className="card bg-secondary">
                  <div className="card-header">
                    <h5 className="mb-0">Grayscale</h5>
                  </div>
                  <div className="card-body">
                    <Controller
                      name="preset.grayscale"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="enableGrayscale"
                              checked={!!field.value}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange({ mode: "average" });
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="enableGrayscale"
                            >
                              Enable Grayscale
                            </label>
                          </div>
                          {field.value && (
                            <div className="form-group">
                              <label className="form-label">Mode</label>
                              <select
                                className="form-select"
                                value={field.value.mode}
                                onChange={(e) =>
                                  field.onChange({
                                    ...field.value,
                                    mode: e.target.value,
                                  })
                                }
                              >
                                <option value="average">Average</option>
                                <option value="lightness">Lightness</option>
                                <option value="luminosity">Luminosity</option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Simple boolean filters */}
                <div className="card bg-secondary">
                  <div className="card-header">
                    <h5 className="mb-0">Basic Filters</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-wrap gap-3">
                      {[
                        "sepia",
                        "polaroid",
                        "blackwhite",
                        "brownie",
                        "kodachrome",
                        "technicolor",
                        "vintage",
                      ].map((filterName) => (
                        <Controller
                          key={filterName}
                          name={`preset.${filterName}` as any}
                          control={control}
                          render={({ field }) => (
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`enable${filterName}`}
                                checked={!!field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked || undefined)
                                }
                              />
                              <label
                                className="form-check-label text-capitalize"
                                htmlFor={`enable${filterName}`}
                              >
                                {filterName}
                              </label>
                            </div>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Blend Filter */}
                <div className="card bg-secondary">
                  <div className="card-header">
                    <h5 className="mb-0">Blend</h5>
                  </div>
                  <div className="card-body">
                    {blendFields.map((item, index) => (
                      <div
                        key={item.id}
                        className="d-flex gap-3 mb-2 align-items-end"
                      >
                        <Controller
                          name={`preset.blend.${index}.color`}
                          control={control}
                          render={({ field }) => (
                            <div className="form-group">
                              <label className="form-label">Color</label>
                              <input
                                type="color"
                                {...field}
                                className="form-control"
                              />
                            </div>
                          )}
                        />
                        <Controller
                          name={`preset.blend.${index}.mode`}
                          control={control}
                          render={({ field }) => (
                            <div className="form-group">
                              <label className="form-label">Mode</label>
                              <select {...field} className="form-select">
                                <option value="multiply">Multiply</option>
                                <option value="add">Add</option>
                                <option value="difference">Difference</option>
                                <option value="screen">Screen</option>
                                <option value="subtract">Subtract</option>
                                <option value="darken">Darken</option>
                                <option value="lighten">Lighten</option>
                                <option value="overlay">Overlay</option>
                                <option value="exclusion">Exclusion</option>
                                <option value="tint">Tint</option>
                              </select>
                            </div>
                          )}
                        />
                        <Controller
                          name={`preset.blend.${index}.alpha`}
                          control={control}
                          render={({ field }) => (
                            <div className="form-group">
                              <label className="form-label">
                                Alpha ({field.value})
                              </label>
                              <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                {...field}
                                value={field.value || 0.5}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="form-range"
                              />
                            </div>
                          )}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeBlend(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() =>
                        appendBlend({
                          color: "#000000",
                          mode: "multiply",
                          alpha: 0.5,
                        })
                      }
                    >
                      Add Blend
                    </button>
                  </div>
                </div>

                {/* Blur Filter */}
                <div className="card bg-secondary">
                  <div className="card-header">
                    <h5 className="mb-0">Blur</h5>
                  </div>
                  <div className="card-body">
                    <Controller
                      name="preset.blur"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="enableBlur"
                              checked={!!field.value}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange({
                                    blur: 0.1,
                                    horizontal: true,
                                    aspectRatio: 1,
                                  });
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="enableBlur"
                            >
                              Enable Blur
                            </label>
                          </div>
                          {field.value && (
                            <div className="d-flex flex-column gap-2">
                              <div className="form-group">
                                <label className="form-label">
                                  Blur amount ({field.value.blur})
                                </label>
                                <input
                                  type="range"
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={field.value.blur}
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      blur: parseFloat(e.target.value),
                                    })
                                  }
                                  className="form-range"
                                />
                              </div>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="blurHorizontal"
                                  checked={field.value.horizontal}
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      horizontal: e.target.checked,
                                    })
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="blurHorizontal"
                                >
                                  Horizontal
                                </label>
                              </div>
                              <div className="form-group">
                                <label className="form-label">
                                  Aspect Ratio
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={field.value.aspectRatio}
                                  onChange={(e) =>
                                    field.onChange({
                                      ...field.value,
                                      aspectRatio: parseFloat(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Numeric filters */}
                <div className="card bg-secondary">
                  <div className="card-header">
                    <h5 className="mb-0">Numeric Filters</h5>
                  </div>
                  <div className="card-body d-flex flex-column gap-3">
                    {/* Contrast */}
                    <Controller
                      name="preset.contrast"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="enableContrast"
                              checked={field.value !== undefined}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange(0);
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="enableContrast"
                            >
                              Contrast
                            </label>
                          </div>
                          {field.value !== undefined && (
                            <div className="form-group">
                              <label className="form-label">
                                Value ({field.value})
                              </label>
                              <input
                                type="range"
                                min={-1}
                                max={1}
                                step={0.01}
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="form-range"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />

                    {/* Noise */}
                    <Controller
                      name="preset.noise"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="enableNoise"
                              checked={field.value !== undefined}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange(0);
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="enableNoise"
                            >
                              Noise
                            </label>
                          </div>
                          {field.value !== undefined && (
                            <div className="form-group">
                              <label className="form-label">
                                Value ({field.value})
                              </label>
                              <input
                                type="number"
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="form-control"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />

                    {/* Pixelate */}
                    <Controller
                      name="preset.pixelate"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="enablePixelate"
                              checked={field.value !== undefined}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange(1);
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="enablePixelate"
                            >
                              Pixelate
                            </label>
                          </div>
                          {field.value !== undefined && (
                            <div className="form-group">
                              <label className="form-label">Block Size</label>
                              <input
                                type="number"
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="form-control"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />

                    {/* Saturation */}
                    <Controller
                      name="preset.saturation"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="enableSaturation"
                              checked={field.value !== undefined}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange(0);
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="enableSaturation"
                            >
                              Saturation
                            </label>
                          </div>
                          {field.value !== undefined && (
                            <div className="form-group">
                              <label className="form-label">
                                Value ({field.value})
                              </label>
                              <input
                                type="range"
                                min={-1}
                                max={1}
                                step={0.01}
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="form-range"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />

                    {/* Vibrance */}
                    <Controller
                      name="preset.vibrance"
                      control={control}
                      render={({ field }) => (
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="enableVibrance"
                              checked={field.value !== undefined}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange(0);
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="enableVibrance"
                            >
                              Vibrance
                            </label>
                          </div>
                          {field.value !== undefined && (
                            <div className="form-group">
                              <label className="form-label">
                                Value ({field.value})
                              </label>
                              <input
                                type="range"
                                min={-1}
                                max={1}
                                step={0.01}
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="form-range"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Create Filter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Overflow>
    </>
  );
};

export default FilterAddPage;
