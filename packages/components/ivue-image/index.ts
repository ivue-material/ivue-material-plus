import { withInstall } from '@ivue-material-plus/utils';
import Image from './src/image.vue';
import ImagePreview from './src/image-preview.vue';

export const IvueImage = withInstall(Image, {
  ImagePreview,
});

export default IvueImage;

export * from './src/image';
export * from './src/image-preview';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueImage: typeof import('@ivue-material-plus/components')['IvueImage'];
  }
}
