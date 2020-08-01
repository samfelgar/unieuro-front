export const getFormattedDate = (date) => {
    const newDate = new Date(date)
    let month = 0
    if ((newDate.getUTCMonth() + 1) < 10) {
        month = `0` + (newDate.getUTCMonth() + 1)
    } else {
        month = newDate.getUTCMonth() + 1
    }
    return (`${newDate.getUTCDate()}/${month}/${newDate.getUTCFullYear()}`)
}