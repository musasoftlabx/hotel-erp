import path from "path";

export default async function serverProps() {
  const filename = path.parse(__filename).name;
  return {
    apiUrl: filename,
    permissions: () => ["Super Admin", "Admin", "User"],
  };
}
