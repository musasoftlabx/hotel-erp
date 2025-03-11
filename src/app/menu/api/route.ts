import got from "got";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const res = await got("https://jsonplaceholder.typicode.com/todos/1").json();
  return Response.json(res);
}

export async function POST(request: Request) {
  const {} = request.json();

  return Response.json({ user: 1 }, { status: 201 });
}
