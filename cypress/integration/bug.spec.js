describe("api call", () => {
  it(
    "should see api calls made in correct order",
    { retries: { openMode: 1000 } },
    () => {
      cy.intercept(/\/api/).as("api");

      cy.visit("http://localhost:3000/");

      cy.wait(["@api", "@api", "@api"]).spread((first, second, third) => {
        console.log([first, second, third]);

        try {
          expect(first.request.body).to.contain("first");
          expect(second.request.body).to.contain("second");
          expect(third.request.body).to.contain("third");
          throw new Error("Trigger retry");
        } catch (e) {
          if (e.message === "Trigger retry") {
            throw e;
          }
        }
      });
    }
  );
});
