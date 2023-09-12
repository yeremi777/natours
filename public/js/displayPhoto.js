/* eslint-disable */
export const displayPhoto = (imgElement, imgInputElement) => {
  imgInputElement.addEventListener('change', (e) => {
    const imageFile = e.target.files?.[0];

    if (!imageFile?.type.startsWith('image/')) return;

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      imgElement.setAttribute('src', reader.result);
    });

    reader.readAsDataURL(imageFile);
  });
};
