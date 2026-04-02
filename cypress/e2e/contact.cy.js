describe("Contact flow", () => {
  it("should display the home page, fill the contact form, submit it, and show the success message", () => {
    cy.visit("/");

    // Verify the home page is loaded
    cy.get("header").should("be.visible");

    // Navigate to the contact section
    cy.get(".FormContainer").scrollIntoView();
    cy.contains("h2", "Contact").should("be.visible");

    // Fill in the form fields
    cy.get(".FormContainer").within(() => {
      cy.contains("label", "Nom").parent().find("input").type("Dupont");
      cy.contains("label", "Prénom").parent().find("input").type("Marie");
      cy.contains("label", "Email").parent().find("input").type("marie@test.com");
      cy.contains("label", "Message").parent().find("textarea").type("Bonjour, je souhaite organiser un événement.");

      // Select "Personel / Entreprise"
      cy.get("[data-testid='collapse-button-testid']").click();
      cy.contains("Entreprise").click();

      // Submit the form
      cy.contains("button", "Envoyer").click();

      // Verify the loading state
      cy.contains("button", "En cours").should("be.visible");
    });

    // Verify the success message is displayed in the modal
    cy.get(".modal").should("be.visible");
    cy.contains("Message envoyé !").should("be.visible");
    cy.contains("Merci pour votre message").should("be.visible");

    // Close the modal
    cy.get("[data-testid='close-modal']").click();
    cy.get(".modal").should("not.exist");
  });
});
