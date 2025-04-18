import { FabricImage, filters } from "fabric";
import { Preset } from "../../types/Filter";

export default class ImageFilterUtilty {
  static applyFilter(preset: Preset, image: FabricImage) {
    const filter = new filters.Composed({
      subFilters: [],
    });

    console.log(filter);

    // Color matrix preset
    if (preset.sepia) {
      filter.subFilters.push(new filters.Sepia());
    }
    if (preset.brownie) {
      filter.subFilters.push(new filters.Brownie());
    }
    if (preset.blackwhite) {
      filter.subFilters.push(new filters.BlackWhite());
    }
    if (preset.vintage) {
      filter.subFilters.push(new filters.Vintage());
    }
    if (preset.polaroid) {
      filter.subFilters.push(new filters.Polaroid());
    }
    if (preset.kodachrome) {
      filter.subFilters.push(new filters.Kodachrome());
    }
    if (preset.technicolor) {
      filter.subFilters.push(new filters.Technicolor());
    }
    if (preset.pixelate) {
      filter.subFilters.push(
        new filters.Pixelate({ blocksize: preset.pixelate }),
      );
    }
    if (preset.noise) {
      filter.subFilters.push(new filters.Noise({ noise: preset.noise }));
    }
    if (preset.saturation) {
      filter.subFilters.push(
        new filters.Saturation({ saturation: preset.saturation }),
      );
    }
    if (preset.vibrance) {
      filter.subFilters.push(
        new filters.Vibrance({ vibrance: preset.vibrance }),
      );
    }
    if (preset.gamma) {
      filter.subFilters.push(new filters.Gamma({ gamma: preset.gamma.gamma }));
    }
    if (preset.grayscale) {
      filter.subFilters.push(new filters.Grayscale());
    }

    if (preset.blur) {
      filter.subFilters.push(
        new filters.Blur({
          blur: preset.blur.blur,
          aspectRatio: preset.blur.aspectRatio,
          horizontal: preset.blur.horizontal,
        }),
      );
    }
    if (preset.contrast) {
      filter.subFilters.push(
        new filters.Contrast({
          contrast: preset.contrast,
        }),
      );
    }
    if (preset.blend) {
      preset.blend.forEach((x) => {
        filter.subFilters.push(
          new filters.BlendColor({
            alpha: x.alpha,
            mode: x.mode,
            color: x.color,
          }),
        );
      });
    }

    console.log(filter);

    image.filters = [filter];
    image.applyFilters();
  }
}
