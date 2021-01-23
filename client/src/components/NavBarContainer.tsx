import React from 'react';
import { bikeVersions, useBikeVersion } from '../router';
import NavBar from './NavBar';

/**
 * Container for NavBar
 *
 * @returns Component
 */
export default function NavBarContainer() {
    const bikeVersion = useBikeVersion();
    return <NavBar bikeVersion={bikeVersion} bikeVersions={bikeVersions} />;
}
