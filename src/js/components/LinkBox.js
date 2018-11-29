import React from 'react';
import PropTypes from 'prop-types';
import Box from '../components/Box';

const LinkBox = ({
  header, information, url, linkText, kilde, icon,
}) => (
  <Box header={header} icon={icon}>
    <div className="link-box-content">
      <div className="link-info">
        {information}
      </div>
      <a href={url}>{linkText}</a>
      <div className="box-footer link-footer">
        Kilde: {kilde}
      </div>
    </div>
  </Box>
);

LinkBox.propTypes = {
  icon: PropTypes.string,
  header: PropTypes.string,
  information: PropTypes.string,
  url: PropTypes.string,
  linkText: PropTypes.string,
  kilde: PropTypes.string,
};

LinkBox.defaultProps = {
  icon: '',
  header: '',
  information: '',
  url: '',
  linkText: '',
  kilde: '',
};

export default LinkBox;
