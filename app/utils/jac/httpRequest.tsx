export const server = {
  token: 'aa6748c2b60c4f645f4fefcd5a3035a00d31a6f8d691718cf8f44fbfe7dc4b00',
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


