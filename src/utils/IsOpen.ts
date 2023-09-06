interface OpenClose {
    open: number | null;
    close: number | null;
}

const IsOpen = (openClose: OpenClose[]) => {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const open = openClose[day].open
    const close = openClose[day].close
    if(!open || !close){
      return false
    }
  
    const openHour = new Date(open).getHours()
    const openMinute = new Date(open).getMinutes()
    const closeHour = new Date(close).getHours()
    const closeMinute = new Date(close).getMinutes()
  
    if(hour >= openHour && hour <= closeHour){
      if(hour == openHour && minute < openMinute){
        return false
      }
      if(hour == closeHour && minute > closeMinute){
        return false
      }
      return true
    }
    return false
}

export {
    IsOpen
}