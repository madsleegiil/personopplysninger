import "@testing-library/jest-dom";
import { IntlProvider } from "react-intl";
import nbMessages from "text/nb";
import personInfo from "../../clients/apiMock/app/fetch/person-info.json";
import personInfoUtenlandskbank from "../../clients/apiMock/app/fetch/person-info-utenlandskbank.json";
import Utbetalinger from "../../pages/forside/sections/4-personinfo/4-utbetalinger/Utbetalinger";
import { StoreProvider } from "../../store/Context";
import { render } from "@testing-library/react";
import { UtenlandskBankkonto } from "../../types/personalia";

jest.mock("react-modal");

describe("Utbetalinger", () => {
  it("with kontonummer renders correctly", () => {
    const { asFragment } = render(
      <StoreProvider>
        <IntlProvider locale={"nb"} messages={nbMessages}>
          <Utbetalinger
            kontonr={personInfo.personalia.kontonr}
            kontoregisterStatus={"OK"}
          />
        </IntlProvider>
      </StoreProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("with utenlandsk bank renders correctly", () => {
    const { asFragment } = render(
      <StoreProvider>
        <IntlProvider locale={"nb"} messages={nbMessages}>
          <Utbetalinger
            utenlandskbank={
              personInfoUtenlandskbank.personalia
                .utenlandskbank as unknown as UtenlandskBankkonto
            }
            kontoregisterStatus={"OK"}
          />
        </IntlProvider>
      </StoreProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
