export function getEnv(name) {
  return window?.configs?.[name] || import.meta.env[name];
}

export function download(data, filename) {
  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(data); // data must be instaceof Blob

  link.setAttribute('download', filename);

  document.body.appendChild(link);

  link.click();

  link.remove();
  URL.revokeObjectURL(link.href);
}

export function date(dateTime) {
  const date = new Date(Date.parse(dateTime));
  return date.toLocaleString();
}

let UUID = 0;
export function uuid() {
  const getID = () => {
    UUID++;
    return UUID;
  };
  return getID();
}
