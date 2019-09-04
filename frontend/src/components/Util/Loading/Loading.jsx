// Dependencies
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Loading Component
 *
 * A simple Font Awesome spinning icon to indicate to the user that
 * content is loading for them.
 */
const Loading = ({ size = "3x" }) => (
    <FontAwesomeIcon icon="sync" size={ size } spin={ true } className="faDarkOrangeText" />
);

// Export the Loading Component.
export default Loading;
