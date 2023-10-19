import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'
import type { FetchError } from 'ofetch';
import { ResponseDefault } from '~/@types/api';

const errorHandler = (error: Ref<FetchError | null>, notificationApi?: NotificationApiInjection) => {
  const data = error.value?.data as ResponseDefault
  const errorMessages: string[] = []
  if(data.errors){
    Object.keys(data.errors).forEach((key) => {
      if(data.errors?.[key]){ errorMessages.push(data.errors[key][0])}
    }) 
  }else if(data.message){
    errorMessages.push(data.message)
  }

  errorMessages.forEach(msg => {
    notificationApi?.error({
      content: 'Erro',
      meta: msg,
    })
  })
    
  return errorMessages
}

export {
  errorHandler
}