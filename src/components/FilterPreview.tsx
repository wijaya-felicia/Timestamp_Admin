import { useEffect, useRef, useState } from "react";
import CanvasFraming from "../shared/CanvasFraming";
import { CreateFilter } from "../types/Filter";

interface FilterPreviewProps {
  filters: CreateFilter;
}

export const FilterPreview: React.FC<FilterPreviewProps> = ({ filters }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas = useRef<CanvasFraming | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [isUsingCustomImage, setIsUsingCustomImage] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    (async () => {})().catch((error) => {
      console.error(error);
      throw error;
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (!canvas.current) {
        canvas.current = new CanvasFraming(
          canvasRef.current as HTMLCanvasElement,
        );
        await canvas.current?.create();

        return;
      }
      await canvas.current?.applyFilter(filters.preset);
    })();
  }, [filters]);

  const refreshSample = () => {
    if (!canvas.current) return;
    canvas.current.refreshImage(filters.preset);
    setIsUsingCustomImage(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas.current || !event.target.files || !event.target.files[0]) return;
    
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (!e.target?.result) return;
      
      // Load the uploaded image into the canvas
      await canvas.current?.loadCustomImage(e.target.result as string, filters.preset);
      setIsUsingCustomImage(true);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <>
      <figure
        className="figure d-flex flex-column justify-content-center relative sticky-top"
        style={{ top: "4rem" }}
        ref={container}
      >
        <canvas
          className="figure-img img-fluid rounded mx-auto"
          ref={canvasRef}
        />
        <figcaption className="figure-caption">
          {isUsingCustomImage ? (
            <span>Using your custom uploaded image</span>
          ) : (
            <a
              href="https://picsum.photos/"
              className="link-light"
              target="_blank"
            >
              https://picsum.photos/
            </a>
          )}
          {!isUsingCustomImage && '. Randomly generated every page load.'}
          <br />
          <br />
          <div className="d-flex gap-2 flex-wrap">
            <button
              className="btn btn-quaternary"
              onClick={() => refreshSample()}
            >
              Refresh sample
            </button>
            <label className="btn btn-primary">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="d-none"
              />
            </label>
          </div>
        </figcaption>
      </figure>
    </>
  );
};