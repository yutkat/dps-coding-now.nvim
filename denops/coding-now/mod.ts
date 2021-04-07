import { start } from "https://deno.land/x/denops_std@v0.4/mod.ts";
import {
  GraphQLClient,
  GraphQLRequest,
  GraphQLResponse,
  Operation,
  OperationType,
} from "https://deno.land/x/fetch_graphql@v1.0.0/mod.ts";

let githubToken = "";

async function sendGraphql(operation: Operation): Promise<GraphQLResponse> {
  const client = new GraphQLClient({
    url: "https://api.github.com/graphql",
  });
  const gqlRequest = new GraphQLRequest()
    .add(operation)
    .withAuthToken(githubToken);

  return await client.send(gqlRequest);
}

async function getUserStatus(): Promise<void> {
  const GetStatusQuery = {
    operationType: OperationType.Query,
    field: {
      name: "viewer",
      children: [
        {
          name: "status",
          children: [
            "message",
          ],
        },
      ],
    },
  };

  const gqlResponse = await sendGraphql(GetStatusQuery);
  if (gqlResponse.hasError()) {
    gqlResponse.errors.forEach(console.error);
    gqlResponse.throwFirstError();
  }

  interface ViewerResult {
    status: StatusResult;
  }
  interface StatusResult {
    message: string;
  }
  const result = gqlResponse.getData<ViewerResult>(GetStatusQuery);
  console.log(`[CodingNow] Current setting: ${result.status.message}`);
}

async function changeUserStatus(...args: unknown[]): Promise<void> {
  let messageContent = "";
  if (Array.isArray(args)) {
    messageContent = args.join("");
  } else if (typeof args === "string") {
    messageContent = args;
  }
  if (messageContent === "") {
    console.log("[CodingNow] Message is empty");
    return;
  }

  const message = `{message: "${messageContent}"}`;
  // mutation MyMutation {
  //   __typename
  //   changeUserStatus(input: {message: "bbb"}) {
  //     clientMutationId
  //   }
  // }
  const ChangeUserStatusMutation = {
    operationType: OperationType.Mutation,
    field: {
      name: "changeUserStatus",
      args: [
        {
          name: "input",
          value: message,
        },
      ],
      children: [
        "clientMutationId",
      ],
    },
  };

  const gqlResponse = await sendGraphql(ChangeUserStatusMutation);
  if (gqlResponse.hasError()) {
    gqlResponse.errors.forEach(console.error);
    gqlResponse.throwFirstError();
  }

  interface ChangeUserStatusResult {
    clientMutationId: string;
  }
  gqlResponse.getData<ChangeUserStatusResult>(
    ChangeUserStatusMutation,
  );
}

start(async (vim) => {
  const e = Deno.env.get("CODING_NOW_GITHUB_TOKEN");
  if (typeof e === "undefined") {
    console.log("[CodingNow] No CODING_NOW_GITHUB_TOKEN env variable found");
    return;
  }
  if (e === "") {
    console.log("[CodingNow] CODING_NOW_GITHUB_TOKEN is empty");
    return;
  }
  githubToken = e;

  const messageContent = await vim.g.get(
    "coding_now_message",
    '["I\'m coding ", &filetype]',
  );
  if (messageContent === null) {
    console.log("[CodingNow] Cannot get g:coding_now_message");
    return;
  }

  vim.register({
    getUserStatus,
    changeUserStatus,
  });

  await vim.execute(`
    command! CodingNowRead call denops#request("${vim.name}", "getUserStatus", [])
    `);
  await vim.execute(`
    command! CodingNowWrite call denops#request("${vim.name}", "changeUserStatus", ${messageContent})
    `);

  await vim.execute(`
augroup coding_now
  autocmd!
  autocmd BufWinEnter,WinEnter * CodingNowWrite
augroup END
    `);
});
