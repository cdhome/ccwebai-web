import { render, screen } from "@testing-library/react";
import App from "@/App";
import { vi } from "vitest";

describe("App", () => {
  it("renders the marketing hero on the home page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          metrics: [
            { label: "累计安装量", value: "0", delta: "all time" },
            { label: "7日累计对话数", value: "0", delta: "7 days" },
            { label: "7日活跃设备数", value: "0", delta: "7 days" },
            { label: "覆盖全球国家数", value: "0", delta: "global" },
          ],
          installationTrend: [],
          usageTrend: [],
          regions: [],
          providers: [],
          versions: [],
        }),
      })
    );

    window.history.pushState({}, "", "/");
    render(<App />);

    expect(await screen.findByText(/桥接 Web 免费算力/)).toBeInTheDocument();
    expect(screen.getAllByText("CC-WebAI").length).toBeGreaterThan(0);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
});
