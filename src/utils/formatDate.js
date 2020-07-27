export const getFormattedDate = (date) => {
    const newDate = new Date(date)
    let month = 0
    if ((newDate.getMonth() + 1) < 10) {
        month = `0` + (newDate.getMonth() + 1)
    } else {
        month = newDate.getMonth() + 1
    }
    return (`${newDate.getDate()}/${month}/${newDate.getFullYear()}`)
}