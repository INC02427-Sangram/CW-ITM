const React = require('react');

const Grid = ({ children, ...props }) => React.createElement('div', props, children);
const Paper = ({ children, ...props }) => React.createElement('div', props, children);
const Typography = ({ children, ...props }) => React.createElement('span', props, children);
const Stack = ({ children, ...props }) => React.createElement('div', props, children);

module.exports = {
  Grid,
  Paper,
  Typography,
  Stack,
};
