import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "./server";

describe("MSW test boundary", () => {
  it("intercepts an HTTP request without external network access", async () => {
    server.use(
      http.get("https://nodrama.test/api/health", () =>
        HttpResponse.json({
          ok: true,
          service: "nodrama",
        })
      )
    );

    const response = await fetch("https://nodrama.test/api/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      service: "nodrama",
    });
  });
});
