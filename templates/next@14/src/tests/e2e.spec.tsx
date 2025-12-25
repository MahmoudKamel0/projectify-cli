import Home from "@app/page";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("Page", () => {
    render(<Home />);
    // Replace "" with the test id you expect to be present in the component
    expect(screen.getByTestId("home-page")).toBeDefined();
});
