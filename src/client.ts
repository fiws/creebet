import got, { Got, Headers, GotReturn, ExtendOptions } from 'got';
import defaultPresets, { Preset } from './presets';
import { Params, Op } from './imaginary-types';
import pkg from '../package.json';
import Request from 'got/dist/source/core';
import { Readable } from 'node:stream';


type HeaderHook = () => Headers | Promise<Headers>;
type ClientConstructor = {
  url: string;
  headers?: Headers | HeaderHook;
  ExtendOptions?,
};

// is returned from the "GET" endpoint
interface InfoResponse {
  // width of the image
  width: number;
  // height of the image
  height: number;
  type: string;
  space: string;
  hasAlpha: boolean;
  hasProfile: boolean;
  channels: number;
  orientation: number;
}

// returned from the convenience "defaultResized" function
interface PresetOpsJob {
  preset: Preset;
  // Promise that resolves to a stream containing the image
  result: Promise<GotReturn>;
}

export default class Client {
  private http : Got;
  private headerHook : HeaderHook;

  constructor({ url, headers, ...opts } : ClientConstructor) {
    let initialHeaders = {
      'user-agent': `imaginary-client/${pkg.version} (https://github.com/fiws/creebet)`,
    };
    if (typeof headers !== 'function') initialHeaders = { ...initialHeaders, ...headers };
    else if (headers !== undefined) this.headerHook = headers;

    this.http = got.extend({
      prefixUrl: url,
      headers: initialHeaders,
      http2: true,
      ...opts,
    });
  }

  private async getHeaders() {
    if (!this.headerHook) return undefined;
    return this.headerHook();
  }

  // can be used to wake up sleeping cloud thingies
  async ping() : Promise<Record<string, unknown>> {
    return this.http.get('', {
      headers: await this.getHeaders(),
    }).json();
  }

  /**
   * Returns info for given image (using an image url)
   * @param {string} url Image url
   */
  async getInfo(url : string) : Promise<InfoResponse> {
    return this.http.get(`info`, {
      searchParams: { url },
      headers: await this.getHeaders(),
    }).json();
  }

  /**
   * Returns info for given image (using a buffer or stream)
   * @param {string} url Image url
   */
  async postInfo(image : Buffer | Readable) : Promise<InfoResponse> {
    return this.http.post(`info`, {
      body: image,
      headers: await this.getHeaders(),
    }).json();
  }

  /**
   * Perform operation on an image by supplying a source URL
   * @param {string} op Operation to perform on the uploaded image. defaults to resize
   * @param {Params} params Options for the operation. see https://github.com/h2non/imaginary#params
   * @returns A stream. Read the result from it.
   */
  async get(op: Op = 'resize', params?: Params) : Promise<Request> {
    return this.http.stream.get(op, {
      searchParams: params as any,
      headers: await this.getHeaders(),
    });
  }

  /**
   * Perform operation on an image by uploading it directly
   * @param {string} op Operation to perform on the uploaded image. defaults to resize
   * @param {object} params Options for the operation. see https://github.com/h2non/imaginary#params
   * @returns A stream. Write the image to it and read the result from it.
   */
  async post(op: Op = 'resize', params?: Params) : Promise<Request> {
    const stream = this.http.stream.post(op, {
      searchParams: params as any,
      headers: await this.getHeaders(),
    });

    return stream;
  }

  /**
   * Resizes given image with all given presets. Defaults to images for:
   * 1080.jpeg, 1080.webp, 580.jpeg, 580.webp, 120.jpeg, 120.webp
   * @param {string} url Source url
   * @param {Preset[]} Array of presets to use
   * @returns Array of objects containing the `preset` (for reference) and `result`
   */
  runPresets(url: string, presets = defaultPresets) : PresetOpsJob[] {
    if (!url) throw new Error('Not implemented for input streams yet');

    const ops = presets
      .map(preset => {
        const result = this.get(preset.op || 'resize', { ...preset.settings, url });

        return { result, preset };
      });

    return ops;
  }
}
