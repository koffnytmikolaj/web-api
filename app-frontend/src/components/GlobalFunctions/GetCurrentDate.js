function GetCurrentDate() {

    function getLongTimeElement(timeElement) {

        return timeElement >= 10 ? timeElement : "0" + timeElement;
    }

    function getCurrentDate() {

        let time = new Date();

        return {
            year: time.getFullYear(),
            month: getLongTimeElement(Number(time.getMonth() + 1)),
            day: getLongTimeElement(time.getDate()),
            hours: getLongTimeElement(time.getHours()),
            minutes: getLongTimeElement(time.getMinutes()),
            seconds: getLongTimeElement(time.getSeconds())
        }
    }

    function main() {
        let time = getCurrentDate();
        return (
            time.year + "." + 
            time.month + "." + 
            time.day + " " + time.hours + 
            ":" + time.minutes + 
            ":" + time.seconds
        );
    }
    
    return main();
}
export default GetCurrentDate;
