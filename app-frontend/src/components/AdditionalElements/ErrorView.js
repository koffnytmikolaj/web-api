import { Component } from 'react';

export class ErrorView extends Component {

    RenderDatabaseError() {

        return(
            <div>
                Database failure! Come back later.
            </div>
        );
    }

    render() { 
        return this.RenderDatabaseError(); 
    }
}