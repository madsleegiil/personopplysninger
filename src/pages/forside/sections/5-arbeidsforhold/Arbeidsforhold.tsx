import React from "react";
import Box from "components/box/Box";
import { ListeMedArbeidsforhold, AFListeOnClick } from "@navikt/arbeidsforhold";
import arbeidsforholdIkon from "assets/img/Arbeidsforhold.svg";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import Environment from "Environments";
import { Link } from "react-router-dom";
import { basePath } from "App";
import { AlertStripeInfo } from "nav-frontend-alertstriper";
import Kilde from "components/kilde/Kilde";

const environment = Environment();
const miljo = environment.miljo as "LOCAL" | "Q0" | "Q1" | "PROD";

const Arbeidsforhold = () => {
  const { locale } = useIntl();

  const onClick = {
    type: "REACT_ROUTER_LENKE",
    Component: Link,
    to: `${basePath}/arbeidsforhold/{id}`
  } as AFListeOnClick;

  return (
    <Box
      id="arbeidsforhold"
      tittel="arbeidsforhold.tittel"
      beskrivelse="arbeidsforhold.beskrivelse"
      icon={arbeidsforholdIkon}
    >
      <div className="arbeidsforhold">
        <ListeMedArbeidsforhold
          locale={locale as "nb" | "en"}
          miljo={miljo}
          onClick={onClick}
        />
      </div>
      <div className="arbeidsforhold__disclaimer">
        <AlertStripeInfo>
          <FormattedHTMLMessage id="arbeidsforhold.disclaimer" />
        </AlertStripeInfo>
      </div>
      <Kilde kilde="arbeidsforhold.kilde" lenkeType="INGEN" />
    </Box>
  );
};
export default Arbeidsforhold;
