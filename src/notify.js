
let count = 0

const generateId = () => {
  return count++
}

const emitClose = (id) => {
  const event = new CustomEvent('close', id);
  window.dispatchEvent(event);
}

export const notify = (notification, timeout) => {
  notification.id = generateId()
  notification.group = notification.group || ''
  const event = new CustomEvent('notify',  { detail : { notification, timeout }});
  window.dispatchEvent(event);

  return () => emitClose({detail : notification.id});
}


