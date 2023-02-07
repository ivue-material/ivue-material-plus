import { withInstallFunction } from '../../utils/install';
import ImagePreview from '../ivue-image/image-preview-global';

let imagePreviewInstance;

// 注册实例
function getImagePreviewInstance() {
  imagePreviewInstance = imagePreviewInstance || ImagePreview.newInstance();

  return imagePreviewInstance;
}

// 显示
ImagePreview.show = (
  props: {
    removeInstance?: () => any;
  } = {}
) => {
  const instance = getImagePreviewInstance();

  props.removeInstance = () => {
    imagePreviewInstance = null;
  };

  // 显示
  instance.show(props);
};

export const IvueImagePreview = withInstallFunction(
  ImagePreview,
  '$IvueImagePreview'
);
export default IvueImagePreview;

export * from '../ivue-image/image-preview-global';
