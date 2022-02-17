export function formatDate(date) {
    if (typeof date == "string")
        date = new Date(date);
    var day = (date.getDate() <= 9 ? "0" + date.getDate() : date.getDate());
    var month = (date.getMonth() + 1 <= 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
    var dateString = day + "/" + month + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

    return dateString;
}