import * as Fabric from "fabric";
import Frame, { Layout } from "./interfaces/Frame";
import ImageFilterUtilty from "./utilities/ImageFilterUtility.ts";
import { Preset } from "../types/Filter.ts";

declare module "fabric" {
  interface FabricObject {
    id?: string;
    name?: string;
  }

  interface SerializedObjectProps {
    id?: string;
    name?: string;
  }
}

Fabric.FabricObject.customProperties = ["name", "id"];

/**
 * Tools to position pictures in a frame as HTML canvas
 * @param {HTMLDivElement} container - A reference to the element containing the canvas
 * @param {HTMLCanvasElement} canvas - Reference to the canvas element
 * @param {string} backgroundImage - url of a image for canvas first layer
 */
export default class CanvasFraming {
  private canvas: HTMLCanvasElement;
  private fabricCanvas: Fabric.Canvas | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  private get background() {
    return `https://picsum.photos/600/300?cache=${Date.now()}`;
  }

  /**
   * Creates new canvas and attach the frame to it.
   * If a reset is needed for the canvas, consider to call "dispose()" from the Fabric.Canvas object first, then set the object to this function returns
   * @returns {Fabcric.Canvas, number} canvas object and scaling factor
   */
  public async create(): Promise<void> {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = this.background;

      img.onload = async () => {
        console.log("img load");
        try {
          const { naturalWidth, naturalHeight } = img;

          this.fabricCanvas = new Fabric.Canvas(this.canvas, {
            width: naturalWidth,
            height: naturalHeight,
            selection: false,
          });

          const imgObj = new Fabric.FabricImage(img, {
            hasBorders: false,
            top: 0,
            left: 0,
            hasControls: false,
            selectable: false,
            dirty: true,
          });
          this.fabricCanvas?.add(imgObj);
          this.fabricCanvas?.bringObjectToFront(imgObj);
          this.fabricCanvas.renderAll();
          resolve();
        } catch (error) {
          reject(error);
        }
        console.log("finish onload process");
      };

      img.onerror = (event, source) => {
        reject(`${event} ${source}`);
      };
    });
  }
  /**
   * Waits for all renders has been settled then destroy entire object and its canvas
   */
  public async dispose(): Promise<boolean | void> {
    try {
      return Promise.resolve(await this.fabricCanvas?.dispose());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public toObject() {
    return this.fabricCanvas!.toDatalessObject([]);
  }

  /**
   * Apply filter to every object in canvas except for object name "frame"
   * @param {FilterPreset} preset object to apply
   */
  public async applyFilter(preset: Preset) {
    this.fabricCanvas?.getObjects().forEach((object) => {
      ImageFilterUtilty.applyFilter(preset, object as Fabric.FabricImage);
    });
    this.fabricCanvas?.renderAll();
  }

  public refreshImage(currentFilters?: Preset) {
    this.fabricCanvas?.getObjects().forEach((object) => {
      this.fabricCanvas?.remove(object);
    });
    this.fabricCanvas?.clear();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.background;

    img.onload = () => {
      const imgObj = new Fabric.FabricImage(img, {
        hasBorders: false,
        top: 0,
        left: 0,
        hasControls: false,
        selectable: false,
        dirty: true,
        type: "frame",
        name: "frame",
      });

      if (currentFilters) {
        ImageFilterUtilty.applyFilter(currentFilters, imgObj);
      }
      this.fabricCanvas?.add(imgObj);
      this.fabricCanvas?.bringObjectToFront(imgObj);
      this.fabricCanvas?.renderAll();
    };
  }
}
