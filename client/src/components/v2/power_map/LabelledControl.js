import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from 'react-bootstrap';

/**
 * @typedef {object} LabelledControlProps
 * @property {string}           label Label to display above control
 * @property {?string|boolean}  error Shows error message if true, or custom message if string
 */

/**
 * Form control with label and error message
 *
 * @param {LabelledControlProps} props Props
 * @returns {React.Component<LabelledControl>} Component
 */
const LabelledControl = React.forwardRef(({ label, error, ...props }, ref) => (
  <Form.Group>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      ref={ref}
      className={classNames(error && 'is-invalid')}
      {...props}
    />
    {error ? (
      <Form.Control.Feedback type="invalid">
        {typeof error === 'string' ? error : `${label} is invalid`}
      </Form.Control.Feedback>
    ) : null}
  </Form.Group>
));

LabelledControl.displayName = 'LabelledControl';

LabelledControl.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

LabelledControl.defaultProps = {
  error: null,
};

export default LabelledControl;
