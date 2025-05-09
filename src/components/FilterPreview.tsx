import { createContext, useEffect, useRef } from "react";
import CanvasFraming from "../shared/CanvasFraming";
import { CreateFilter, Preset } from "../types/Filter";

interface FilterPreviewProps {
  filters: CreateFilter;
}

export const FilterPreview: React.FC<FilterPreviewProps> = ({ filters }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas = useRef<CanvasFraming | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    (async () => {})().catch((error) => {
      console.error(error);
      throw error;
    });
  }, []);

  useEffect(() => {
    // TODO :: Continue this
    //
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
          <a
            href="https://picsum.photos/"
            className="link-light"
            target="_blank"
          >
            https://picsum.photos/
          </a>
          . Randomly generated every page load.
          <br />
          <br />
          <button
            className="btn btn-quaternary"
            onClick={() => refreshSample()}
          >
            Refresh sample
          </button>
        </figcaption>
      </figure>
    </>
  );
};
