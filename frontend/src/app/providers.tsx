"use client";

import SpinnerbLoader from "@/components/ui/SpinnerbLoader";
import { Toaster } from "@/components/ui/sonner";
import type React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore } from "../lib/store";
import ChatWidget from "@/components/ai-elements/chat-widget";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  const { store, persistor } = makeStore();

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex min-h-screen items-center justify-center">
            <SpinnerbLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
          </div>
        }
        persistor={persistor}
      >
        <Toaster />
        {children}
        <ChatWidget />
      </PersistGate>
    </Provider>
  );
};

export default Providers;
