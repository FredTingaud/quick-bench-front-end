import React from 'react';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';

class CompileConfig extends React.Component {
    render() {
        return (
            <ButtonToolbar>
                <DropdownButton id="compiler" bsStyle="default" title="compiler = clang++ - 3.8">
                    <MenuItem>clang++ - 3.8</MenuItem>
                </DropdownButton>
                <DropdownButton id="language" bsStyle="default" title="std = c++1z">
                    <MenuItem>c++1z</MenuItem>
                </DropdownButton>
                <DropdownButton id="optim" bsStyle="default" title="optim = None">
                    <MenuItem>None</MenuItem>
                </DropdownButton>
            </ButtonToolbar>
        );
    }
}

export default CompileConfig;
