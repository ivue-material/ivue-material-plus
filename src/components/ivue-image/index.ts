import { withInstall, withNoopInstall } from '../../utils/install';
import Image from './index.vue';
import ImagePreview from './image-preview.vue';

export const IvueImage = withInstall(Image, {
  ImagePreview
});

export default IvueImage;

export const IvueImagePreview = withNoopInstall(ImagePreview);

export * from './index.vue';
export * from './image-preview.vue';
