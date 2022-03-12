import { Params, Op } from './imaginary-types';

export interface Preset {
  // Operation. defaults to 'resize'
  op?: Op,
  // name of this preset variant. eg: `1080.webp`
  variant: string;
  // extension/type of the result. eg: `webp`
  type?: string;
  // mime type. eg: `image/webp`
  mime: string;
  // resize settings used
  settings: Params;
}

const jpegPreset: Preset = {
  op: 'resize',
  variant: '1080.jpeg',
  mime: 'image/jpeg',
  settings: {
    type: 'jpeg',
    height: 1080,
    stripmeta: true,
    quality: 75,
    // minepkg light gold
    background: '255,230,154',
  },
};

const webpPreset: Preset = {
  op: 'resize',
  variant: '1080.webp',
  mime: 'image/webp',
  settings: {
    type: 'webp',
    height: 1080,
    stripmeta: true,
    quality: 75,
    // minepkg light gold
    background: '255,230,154',
  },
};

const presets: Array<Preset> = [
  jpegPreset,
  webpPreset,
  {
    op: 'resize',
    variant: '480.webp',
    type: 'webp',
    mime: 'image/webp',
    settings: {
      ...webpPreset.settings,
      quality: 72,
      height: 480,
    },
  },
  {
    op: 'resize',
    variant: '480.jpeg',
    type: 'jpeg',
    mime: 'image/jpeg',
    settings: {
      ...jpegPreset.settings,
      quality: 72,
      height: 480,
    },
  },
  {
    op: 'resize',
    variant: '144.webp',
    type: 'webp',
    mime: 'image/webp',
    settings: {
      ...webpPreset.settings,
      quality: 60,
      height: 144,
    },
  },
  {
    op: 'resize',
    variant: '144.jpeg',
    type: 'jpeg',
    mime: 'image/jpeg',
    settings: {
      ...jpegPreset.settings,
      quality: 60,
      height: 144,
    },
  }
];

export default presets;
