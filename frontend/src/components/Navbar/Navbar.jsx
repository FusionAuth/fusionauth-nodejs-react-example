// Dependencies
import React, { useState } from "react";
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
import MemberNavDropdown from "../NavDropdown/MemberNavDropdown";
import GuestNavDropdown from "../NavDropdown/GuestNavDropdown";

/**
 * Navbar Component
 *
 * The component includes the Navbar component and functions for the
 * Navbar at the top of the page.
 *
 * @param {object} props Properties passed to the component from the parent.
 */
const DashNavbar = props => {
	// React hook used to determine whether or not the menu should be collapsed
	// or shown to the user.
	const [collapseOpen, setCollapse] = useState(false);

	/**
	 * Toggle menu collapse
	 *
	 * Toggles collapse between opened and closed (true/false)
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
				<NavbarBrand className="pt-0" to="/" tag={ Link } title="FusionAuth ReactJS Example">
					FusionAuth ReactJS Demo
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
						<UncontrolledDropdown nav>
							<DropdownToggle className="pr-0" nav>
								<Media className="align-items-center">
									<span className="avatar avatar-sm rounded-circle">
										<img
											alt="Avatar"
											src={ appIcon }
										/>
									</span>
									<Media className="ml-2">
										<span className="mb-0 text-sm font-weight-bold">
											{ // Display the user's name, or a welcome message to guests.
												props.user
												? props.user.firstName
												: "Welcome Guest"
											}
										</span>
									</Media>
								</Media>
							</DropdownToggle>
							{ // Display the Member dropdown (if logged in), or Guest dropdown.
								props.user
								? <MemberNavDropdown { ...props } />
								: <GuestNavDropdown />
							}
						</UncontrolledDropdown>
					</Nav>
				</Collapse>
			</Container>
		</Navbar>
	);
};

// Export the Navbar Component.
export default DashNavbar;
