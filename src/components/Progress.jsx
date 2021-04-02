import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'

const Container = Styled.div`
  progress[value] {
    width: ${props => props.width};
    height: ${props => props.height};
  }
  `;

const ProgressBar = ({ value, max, width, height }) => {
  return (
    <Container width={width} height={height}>
      <progress value={value} max={max}/>
    </Container>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string
};

ProgressBar.defaultProps = {
  value: 0,
  max: 100,
  width: "200px",
  height: "10px"
};

export default ProgressBar;
