import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from 'js/components/Box';
import { FormattedMessage } from 'react-intl';
import person from '../../assets/img/person.png';
import ListElement from './ListElement';

class Personalia extends Component {
  render() {
    return (
      <Box
        header="Personalia"
        icon={person}
        infoType="personalia"
      >
        <ul className="personalia-list">
          <ListElement
            titleId="personalia.first_name"
            content={this.props.fornavn}
          />
          <ListElement
            titleId="personalia.fnr"
            content={this.props.fnr}
          />
          <ListElement
            titleId="personalia.phone"
            content={this.props.tlfnr}
          />
          <ListElement
            titleId="personalia.email"
            content={this.props.epostadr}
          />
          <ListElement
            titleId="personalia.citizenship"
            content={this.props.statsborgerskap}
          />
          <ListElement
            titleId="personalia.civil_status"
            content={this.props.sivilstand}
          />
          <ListElement
            titleId="personalia.surname"
            content={this.props.etternavn}
          />
          <ListElement
            titleId="personalia.account_no"
            content={this.props.kontonr}
          />
          <ListElement
            titleId="personalia.language"
            content={this.props.spraak}
          />
          <ListElement
            titleId="personalia.status"
            content={this.props.personstatus}
          />
          <ListElement
            titleId="personalia.birthplace"
            content={this.props.foedested}
          />
          <ListElement
            titleId="personalia.gender"
            content={this.props.kjoenn}
          />
        </ul>
        <div className="box-footer">
          <FormattedMessage
            id="personalia.source"
          />
        </div>
      </Box>
    );
  }
}

Personalia.propTypes = {
  // datakilder: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  epostadr: PropTypes.string,
  etternavn: PropTypes.string,
  fnr: PropTypes.string,
  foedested: PropTypes.string,
  fornavn: PropTypes.string,
  kjoenn: PropTypes.string,
  kontonr: PropTypes.string,
  personstatus: PropTypes.string,
  sivilstand: PropTypes.string,
  spraak: PropTypes.string,
  statsborgerskap: PropTypes.string,
  tlfnr: PropTypes.string,
};

Personalia.defaultProps = {
  fornavn: '',
  etternavn: '',
  fnr: '',
  kontonr: '',
  tlfnr: '',
  spraak: '',
  epostadr: '',
  personstatus: '',
  statsborgerskap: '',
  foedested: '',
  sivilstand: '',
  kjoenn: '',
  // datakilder: [{}],
};

export default Personalia;
