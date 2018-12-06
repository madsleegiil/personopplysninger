const Environment = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      apiUrl: 'http://localhost:8080/personbruker-api/',
      loginUrl: 'http://localhost:8080/personbruker-api/local/cookie',
      logoutUrl: '#',
    };
  }
  if (window.location.hostname.indexOf('tjenester-t6') > -1) {
    return {
      apiUrl: 'https://personopplysninger-api-t6.nais.oera-q.local/personalia/hent',
      loginUrl: 'https://loginservice-q.nav.no/login',
      logoutUrl: 'https://loginservice-q.nav.no/slo',
    };
  }
  if (window.location.hostname.indexOf('tjenester-q6') > -1) {
    return {
      apiUrl: 'https://tjenester-q6.nav.no/personopplysninger-api/personalia/hent',
      loginUrl: 'https://loginservice-q.nav.no/login',
      logoutUrl: 'https://loginservice-q.nav.no/slo',
    };
  }

  return {
    apiUrl: 'https://tjenester.nav.no/personopplysninger-api/personalia/hent',
    loginUrl: 'https://loginservice.nav.no/login',
    logoutUrl: 'https://loginservice.nav.no/slo',
  };
};

export default Environment;
