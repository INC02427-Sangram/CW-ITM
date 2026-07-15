// This funtion takes fileNames checks the extension of file
//and gives back the file Type which is needed to embed url for downloading document

const getDocumentTypeByFileName = (fileName) => {
  let fileType = null;

  let indexId = -1;
  Array.from(fileName).forEach((item, index) => {
    if (item == ".") {
      indexId = index;
    }
  });

  const fileExtension = fileName.slice(indexId + 1, fileName.length);

  switch (fileExtension) {
    case "txt":
      fileType = "text/plain";
      break;
    case "pdf":
      fileType = "application/pdf";
      break;
    case "xlsx":
      fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;
    case "ms-excel":
      fileType = "application/vnd.ms-excel";
      break;
    case "docx":
      fileType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      break;
    case "doc":
      fileType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      break;
    default:
      fileType = "application/pdf";
      break;
  }
  return fileType;
};

export default getDocumentTypeByFileName;
