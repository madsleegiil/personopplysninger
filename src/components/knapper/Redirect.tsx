import React from "react";
import redirectsJson from "utils/redirects.json";
import tilbakeIkon from "assets/img/Back.svg";

const redirects: {
  [key: string]: { knapp: string; url: string };
} = redirectsJson;

interface Props {
  tjeneste: string;
}

const RedirectKnapp = (props: Props) => {
  const redirect = redirects[props.tjeneste] as any;
  return (
    <div className="redirect__container">
      <a href={redirect.url} className="redirect__wrapper">
        <span className="kilde__icon">
          <img src={tilbakeIkon} alt="Ekstern lenke" />
        </span>
        {redirect.knapp}
      </a>
    </div>
  );
};

export default RedirectKnapp;
