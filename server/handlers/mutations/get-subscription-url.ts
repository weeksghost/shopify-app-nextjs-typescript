import "isomorphic-fetch";
import { gql } from "apollo-boost";
import { SHOPIFY_HOST } from "../../constants";
export function RECURRING_CREATE(url: string) {
  return gql`
    mutation {
      appSubscriptionCreate(
          name: "Super Duper Plan"
          returnUrl: "${url}"
          test: true
          lineItems: [
          {
            plan: {
              appUsagePricingDetails: {
                  cappedAmount: { amount: 10, currencyCode: USD }
                  terms: "$1 for 1000 emails"
              }
            }
          }
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 10, currencyCode: USD }
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}

export const getSubscriptionUrl = async (ctx: any) => {
  const { client } = ctx;
  const confirmationUrl = await client
    .mutate({
      mutation: RECURRING_CREATE(SHOPIFY_HOST),
    })
    .then(
      (response: any) => response.data.appSubscriptionCreate.confirmationUrl
    );

  return ctx.redirect(confirmationUrl);
};
