import { HttpsProxyAgent } from "hpagent";
import os from "os";

const workComputers = ["LTTECHMAC720-9.local"];

export default function proxy() {
  if (workComputers.includes(os.hostname()))
    return {
      agent: { https: new HttpsProxyAgent({ proxy: "http://proxy2:8080" }) },
    };
  else return {};
}
