"use client";

import ChatWidget from "@/components/ai-elements/chat-widget";
import CartSyncer from "@/components/cart/CartSyncer";
import SpinnerbLoader from "@/components/ui/SpinnerbLoader";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore } from "../lib/store";

type Props = {
  children: React.ReactNode;
};

// Create a client
const queryClient = new QueryClient();

const Providers = ({ children }: Props) => {
  const { store, persistor } = makeStore();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate
          loading={
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <SpinnerbLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
            </div>
          }
          persistor={persistor}
        >
          <Toaster />
          {children}
          <CartSyncer />
          <ChatWidget />
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
