export const EXCEL_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const base64ToBlob = (base64, mimeType = EXCEL_MIME_TYPE) => {
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mimeType });
};

export const downloadBase64File = (base64, fileName, mimeType = EXCEL_MIME_TYPE) => {
  const blob = base64ToBlob(base64, mimeType);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const openBase64File = (base64, mimeType = EXCEL_MIME_TYPE) => {
  const blob = base64ToBlob(base64, mimeType);
  const blobUrl = URL.createObjectURL(blob);

  window.open(blobUrl, "_blank");
};
