import React from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "react-intl";
import Box from "js/components/Box";
import ListElement from "../ListElement";
import { mergeAddress } from "../../utils/text";

const PostAdresse = props => {
  const { adresse1, adresse2, adresse3, postnummer, land, intl } = props;
  const adresse = mergeAddress(adresse1, adresse2, adresse3);
  return (
    <Box
      header={intl.formatMessage({ id: "adresse.postadresse" })}
      id="postadresse"
    >
      <div className="address-box">
        <ul className="list-column-2">
          {adresse ? (
            <ListElement titleId="adresse.adresse" content={adresse} />
          ) : null}
          {postnummer ? (
            <ListElement titleId="adresse.postnummer" content={postnummer} />
          ) : null}
          {land ? <ListElement titleId="adresse.land" content={land} /> : null}
        </ul>
      </div>
    </Box>
  );
};

PostAdresse.propTypes = {
  intl: intlShape.isRequired,
  adresse1: PropTypes.string,
  adresse2: PropTypes.string,
  adresse3: PropTypes.string,
  land: PropTypes.string,
  postnummer: PropTypes.string
};

PostAdresse.defaultProps = {
  adresse1: "",
  adresse2: "",
  adresse3: "",
  land: "",
  postnummer: ""
};

export default injectIntl(PostAdresse);
