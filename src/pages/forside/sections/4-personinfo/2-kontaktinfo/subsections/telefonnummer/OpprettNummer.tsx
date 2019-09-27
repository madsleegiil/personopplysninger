import { FormattedMessage } from "react-intl";
import { Input, Select } from "nav-frontend-skjema";
import React, { useState } from "react";
import { Knapp } from "nav-frontend-knapper";
import { FormContext, FormValidation, ValidatorContext } from "calidation";
import { fetchPersonInfo, postTlfnummer } from "clients/apiClient";
import avbrytIkon from "assets/img/Back.svg";
import { Element } from "nav-frontend-typografi";
import { NedChevron } from "nav-frontend-chevron";
import { Tlfnr } from "types/personalia";
import SelectLandskode from "components/felter/kodeverk/SelectLandskode";
import { isNorwegianNumber, sjekkForFeil } from "utils/validators";
import { PersonInfo } from "types/personInfo";
import { useStore } from "providers/Provider";
import { InjectedIntlProps, injectIntl } from "react-intl";
import Alert, { AlertType } from "components/alert/Alert";

interface Props {
  onCancelClick: () => void;
  onChangeSuccess: () => void;
  tlfnr?: Tlfnr;
}

const OpprettTelefonnummer = (props: Props & InjectedIntlProps) => {
  const [loading, settLoading] = useState(false);
  const [alert, settAlert] = useState<AlertType | undefined>();
  const { tlfnr, onChangeSuccess, intl } = props;
  const [, dispatch] = useStore();

  const initialValues = {
    landskode: {
      label: "Norge",
      value: "+47"
    }
  };

  const formConfig = {
    type: {
      isRequired: {
        message: intl.messages["validation.type.pakrevd"]
      },
      isWhitelisted: {
        message: intl.messages["validation.type.pakrevd"],
        whitelist: ["MOBIL", "ARBEID", "HJEM"]
      }
    },
    landskode: {
      isRequired: intl.messages["validation.retningsnr.pakrevd"]
    },
    tlfnummer: {
      isRequired: intl.messages["validation.tlfnr.pakrevd"],
      isNumber: intl.messages["validation.tlfnr.siffer"],
      isValidNorwegianNumber: {
        message: intl.messages["validation.tlfnr.norske"],
        validateIf: ({ fields }: ValidatorContext) =>
          isNorwegianNumber(fields.landskode)
      },
      isMaxLength: {
        message: intl.messages["validation.tlfnr.makslengde"],
        length: 16
      }
    }
  };

  const getUpdatedData = () =>
    fetchPersonInfo().then(personInfo => {
      dispatch({
        type: "SETT_PERSON_INFO_RESULT",
        payload: personInfo as PersonInfo
      });
    });

  const submit = (e: FormContext) => {
    const { isValid, fields } = e;
    const { type, landskode, tlfnummer } = fields;

    if (isValid) {
      const outbound = {
        type,
        landskode: landskode.value,
        nummer: tlfnummer
      };

      settLoading(true);
      postTlfnummer(outbound)
        .then(getUpdatedData)
        .then(onChangeSuccess)
        .catch((error: AlertType) => settAlert(error))
        .then(() => settLoading(false));
    }
  };

  return (
    <>
      <div className="tlfnummer__divider" />
      <FormValidation
        onSubmit={submit}
        config={formConfig}
        initialValues={initialValues}
        className={"tlfnummer__rad-leggtil"}
      >
        {({ errors, fields, submitted, isValid, setField }) => {
          const tlfNummerMaxLength =
            fields.landskode && fields.landskode.value === "+47" ? 8 : 16;

          return (
            <>
              <div className={"tlfnummer__container"}>
                <div className={"tlfnummer__verdi"}>
                  <Element>
                    <FormattedMessage id="side.leggtil" />
                  </Element>
                  <div className={"tlfnummer__chevron"}>
                    <NedChevron />
                  </div>
                </div>
              </div>
              <div className={"tlfnummer__container"}>
                <Select
                  value={fields.type}
                  label={intl.messages["felter.type.label"]}
                  onChange={e => setField({ type: e.target.value })}
                  bredde={"s"}
                  feil={sjekkForFeil(submitted, errors.type)}
                >
                  <option>{intl.messages["felter.type.velg"]}</option>
                  {(!tlfnr || (tlfnr && !tlfnr.mobil)) && (
                    <option value="MOBIL">
                      {intl.messages["personalia.tlfnr.mobil"]}
                    </option>
                  )}
                  {(!tlfnr || (tlfnr && !tlfnr.jobb)) && (
                    <option value="ARBEID">
                      {intl.messages["personalia.tlfnr.arbeid"]}
                    </option>
                  )}
                  {(!tlfnr || (tlfnr && !tlfnr.privat)) && (
                    <option value="HJEM">
                      {intl.messages["personalia.tlfnr.hjem"]}
                    </option>
                  )}
                </Select>
              </div>
              <div className={"tlfnummer__input-container"}>
                <div className={"tlfnummer__input input--s"}>
                  <SelectLandskode
                    option={fields.landskode}
                    label={intl.messages["felter.landkode.label"]}
                    onChange={option => setField({ landskode: option })}
                    error={errors.landskode}
                    submitted={submitted}
                  />
                </div>
                <div className={"tlfnummer__input input--m"}>
                  <Input
                    type={"tel"}
                    bredde={"M"}
                    value={fields.tlfnummer}
                    maxLength={tlfNummerMaxLength}
                    label={intl.messages["felter.tlfnr.label"]}
                    onChange={e => setField({ tlfnummer: e.target.value })}
                    feil={sjekkForFeil(submitted, errors.tlfnummer)}
                  />
                </div>
              </div>
              <div className={"tlfnummer__knapper"}>
                <div className={"tlfnummer__submit"}>
                  <Knapp
                    type={"standard"}
                    htmlType={"submit"}
                    disabled={submitted && !isValid}
                    autoDisableVedSpinner={true}
                    spinner={loading}
                  >
                    <FormattedMessage id={"side.lagre"} />
                  </Knapp>
                </div>
                <Knapp
                  type={"flat"}
                  htmlType={"button"}
                  disabled={loading}
                  className={"tlfnummer__knapp"}
                  onClick={props.onCancelClick}
                >
                  <div className={"tlfnummer__knapp-tekst"}>
                    <FormattedMessage id={"side.avbryt"} />
                  </div>
                  <div className={"tlfnummer__knapp-ikon"}>
                    <img alt={"Avbryt"} src={avbrytIkon} />
                  </div>
                </Knapp>
              </div>
              {alert && <Alert {...alert} />}
            </>
          );
        }}
      </FormValidation>
    </>
  );
};

export default injectIntl(OpprettTelefonnummer);
