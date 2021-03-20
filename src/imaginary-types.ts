// available ops
export type Op =
  'resize' | 'crop' | 'smartcrop' | 'enlarge' | 'extract' |
  'zoom' | 'thumbnail' | 'fit' | 'rotate' | 'flip' | 'flop' |
  'convert' | 'pipeline' | 'info';

// Also see https://github.com/h2non/imaginary#params
export interface Params {
  // Width of image area to extract/resize
  width?: number;
  // Height of image area to extract/resize
  height?: number;

  // Top edge of area to extract. Example: `100`
  top?: number;
  // Left edge of area to extract. Example: `100`
  left?: number;

  // Height area to extract. Example: `300`
  areawidth?: number;
  // Width area to extract. Example: `300`
  areaheight?: number;

  // JPEG image quality between 1-100. Defaults to `80`
  quality?: number;
  // PNG compression level. Default: `6`
  compression?: number;

  // Image rotation angle. Must be multiple of 90. Example: `180`
  rotate?: -270 | -180 | 0 | 90 | 180 | 270;
  // Zoom factor level. Example: 2
  factor?: number;
  // Text area margin for watermark. Example: 50
  margin?: number;
  dpi?: number;
  textwidth?: number;
  opacity?: number;
  flip?: boolean;
  flop?: boolean;
  force?: boolean;
  nocrop?: boolean;
  noreplicate?: boolean;
  norotation?: boolean;
  noprofile?: boolean;
  stripmeta?: boolean;

  text?: string;
  font?: string;
  color?: string;
  image?: string;

  // Specify the image format to output.
  // Possible values are: jpeg, png, webp and auto.
  // auto will use the preferred format requested by the client in the HTTP Accept header.
  // A client can provide multiple comma-separated choices in Accept with the best being the one picked.
  type?: string;

  gravity?: string;

  // Fetch the image from a remote HTTP server
  url?: string;

  colorspace?: string;
  extend?: 'black' | 'copy' | 'mirror' | 'white' | 'lastpixel' | 'background';
  background?: string;

  sigma?: number;
  minampl?: number;

  // operations: Array<Omit<Params, 'operations'>>

  sign?: string;
  interlace?: boolean;
  aspectratio?: string;
}
