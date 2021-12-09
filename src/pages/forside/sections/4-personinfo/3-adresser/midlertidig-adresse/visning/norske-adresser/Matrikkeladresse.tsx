import React from "react";
import Postnummer from "../../../komponenter/Postnummer";
import { Matrikkeladresse as MatrikkeladresseType } from "types/adresser/adresse";
import { Normaltekst } from "nav-frontend-typografi";

const Matrikkeladresse = (props: MatrikkeladresseType) => {
  const { bruksenhetsnummer, tilleggsnavn, postnummer } = props;
  const { poststed, kommunenummer, coAdressenavn } = props;
  return (
    <>
      {coAdressenavn && (
        <div className="adresse__linje">
          <Normaltekst>{coAdressenavn}</Normaltekst>
        </div>
      )}
      {bruksenhetsnummer && (
        <div className="adresse__linje">
          <Normaltekst>{bruksenhetsnummer}</Normaltekst>
        </div>
      )}
      {tilleggsnavn && (
        <div className="adresse__linje">
          <Normaltekst>{tilleggsnavn}</Normaltekst>
        </div>
      )}
      <Postnummer postnummer={postnummer} poststed={poststed} />
      <div className="adresse__divider" />
    </>
  );
};

export default Matrikkeladresse;
