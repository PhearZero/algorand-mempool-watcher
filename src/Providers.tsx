import {PROVIDER_ID, useInitializeProviders, WalletProvider} from "@txnlab/use-wallet";
import LuteConnect from "lute-connect";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {PropsWithChildren} from "react";
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./theme.ts";
import {DeflyWalletConnect} from "@blockshake/defly-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import { DaffiWalletConnect } from "@daffiwallet/connect";
export function Providers({client, children}: {client: QueryClient} & PropsWithChildren){
    const providers = useInitializeProviders({
        providers: [
            {id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect},
            {id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect},
            { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
            {id: PROVIDER_ID.EXODUS},
            {
                id: PROVIDER_ID.LUTE,
                clientStatic: LuteConnect,
                clientOptions: { siteName: 'YourSiteName' }
            },
            {id: PROVIDER_ID.KIBISIS}
        ]
    });
    return (
        <ThemeProvider theme={theme}>
        <WalletProvider value={providers}>
            <QueryClientProvider client={client}>
                {children}
                <CssBaseline />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </WalletProvider>
        </ThemeProvider>
    )
}
