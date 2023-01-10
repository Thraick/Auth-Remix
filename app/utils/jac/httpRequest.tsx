export const server = {
  token: 'a32b3f8d7d7688843087e20cf48aa75bfa184ffa8f4a8993a25da8ff4e924a4e',
  url: 'http://0.0.0.0:8099/js/walker_run',
  snt: "urn:uuid:321ffd09-e9aa-4716-b7f8-2443b4049ffb",
}



export async function HttpRequest(name: string, ctx: object | FormDataEntryValue | null) {
  let res = await fetch(server.url, {
    headers: {
      "Authorization": `Token ${server.token}`,
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      name: name,
      ctx: ctx,
      _req_ctx: {},
      snt: server.snt,
      profiling: false,
      is_async: false,
    }),

  });

  let data = await res.json();
  return data;
}


