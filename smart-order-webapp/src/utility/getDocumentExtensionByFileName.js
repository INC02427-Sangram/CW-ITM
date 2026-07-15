const getDocumentExtensionByFileName=(fileName)=>{
    let fileType=null;

    let indexId=-1;
    Array.from(fileName).forEach((item,index)=>{
        if(item=="."){
            indexId=index;
        }

    })
    const fileExtension = fileName.slice(indexId+1,fileName.length);
    return fileExtension;

}
export default getDocumentExtensionByFileName;


