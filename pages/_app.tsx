import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { NextPageContext } from "next";
import type { AppProps } from "next/app";

import { AppProvider } from "@shopify/polaris";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { ClientApplication } from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";

function userLoggedInFetch<S>(app: ClientApplication<S>) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri: string, options: RequestInit) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return new Response(null, { status: 302 });
    }

    return response;
  };
}

function ShopifyApolloProvider(props: { Component: React.ElementType }) {
  const app = useAppBridge();
  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });
  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} />
    </ApolloProvider>
  );
}
interface ShopifyAppProps extends AppProps {
  host: string;
}
// @ts-ignore this gets replaced at compile time by webpack
const apiKey = API_KEY;
const ShopifyApp = (props: ShopifyAppProps) => {
  const { Component, pageProps, host } = props;
  return (
    <AppProvider i18n={translations}>
      <Provider
        config={{
          apiKey,
          host: host,
          forceRedirect: true,
        }}
      >
        <ShopifyApolloProvider Component={Component} {...pageProps} />
      </Provider>
    </AppProvider>
  );
};
// Note GetServerSide props doesn't work on _app.tsx
ShopifyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  return {
    host: ctx.query.host,
  };
};

export default ShopifyApp;
