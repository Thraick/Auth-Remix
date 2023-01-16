export const server = {
  token: 'c2fa5c28c1ad49b8ba959a81100e5ba2a5a45f6928d1b6044edeb28b4ff57a36',
  url: 'http://0.0.0.0:8099/js/walker_run',
  snt: "urn:uuid:4325ed87-ee28-412c-946c-7705e7d96560",
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


