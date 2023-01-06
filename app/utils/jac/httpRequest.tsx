export const urls = {
  token: '1f9d62eca2649daf59a3e6e75dba04ea6834f5c14985243448684ee9ba721fe2',
  url: 'http://0.0.0.0:8099/js/walker_run',
  snt: "urn:uuid:321ffd09-e9aa-4716-b7f8-2443b4049ffb",
}



export async function HttpRequest(name: string, ctx: object | FormDataEntryValue | null) {
  let apiUrl = "http://0.0.0.0:8099/js/walker_run";
  let res = await fetch(apiUrl, {
    headers: {
      "Authorization": `Token ${urls.token}`,
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      name: name,
      ctx: ctx,
      _req_ctx: {},
      snt: urls.snt,
      profiling: false,
      is_async: false,
    }),

  });

  let data = await res.json();
  return data;
}


