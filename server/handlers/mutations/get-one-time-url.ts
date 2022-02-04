import "isomorphic-fetch";
import { gql } from "apollo-boost";
import { SHOPIFY_HOST } from "server/constants";

export function ONETIME_CREATE(url: string) {
  return gql`
    mutation {
      appPurchaseOneTimeCreate(
        name: "test"
        price: { amount: 10, currencyCode: USD }
        returnUrl: "${url}"
        test: true
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
        appPurchaseOneTime {
          id
        }
      }
    }
  `;
}

export const getOneTimeUrl = async (ctx: any) => {
  const { client } = ctx;
  const confirmationUrl = await client
    .mutate({
      mutation: ONETIME_CREATE(SHOPIFY_HOST),
    })
    .then(
      (response: any) => response.data.appPurchaseOneTimeCreate.confirmationUrl
    );
  return ctx.redirect(confirmationUrl);
};
