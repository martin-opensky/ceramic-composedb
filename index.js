import { CeramicClient } from "@ceramicnetwork/http-client";
import { Composite } from "@composedb/devtools";
import { createComposite } from "@composedb/devtools-node";
import { writeEncodedCompositeRuntime } from "@composedb/devtools-node";
import {
  readEncodedComposite,
  writeEncodedComposite,
} from "@composedb/devtools-node";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";
import dotenv from "dotenv";
dotenv.config();

const DID_PRIVATE_KEY = process.env.DID_PRIVATE_KEY;

class MyComposite {
  constructor() {}

  async initCeramic() {
    // Hexadecimal-encoded private key for a DID having admin access to the target Ceramic node
    const privateKey = fromString(DID_PRIVATE_KEY, "base16");

    // Create a DID instance
    const did = new DID({
      resolver: getResolver(),
      provider: new Ed25519Provider(privateKey),
    });
    await did.authenticate();

    // Replace by the URL of the Ceramic node you want to deploy the Models to
    const ceramic = new CeramicClient("http://localhost:7007");
    // An authenticated DID with admin access must be set on the Ceramic instance
    ceramic.did = did;

    return ceramic;
  }

  // For models that already exist on Ceramic
  //   async fromExistingModel() {
  //     const ceramic = new CeramicClient("http://localhost:7007");
  //     const composite = await Composite.fromModels({
  //       ceramic,
  //       models: [
  //         "kjzl6hvfrbw6ca7nidsnrv78x7r4xt0xki71nvwe4j5a3s9wgou8yu3aj8cz38e",
  //       ],
  //     });

  //     await writeEncodedComposite(composite, "new-composite.json");

  //     return this;
  //   }

  // Build a JSON composite model from a GraphQL Schema
  async createCompositeFromGqlSchema() {
    const ceramic = await this.initCeramic();
    const composite = await createComposite(ceramic, "data/schema.graphql");

    // https://composedb.js.org/docs/0.3.x/guides/using-composites/customization#aliasing-models
    const compositeAliases = composite.setAliases({
      kjzl6hvfrbw6cb99zr0ye9880rfu8iqudgeaky5f7utmnwf4pon8mbjtljb2ifk:
        "Accounts",
      kjzl6hvfrbw6c53e9n9jo7c1leu97rkmwbg73sq4n039to7ovudo5io2dgnirv4: "Notes",
    });

    // Create Composite JSON file
    await writeEncodedComposite(compositeAliases, "data/new-composite.json");
  }

  async compileRuntimeForGqlClient() {
    const ceramic = await this.initCeramic();

    // https://composedb.js.org/docs/0.3.x/client-setup#compiling-the-composite
    await writeEncodedCompositeRuntime(
      ceramic,
      "data/new-composite.json",
      "src/__generated__/definition.ts"
    );
  }

  // Deploy a composite JSON model to Ceramic node and index the model
  async deploy() {
    const ceramic = await this.initCeramic();

    // Replace by the path to the local encoded composite file
    const composite = await readEncodedComposite(
      ceramic,
      "data/new-composite.json"
    );

    // Notify the Ceramic node to index the models present in the composite
    await composite.startIndexingOn(ceramic);
  }
}

const composeDb = new MyComposite();
// await composeDb.fromExistingModel();
await composeDb.createCompositeFromGqlSchema();
await composeDb.deploy();
await composeDb.compileRuntimeForGqlClient();
