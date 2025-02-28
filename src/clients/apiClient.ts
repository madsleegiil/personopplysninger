import { logApiError } from "../utils/logger";
import { FeatureToggles } from "../store/Store";
import { OutboundTlfnummer } from "../pages/forside/sections/4-personinfo/2-kontaktinfo/subsections/telefonnummer/Telefonnummer";
import { TPSResponse } from "../types/tps-response";
import { Feilmelding } from "../components/httpFeilmelding/HttpFeilmelding";
import { getLoginserviceRedirectUrl } from "../utils/redirects";
import {
  OutboundNorskKontonummer,
  OutboundUtenlandsbankonto,
} from "../pages/forside/sections/4-personinfo/4-utbetalinger/endring/types";

const parseJson = (data: Response) => data.json();

const {
  REACT_APP_API_URL,
  REACT_APP_LOGIN_URL,
  REACT_APP_DSOP_URL,
  REACT_APP_INNLOGGINGSSTATUS_URL,
} = process.env;

/*
   GET
 */

const sjekkAuthHentJson = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    credentials: "include",
  })
    .then(sjekkAuth)
    .then(sjekkHttpFeil)
    .then(parseJson)
    .catch((err: string & Feilmelding) => {
      const error = {
        code: err.code || 404,
        type: err.type || "feil",
        text: err.text ?? err,
      };
      logApiError(url, error);
      throw error;
    });

export const fetchInnloggingsStatus = () =>
  sjekkAuthHentJson(REACT_APP_INNLOGGINGSSTATUS_URL || "");

export const fetchFeatureToggles = (featureToggles: FeatureToggles) =>
  sjekkAuthHentJson(
    `${REACT_APP_API_URL}/feature-toggles${getFeatureToggleUrl(featureToggles)}`
  );

export const fetchKontaktInfo = () =>
  sjekkAuthHentJson(`${REACT_APP_API_URL}/kontaktinformasjon`);

export const fetchRetningsnumre = () =>
  sjekkAuthHentJson(`${REACT_APP_API_URL}/retningsnumre`);

export const fetchInstInfo = () =>
  sjekkAuthHentJson(`${REACT_APP_API_URL}/institusjonsopphold`);

export const fetchMedlInfo = () =>
  sjekkAuthHentJson(`${REACT_APP_API_URL}/medl`);

export const fetchPostnummer = () =>
  sjekkAuthHentJson(`${REACT_APP_API_URL}/postnummer`);

export const fetchPersonInfo = () =>
  sjekkAuthHentJson(`${REACT_APP_API_URL}/personalia`);

export const fetchLand = () => sjekkAuthHentJson(`${REACT_APP_API_URL}/land`);

export const fetchValutaer = () =>
  sjekkAuthHentJson(`${REACT_APP_API_URL}/valuta`);

export const fetchDsopInfo = () =>
  sjekkAuthHentJson(`${REACT_APP_DSOP_URL}/get`);

/*
    POST
 */

type Outbound =
  | OutboundTlfnummer
  | OutboundNorskKontonummer
  | OutboundUtenlandsbankonto;

const postJson = (url: string, data?: Outbound) => {
  console.log(url, data);
  return fetch(url, {
    method: "POST",
    ...(data && {
      body: JSON.stringify(data),
    }),
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    credentials: "include",
  })
    .then(sjekkHttpFeil)
    .then(parseJson)
    .then(sjekkTPSFeil)
    .catch((err: string & Feilmelding) => {
      const error = {
        code: err.code || 404,
        type: err.type || "feil",
        text: err.text ?? err,
      };
      logApiError(url, error);
      throw error;
    });
};

export const postTlfnummer = (data: OutboundTlfnummer) =>
  postJson(`${REACT_APP_API_URL}/endreTelefonnummer`, data);

export const slettTlfnummer = (data: OutboundTlfnummer) =>
  postJson(`${REACT_APP_API_URL}/slettTelefonnummer`, data);

export const postKontonummer = (
  data: OutboundNorskKontonummer | OutboundUtenlandsbankonto
) => postJson(`${REACT_APP_API_URL}/endreKontonummer`, data);

export const slettKontaktadresse = () =>
  postJson(`${REACT_APP_API_URL}/slettKontaktadresse`);

/*
    UTILS
 */

const sjekkAuth = (response: Response): any => {
  if (response.status === 401 || response.status === 403) {
    sendTilLogin();
  }
  return response;
};

export const sendTilLogin = () => {
  const redirectUrl = getLoginserviceRedirectUrl();
  window.location.assign(
    `${REACT_APP_LOGIN_URL}?redirect=${redirectUrl}&level=Level4`
  );
};

const sjekkHttpFeil = async (response: Response, showResponse = false) => {
  if (response.ok) {
    return response;
  } else {
    throw {
      code: response.status,
      text:
        response.status === 400
          ? await response.text()
          : "Oisann, noe gikk galt! Prøv igjen senere.",
    };
  }
};

const sjekkTPSFeil = (response: TPSResponse) => {
  if (response.statusType === "OK") {
    return response;
  } else {
    throw {
      PENDING: {
        type: `info`,
        text: `Vi har sendt inn endringen din`,
      },
      REJECTED: {
        type: `feil`,
        text: `personalia.tlfnr.paagaaendeendring.feilmelding`,
      },
      ERROR: {
        type: `feil`,
        text: `${response.error && response.error.message}${
          response.error && response.error.details
            ? `\n${Object.values(response.error.details)
                .map((details) => details.join("\n"))
                .join("\n")}`
            : ``
        }`,
      },
    }[response.statusType];
  }
};

export const getFeatureToggleUrl = (featureToggles: FeatureToggles) =>
  Object.keys(featureToggles)
    .map((feature: string, i: number) => `${!i ? `?` : ``}feature=${feature}`)
    .join("&");
