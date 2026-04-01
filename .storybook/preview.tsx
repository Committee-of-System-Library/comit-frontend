import type { Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import "../src/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#121212" },
      ],
    },
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        desktopMin1200: {
          name: "Desktop 1200 (min)",
          styles: { width: "1200px", height: "900px" },
          type: "desktop",
        },
        desktopBase1440: {
          name: "Desktop 1440 (base)",
          styles: { width: "1440px", height: "1024px" },
          type: "desktop",
        },
        desktopMax1920: {
          name: "Desktop 1920 (max)",
          styles: { width: "1920px", height: "1080px" },
          type: "desktop",
        },
      },
      defaultViewport: "desktopBase1440",
    },
    options: {
      storySort: {
        order: ["Foundations", "Layout", "Pages", "*"],
      },
    },
    controls: {
      expanded: true,
      sort: "requiredFirst",
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
