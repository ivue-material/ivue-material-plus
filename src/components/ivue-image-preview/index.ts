import ImagePreview from '../ivue-image/image-preview.vue';

let imagePreviewInstance;

// 注册实例
function getImagePreviewInstance() {
  imagePreviewInstance = imagePreviewInstance || ImagePreview.newInstance();

  return imagePreviewInstance;
}

ImagePreview.show = (props: any = {}) => {
  const instance = getImagePreviewInstance();

  props.onRemove = function () {
    imagePreviewInstance = null;
  };

  // 显示
  instance.show(props);
};

export default ImagePreview;
