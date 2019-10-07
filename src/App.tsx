import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import { useStore } from "./providers/Provider";
import DetaljertArbeidsforhold from "./pages/detaljert-arbeidsforhold/DetaljertArbeidsforhold";
import Forside from "./pages/forside/Forside";
import WithAuth from "./providers/auth/Auth";
import WithFeatureToggles from "./providers/featuretoggles/FeatureToggles";
import KontaktInfo from "./pages/endre/kontaktinfo/KontaktInfo";
import { DsopDetaljer, DsopHistorik } from "./pages/dsop/Wrapper";
import PageNotFound from "./pages/404/404";
import { configureAnchors } from "react-scrollable-anchor";
import redirectsJson from "utils/redirects.json";

export const basePath = "/person/personopplysninger";
const App = () => {
  const [{ featureToggles }] = useStore();

  configureAnchors({
    offset: -65,
    scrollDuration: 0,
    keepLastAnchorHash: true
  });

  const gyldigeRedirects = Object.keys(redirectsJson)
    .map(key => key)
    .join("|");

  return (
    <div className="pagecontent">
      <Router>
        <WithAuth>
          <WithFeatureToggles>
            <Switch>
              <Route
                exact={true}
                path={`(/|${basePath})`}
                component={Forside}
              />
              <Route
                exact={true}
                path={`${basePath}/sendt-fra/:tjeneste(${gyldigeRedirects})`}
                component={Forside}
              />
              <Route
                exact={true}
                path={`${basePath}/arbeidsforhold`}
                render={() => <Redirect to={`${basePath}/#arbeidsforhold`} />}
              />
              <Route
                exact={true}
                path={`${basePath}/arbeidsforhold/:id`}
                component={DetaljertArbeidsforhold}
              />
              {featureToggles.data["personopplysninger.dsop"] && (
                <Route
                  exact={true}
                  path={`${basePath}/dsop`}
                  component={DsopHistorik}
                />
              )}
              {featureToggles.data["personopplysninger.dsop"] && (
                <Route
                  exact={true}
                  path={`${basePath}/dsop/:id`}
                  component={DsopDetaljer}
                />
              )}
              {featureToggles.data["personopplysninger.pdl"] && (
                <Route
                  exact={true}
                  path={`${basePath}/endre/sendt-fra/:tjeneste(${gyldigeRedirects})`}
                  component={KontaktInfo}
                />
              )}
              {featureToggles.status === "RESULT" && (
                <Route component={PageNotFound} />
              )}
            </Switch>
          </WithFeatureToggles>
        </WithAuth>
      </Router>
    </div>
  );
};

export default App;
