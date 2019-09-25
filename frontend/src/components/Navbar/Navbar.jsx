// Dependencies
import React, { useState } from "react";
import { get } from "lodash";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
	Collapse,
	NavbarBrand,
	Navbar,
	Nav,
	UncontrolledDropdown,
	DropdownToggle,
	Media,
	Container,
	Row,
	Col
} from "reactstrap";

// Icons
import appIcon from "../../assets/img/brand/appIcon.png";

// Components
import LanguageDropdown from "../NavDropdown/LanguageDropdown";
import GuestNavDropdown from "../NavDropdown/GuestNavDropdown";
import MemberNavDropdown from "../NavDropdown/MemberNavDropdown";

/**
 * Navbar Component
 *
 * The component includes the Navbar component and functions for the
 * Navbar at the top of the page.
 *
 * @param {Object} languageData Current language information for the app. Language data object.
 * @param {Object} user User data for the logged in user.
 * @param {object} props Properties passed to the component from the parent.
 */
const DashNavbar = ({ languageData, user, ...props}) => {
	// React hook used to determine whether or not the menu should be collapsed
	// or shown to the user.
	const [collapseOpen, setCollapse] = useState(false);

	/**
	 * Toggle menu collapse
	 *
	 * Toggles collapse between opened and closed (true/false).
	 */
	const toggleCollapse = () => {
		setCollapse(!collapseOpen);
  	};

	// Display the Navbar.
	return (
		<Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
			<Container fluid>
				<button
					className="navbar-toggler"
					type="button"
					onClick={ toggleCollapse }
				>
					<span className="navbar-toggler-icon" />
				</button>
				<NavbarBrand className="pt-0" to="/" tag={ Link } title={ get(languageData, ["common", "siteTitle"]) }>
					{ get(languageData, ["common", "siteTitle"]) }
				</NavbarBrand>
				<Collapse navbar isOpen={ collapseOpen }>
					<div className="navbar-collapse-header d-md-none">
						<Row>
							<Col className="collapse-close" xs="6">
								<button
									className="navbar-toggler"
									type="button"
									onClick={ toggleCollapse }
								>
									<span />
									<span />
								</button>
							</Col>
						</Row>
					</div>
					<Nav className="ml-auto" navbar>
						<LanguageDropdown { ...props } />
						<UncontrolledDropdown nav>
							<DropdownToggle className="pr-0" nav>
								<Media className="align-items-center">
									<span className="avatar avatar-sm rounded-circle">
										<img
											alt={ get(languageData, ["common", "avatar"]) }
											src={ appIcon }
										/>
									</span>
									<Media className="ml-2">
										<span className="mb-0 text-sm font-weight-bold">
											{ // Display the user's name, or a welcome message to guests.
												user
												? user.firstName
												: get(languageData, ["common", "welcomeGuest"])
											}
										</span>
									</Media>
								</Media>
							</DropdownToggle>
							{ // Display the Member dropdown (if logged in), or Guest dropdown.
								user
								? <MemberNavDropdown { ...props } />
								: <GuestNavDropdown { ...props } />
							}
						</UncontrolledDropdown>
					</Nav>
				</Collapse>
			</Container>
		</Navbar>
	);
};

/**
 * Get App State
 *
 * Get the requried state for the component from the Redux store.
 *
 * @param {Object} state Application state from Redux.
 */
const mapStateToProps = state => {
    return {
		languageData: state.language.languageData,
		user: state.user.info
    }
}

// Export the Navbar Component.
export default connect(mapStateToProps)(DashNavbar);
