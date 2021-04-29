import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useStore } from "./store/Context";
import DetaljertArbeidsforhold from "./pages/detaljert-arbeidsforhold/DetaljertArbeidsforhold";
import Forside from "./pages/forside/Forside";
import WithFeatureToggles from "./store/providers/FeatureToggles";
import EndreOpplysninger from "./pages/endre-personopplysninger/EndreOpplysninger";
import PageNotFound from "./pages/404/404";
import { configureAnchors } from "react-scrollable-anchor";
import { getRedirectUrlFromParam, tillatteTjenester, tillatteUrler } from "./utils/redirects";
import SkattkortHistorikk from "./pages/skattetrekksmelding/SkattHistorikk";
import SkattekortDetaljer from "./pages/skattetrekksmelding/SkattDetaljer";
import InstHistorikk from "./pages/institusjonsopphold/InstHistorikk";
import InstDetaljer from "./pages/institusjonsopphold/InstDetaljer";
import DsopHistorikk from "./pages/digital-samhandling-offentlig-privat/DsopHistorikk";
import DsopDetaljer from "./pages/digital-samhandling-offentlig-privat/DsopDetaljer";
import Modal from "react-modal";
import Spinner from "./components/spinner/Spinner";
import MedlHistorikk from "./pages/medlemskap-i-folketrygden/MedlHistorikk";
import { Auth } from "./types/authInfo";
import { fetchInnloggingsStatus, sendTilLogin } from "./clients/apiClient";

export const basePath = "/person/personopplysninger";
export const basePathWithLanguage = `${basePath}/(nb|en)`;

const App = () => {
  const { locale } = useIntl();
  const [{ featureToggles, authInfo }, dispatch] = useStore();
  const redirectUrl = getRedirectUrlFromParam();

  useEffect(() => {
    fetchInnloggingsStatus().then((auth: Auth) => {
      if (!auth?.authenticated || auth.securityLevel !== "4") {
        sendTilLogin();
      } else {
        dispatch({ type: "SETT_AUTH_RESULT", payload: auth });
      }
    });
  }, [dispatch]);

  useEffect(() => {
    Modal.setAppElement("#app");
  }, []);

  useEffect(() => {
    // Reset forms dersom locale endrer seg
    dispatch({ type: "INCREASE_FORM_KEY" });
  }, [locale, dispatch]);

  configureAnchors({
    offset: -65,
    scrollDuration: 0,
    keepLastAnchorHash: true,
  });

  return (
    <div className="pagecontent">
      <div className="wrapper">
        {authInfo.status === "RESULT" ? (
          <Router>
            <WithFeatureToggles>
              <Switch>
                {redirectUrl && <Redirect to={redirectUrl} />}
                <Redirect to={`${basePath}/nb/`} exact={true} path={"/"} />
                <RedirectToLocale>
                  <Switch>
                    <Route
                      exact={true}
                      path={`${basePathWithLanguage}/`}
                      component={Forside}
                    />
                    <Route
                      exact={true}
                      path={`${basePathWithLanguage}/sendt-fra/:tjeneste(${tillatteTjenester})/:tjenesteUrl(${tillatteUrler})`}
                      component={Forside}
                    />
                    <Route
                      exact={true}
                      path={`${basePathWithLanguage}/arbeidsforhold`}
                      render={(routeProps) => (
                        <Redirect
                          to={routeProps.location.pathname.replace("arbeidsforhold", "#arbeidsforhold")}
                        />
                      )}
                    />
                    <Route
                      exact={true}
                      path={`${basePathWithLanguage}/arbeidsforhold/:id`}
                      component={DetaljertArbeidsforhold}
                    />
                    {featureToggles.data["personopplysninger.dsop"] && (
                      <Route
                        exact={true}
                        path={`${basePathWithLanguage}/dsop`}
                        component={DsopHistorikk}
                      />
                    )}
                    {featureToggles.data["personopplysninger.dsop"] && (
                      <Route
                        exact={true}
                        path={`${basePathWithLanguage}/dsop/:id`}
                        component={DsopDetaljer}
                      />
                    )}
                    {featureToggles.data["personopplysninger.inst"] && (
                      <Route
                        exact={true}
                        path={`${basePathWithLanguage}/institusjonsopphold`}
                        component={InstHistorikk}
                      />
                    )}
                    {featureToggles.data["personopplysninger.inst"] && (
                      <Route
                        exact={true}
                        path={`${basePathWithLanguage}/institusjonsopphold/:id`}
                        component={InstDetaljer}
                      />
                    )}
                    {featureToggles.data["personopplysninger.pdl"] && (
                      <Route
                        exact={true}
                        path={`${basePathWithLanguage}/endre-opplysninger/sendt-fra/:tjeneste(${tillatteTjenester})/:tjenesteUrl(${tillatteUrler})`}
                        component={EndreOpplysninger}
                      />
                    )}
                    {featureToggles.data["personopplysninger.skatt"] && (
                      <Route
                        exact={true}
                        path={`${basePathWithLanguage}/skattetrekksmelding`}
                        component={SkattkortHistorikk}
                      />
                    )}
                    {featureToggles.data["personopplysninger.skatt"] && (
                      <Route
                        exact={true}
                        path={`${basePathWithLanguage}/skattetrekksmelding/:id`}
                        component={SkattekortDetaljer}
                      />
                    )}
                    {featureToggles.data["personopplysninger.medl"] && (
                      <Route
                        exact={true}
                        path={`${basePathWithLanguage}/medlemskap-i-folketrygden`}
                        component={MedlHistorikk}
                      />
                    )}
                    {featureToggles.status === "RESULT" && (
                      <Route component={PageNotFound} />
                    )}
                  </Switch>
                </RedirectToLocale>
              </Switch>
            </WithFeatureToggles>
          </Router>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

const RedirectToLocale = (props: { children: JSX.Element }) => {
  const location = useLocation();
  const history = useHistory();
  const [{ locale }] = useStore();

  useEffect(() => {
    const localeUrlPattern = new RegExp(`${basePath}(/en|/nb)($|\\/)`);
    const urlHasLocale = localeUrlPattern.test(location.pathname);

    if (!urlHasLocale) {
      const redirectTo = `${location.pathname.replace(
        `${basePath}`,
        `${basePath}/${locale}`
      )}${location.hash}`;

      history.push(redirectTo);
    }
  }, [locale, location, history]);
  return props.children;
};

export default App;
