export async function POST() {
  const url = "https://www.quimicamoronsrl.com/fronttienda/obtenerproductos/";

  const body = {
    filter: {
      descripcion: null,
      idCategoria: null,
    },
    absolutePage: 0,
    pageSize: 20,
    orden: [],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: "jsondata=" + encodeURIComponent(JSON.stringify(body)),
  });

  const data = await response.json();

  return Response.json(data);
}
