import { CeramicClient } from "@ceramicnetwork/http-client";
import { Composite } from "@composedb/devtools";
import {
  readEncodedComposite,
  writeEncodedComposite,
} from "@composedb/devtools-node";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

const ceramic = new CeramicClient("http://localhost:7007");

class MyComposite {
  constructor() {}

  async init() {
    const ceramic = new CeramicClient("http://localhost:7007");
    const composite = await Composite.fromModels({
      ceramic,
      models: [
        "kjzl6hvfrbw6ca7nidsnrv78x7r4xt0xki71nvwe4j5a3s9wgou8yu3aj8cz38e",
      ],
    });

    await writeEncodedComposite(composite, "my-first-composite.json");
  }

  async deploy() {
    // Replace by the URL of the Ceramic node you want to deploy the Models to
    const ceramic = new CeramicClient("http://localhost:7007");

    // Replace by the path to the local encoded composite file
    const composite = await readEncodedComposite(
      ceramic,
      "my-first-composite.json"
    );

    console.log("Model IDs to set in configuration:", composite.modelIDs);
  }
}

new MyComposite().init();
