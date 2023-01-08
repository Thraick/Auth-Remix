export const server = {
  token: '82f89ba89a5e0dda7c1cdc440036f21d17dc1cec62faa7349252d0b37271319d',
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


