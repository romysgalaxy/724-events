import { fireEvent, render, screen, within } from "@testing-library/react";
import Home from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const data = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description: "Présentation des outils analytics",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d'exposition"],
    },
  ],
  focus: [
    {
      title: "World economic forum",
      description: "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-02-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
  ],
};

const renderHome = () => {
  window.console.error = jest.fn();
  api.loadData = jest.fn().mockReturnValue(data);
  return render(
    <DataProvider>
      <Home />
    </DataProvider>
  );
};

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    renderHome();
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      renderHome();
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Message envoyé !");
    });
  });

});


describe("Test E2E — Parcours de contact utilisateur", () => {
  it("Étape 1 : le formulaire affiche bien tous ses champs (Nom, Prénom, Email, Message)", async () => {
    renderHome();
    await screen.findByText("Email");
    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Prénom")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByText("Personel / Entreprise")).toBeInTheDocument();
  });

  it("Étape 2 : l'utilisateur peut saisir ses informations dans tous les champs", async () => {
    renderHome();
    await screen.findByText("Email");

    const nomInput = screen.getByText("Nom").parentElement.querySelector("input");
    const prenomInput = screen.getByText("Prénom").parentElement.querySelector("input");
    const emailInput = screen.getByText("Email").parentElement.querySelector("input");
    const messageInput = screen.getByText("Message").parentElement.querySelector("textarea");

    fireEvent.change(nomInput, { target: { value: "Dupont" } });
    fireEvent.change(prenomInput, { target: { value: "Marie" } });
    fireEvent.change(emailInput, { target: { value: "marie@test.com" } });
    fireEvent.change(messageInput, {
      target: { value: "Bonjour, je souhaite organiser un événement." },
    });

    expect(nomInput.value).toBe("Dupont");
    expect(prenomInput.value).toBe("Marie");
    expect(emailInput.value).toBe("marie@test.com");
    expect(messageInput.value).toBe("Bonjour, je souhaite organiser un événement.");
  });

  it("Étape 3 : l'utilisateur peut sélectionner « Entreprise » dans le menu déroulant", async () => {
    renderHome();
    await screen.findByText("Personel / Entreprise");

    const select = screen.getByText("Personel / Entreprise").parentElement;
    fireEvent.click(within(select).getByTestId("collapse-button-testid"));
    fireEvent.click(within(select).getByText("Entreprise"));

    expect(within(select).getByText("Entreprise")).toBeInTheDocument();
  });

  it("Étape 4 : la soumission du formulaire déclenche bien l'état de chargement « En cours »", async () => {
    renderHome();
    fireEvent.click(await screen.findByText("Envoyer"));
    await screen.findByText("En cours");
  });

  it("Étape 5 : la modale de confirmation « Message envoyé ! » s'affiche après envoi", async () => {
    renderHome();
    fireEvent.click(await screen.findByText("Envoyer"));
    await screen.findByText("Message envoyé !");
    expect(screen.getByText(/Merci pour votre message/i)).toBeInTheDocument();
  });

  it("Étape 6 : la modale peut être fermée par l'utilisateur via le bouton de fermeture", async () => {
    renderHome();
    fireEvent.click(await screen.findByText("Envoyer"));
    await screen.findByText("Message envoyé !");
    fireEvent.click(screen.getByTestId("close-modal"));
    expect(screen.queryByText("Message envoyé !")).not.toBeInTheDocument();
  });
});

describe("When a page is created", () => {
  it("a list of events is displayed", async () => {
    renderHome();
    const headings = await screen.findAllByText("Nos réalisations");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  })
  it("a list a people is displayed", async () => {
    renderHome();
    const headings = await screen.findAllByText("Notre équipe");
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Samira")).toBeInTheDocument();
    expect(screen.getByText("Jean-baptiste")).toBeInTheDocument();
  })
  it("a footer is displayed", async () => {
    renderHome();
    await screen.findByText("Contactez-nous");
    expect(screen.getByText("contact@724events.com")).toBeInTheDocument();
    expect(screen.getByText("45 avenue de la République, 75000 Paris")).toBeInTheDocument();
  })
  it("an event card, with the last event, is displayed", async () => {
    renderHome();
    await screen.findByText("Notre derniére prestation");
    const lastEventLabels = await screen.findAllByText("soirée entreprise");
    expect(lastEventLabels.length).toBeGreaterThanOrEqual(1);
  })
});
