import React from "react";
import { FormattedHTMLMessage } from "react-intl";
import { Normaltekst, Systemtittel } from "nav-frontend-typografi";
import veilederIkon from "assets/img/Veileder.svg";
import Veilederpanel from "nav-frontend-veilederpanel";
import Error from "components/error/Error";
import Spinner from "../4-personinfo/PersonInfo";
import { formatName } from "utils/text";
import { useStore } from "providers/Provider";

const Header = () => {
  const [{ nameInfo }] = useStore();

  switch (nameInfo.status) {
    default:
    case "LOADING":
      return <Spinner />;
    case "RESULT":
      const { name } = nameInfo.data;
      const fornavn = name.split(" ")[0];
      const Veileder = (
        <img src={veilederIkon} className="header__ikon" alt="Veileder" />
      );

      return (
        <div className="header">
          <Veilederpanel svg={Veileder} type={"plakat"} kompakt={true}>
            <div className="box__container header__content">
              <Systemtittel>
                <FormattedHTMLMessage
                  id="header.hello"
                  values={{ name: formatName(fornavn) || "" }}
                />
              </Systemtittel>
              <div className="header__seksjon">
                <Normaltekst>
                  <FormattedHTMLMessage id="header.obs" />
                </Normaltekst>
              </div>
              <div className="header__seksjon">
                <Normaltekst>
                  <FormattedHTMLMessage id="header.description" />
                </Normaltekst>
              </div>
            </div>
          </Veilederpanel>
        </div>
      );
    case "ERROR":
      return <Error error={nameInfo.error} />;
  }
};
export default Header;
