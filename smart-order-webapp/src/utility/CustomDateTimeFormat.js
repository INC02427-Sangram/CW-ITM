import moment from "moment";

const customDateTimeFormat = (appFormatSetting, receivingDate = moment.ISO_8601, receivingFormat = moment.ISO_8601, withTime = false) => {
    let outPutFormat = "MM/DD/YYYY"; // Default format
    if (appFormatSetting && appFormatSetting?.dateFormat !== "") {
        outPutFormat = appFormatSetting?.dateFormat;
    }
    if (withTime) {
        outPutFormat += " (hh:mm:ss A)";
    }
    let m = moment(receivingDate, receivingFormat, true);
    if (receivingDate instanceof Date) {
        m = moment(receivingDate);
    }
    // If string → use receivingFormat
    else if (typeof receivingDate === "string" && receivingFormat) {
        m = moment(receivingDate, receivingFormat, true); // strict mode
    }

    if (!m.isValid()) {
        return receivingDate;
    }
    return moment.utc(receivingDate).local().format(outPutFormat);
}
export { customDateTimeFormat };