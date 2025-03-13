// * NPM
import got from "got";

// * Helpers
import proxy from "@/helpers/effectProxy";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const res = await got(
    "https://jsonplaceholder.typicode.com/todos/1",
    proxy()
  ).json();
  return Response.json(res);
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json(body, { status: 201 });
}

export async function PUT(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 201 });
}

export async function PATCH(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 201 });
}

export async function DELETE(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 204 });
}
