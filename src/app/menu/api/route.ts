import got from "got";

//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const res = await got("https://jsonplaceholder.typicode.com/todos", {
    https: { rejectUnauthorized: false },
  }).json();
  // const users = await got("https://dealerportal.safaricom.co.ke/api/users", {
  //   https: { rejectUnauthorized: false },
  // }).json();

  //console.log(res);
  return Response.json(res);
  //return Response.json(users);
}

export async function POST(request: Request) {
  const {} = request.json();

  return Response.json({ user: 1 }, { status: 201 });
}
