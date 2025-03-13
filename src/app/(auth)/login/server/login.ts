"use server";

export async function _login(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const res = await fetch("login/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  console.log(await res.json());
}
