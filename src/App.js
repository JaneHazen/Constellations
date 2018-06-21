import React, {Component} from 'react';
import './App.css';
import Sky from './Sky';

class App extends Component {
    constructor(){
        super();
        this.state = {
            locationOfStars: [],
            mapOfEdges: [],
        };

        this.clickedVirgo = this.clickedVirgo.bind(this);
    }

    clickedVirgo(){
        this.setState({
            locationOfStars:[
                {mouseX:138, mouseY:474},
                {mouseX:149, mouseY:435},
                {mouseX:170, mouseY: 487},
                {mouseX:225, mouseY: 530},
                {mouseX:189, mouseY:451},
                {mouseX:224, mouseY:477},
                {mouseX:279, mouseY:477},
                {mouseX:306, mouseY: 497},
                {mouseX:335, mouseY:492},
                {mouseX:273, mouseY: 473},
                {mouseX:272, mouseY:438}
            ],
            mapOfEdges: [
                {0: ["2", "1"]},
                {2: ["0", "4"]},
                {3: ["3", "0"]},
                {4: ["6", "2"]},
                {5: ["1", "5"]},
                {6: ["4"]},
                {7: ["7", "9", "3"]},
                {8: ["8", "6"]},
                {9: ["7"]},
                {10: ["6", "10"]},
                {11: ["9"]}
            ]
        })
    }

    render() {
        return (
                    <Sky className='skyBox' locationOfStars={this.state.locationOfStars} mapOfEdges={this.state.mapOfEdges} clickedVirgo={this.clickedVirgo}/>
        );
    }
}

export default App;
