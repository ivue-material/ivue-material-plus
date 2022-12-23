import { withInstall, withInstallFunction } from '../../utils/install';
import Image from './index.vue';
import ImagePreview from './image-preview.vue';

export const IvueImage = withInstall(Image, {
  ImagePreview
});

export default IvueImage;

export const IvueImagePreview = withInstallFunction(ImagePreview, '$IvueImagePreview');

export * from './index.vue';
export * from './image-preview.vue';
