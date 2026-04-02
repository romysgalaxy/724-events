import { render, screen } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

describe("When a data context is created", () => {
  it("a call is executed on the events.json file", async () => {
    api.loadData = jest.fn().mockReturnValue({ result: "ok" });
    const Component = () => {
      const { data } = useData();
      return <div>{data?.result}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
    const dataDisplayed = await screen.findByText("ok");
    expect(dataDisplayed).toBeInTheDocument();
  });
  describe("and the events call failed", () => {
    it("the error is dispatched", async () => {
      window.console.error = jest.fn();
      api.loadData = jest.fn().mockRejectedValue("error on calling events");

      const Component = () => {
        const { error } = useData();
        return <div>{error}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );
      const dataDisplayed = await screen.findByText("error on calling events");
      expect(dataDisplayed).toBeInTheDocument();
    });
  });
  it("api.loadData", () => {
    window.console.error = jest.fn();
    global.fetch = jest.fn().mockResolvedValue(() =>
      Promise.resolve({
        json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
      })
    );
    const Component = () => {
      const { error } = useData();
      return <div>{error}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
  });
  describe("and the data is loaded", () => {
    it("the last event is the most recent by date", async () => {
      api.loadData = jest.fn().mockReturnValue({
        events: [
          { id: 1, type: "conférence", date: "2022-01-29T20:28:45.744Z", title: "Event January" },
          { id: 2, type: "forum", date: "2022-04-29T20:28:45.744Z", title: "Event April" },
          { id: 3, type: "soirée", date: "2022-02-15T20:28:45.744Z", title: "Event February" },
        ],
      });
      const Component = () => {
        const { last } = useData();
        return <div>{last?.title}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );
      const lastEvent = await screen.findByText("Event April");
      expect(lastEvent).toBeInTheDocument();
    });
    it("last is undefined when there are no events", async () => {
      api.loadData = jest.fn().mockReturnValue({ events: [] });
      const Component = () => {
        const { data, last } = useData();
        return (
          <div>
            <span>{data ? "loaded" : "loading"}</span>
            <span>{last ? last.title : "no-last"}</span>
          </div>
        );
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );
      await screen.findByText("loaded");
      expect(screen.getByText("no-last")).toBeInTheDocument();
    });
    it("data is not reloaded when already present", async () => {
      api.loadData = jest.fn().mockReturnValue({ result: "ok" });
      const Component = () => {
        const { data } = useData();
        return <div>{data?.result}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );
      await screen.findByText("ok");
      expect(api.loadData).toHaveBeenCalledTimes(1);
    });
  });
});
