1. Create GraphQL schema file: schema.graphql
2. Generate composite through command line or script - createCompositeFromGqlSchema()
3. Deploy the composite to the Ceramic node and request the Models to be indexed - deploy()
4. Generate a the runtime definition for use with GQL Client i.e Apollo - compileRuntimeForGqlClient()
5. Import the runtime definition to create a GQL client and use Apollo as normal!!! https://composedb.js.org/docs/0.3.x/guides/interacting/using-apollo

Spaces and Apps will be stored on-chain - the Ceramic DB will be used for off-chain app data only
Like:
DiscussionApp
Topic, Comment, Reaction
ChatServerApp
Channel, Message, Reaction
ClassifiedAds
Advert
Gallery
PodCast
Events / Ticketing
Gallery
Creations --> NFTs / Collectibles (On-Chain)
