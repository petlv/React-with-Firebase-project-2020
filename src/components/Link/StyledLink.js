import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledLink = styled(Link)`
    color: red;
    text-decoration: underline;
    text-decoration-color: red;
    -webkit-text-decoration-color: red;
    border-radius: 5px;
    text-underline-offset: 2px;
    text-decoration-thickness: 2px;

    /*&:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;*/
    }
`;

export default (props) => <StyledLink {...props} />;