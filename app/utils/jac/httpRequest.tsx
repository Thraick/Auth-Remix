export const server = {
  token: '5c031ab4571107fef5f67f297c3eba2124399a2d02353a3a997f67169c95df56',
  url: 'http://0.0.0.0:8099/js/walker_run',
  snt: "urn:uuid:247433f6-9b06-46b4-bfec-de3feaf9b990",
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


