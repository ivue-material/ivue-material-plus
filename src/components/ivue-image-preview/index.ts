import ImagePreview from '../ivue-image/image-preview-global';

let imagePreviewInstance;

// 注册实例
function getImagePreviewInstance() {
  imagePreviewInstance = imagePreviewInstance || ImagePreview.newInstance();

  return imagePreviewInstance;
}

// 显示
ImagePreview.show = (props: any = {}) => {
  const instance = getImagePreviewInstance();

  props.removeInstance = function () {
    imagePreviewInstance = null;
  };

  // 显示
  instance.show(props);
};

export default ImagePreview;
