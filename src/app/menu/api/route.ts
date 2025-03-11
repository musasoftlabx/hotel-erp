import got from "got";

export async function GET() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  const a = res.json();
  console.log(a);
  return Response.json(a);

  // const res = got("https://jsonplaceholder.typicode.com/todos").json();
  // return Response.json(res);

  //return Response.json({ user: 1 });
}

export async function POST(request: Request) {
  const {} = request.json();

  return Response.json({ user: 1 }, { status: 201 });
}
