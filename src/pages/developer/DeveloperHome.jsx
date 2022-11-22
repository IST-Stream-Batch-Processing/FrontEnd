import React from 'react';
import ProjectPage from "./DeveloperPage";

export default function developerHome({match}) {
    return (
        <div>
            {ProjectPage(match)}
        </div>
    );
}
