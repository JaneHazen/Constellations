import React, {Component} from 'react';
import './App.css';
import Sky from './Sky';

class App extends Component {
	constructor() {
		super();

		this.state = {
			locationOfStars: [],
			mapOfEdges: [],
			skyHeight: undefined,
			skyWidth: undefined
		};

		this.clickedHercules = this.clickedHercules.bind(this);
		this.clickedGemini = this.clickedGemini.bind(this);
		this.clickedClear = this.clickedClear.bind(this);
		this.fitStageIntoParentContainer = this.fitStageIntoParentContainer.bind(this);
	}

	clickedClear(){
		this.setState({
			locationOfStars:[],
			mapOfEdges:[]
		});
	}

	clickedGemini(){
		this.setState({
			locationOfStars: [
				{mouseX: 538, mouseY: 362},
				{mouseX: 539, mouseY: 344},
				{mouseX: 562, mouseY: 341},
				{mouseX: 594, mouseY: 345},
				{mouseX: 616, mouseY: 341},
				{mouseX: 623, mouseY: 334},
				{mouseX: 629, mouseY: 324},
				{mouseX: 625, mouseY: 389},
				{mouseX: 621, mouseY: 372},
				{mouseX: 587, mouseY: 372},
				{mouseX: 566, mouseY: 379}
			],
			mapOfEdges: [
				[],
				["1"],
				["1","2"],
				["2","3"],
				["3","4"],
				["4","5"],
				["5","6"],
				["8"],
				["9"],
				["10"],
				["0"]
			]
		})
	}

	clickedHercules() {
		this.setState({
			locationOfStars: [
				{mouseX: 102, mouseY: 142},
				{mouseX: 108, mouseY: 156},
				{mouseX: 103, mouseY: 171},
				{mouseX: 99, mouseY: 194},
				{mouseX: 102, mouseY: 218},
				{mouseX: 139, mouseY: 218},
				{mouseX: 151, mouseY: 237},
				{mouseX: 186, mouseY: 219},
				{mouseX: 161, mouseY: 194},
				{mouseX: 154, mouseY: 150},
				{mouseX: 203, mouseY: 158},
				{mouseX: 223, mouseY: 221},
				{mouseX: 219, mouseY: 247},
				{mouseX: 158, mouseY: 256},
				{mouseX: 45, mouseY: 247},
				{mouseX: 112, mouseY: 278}
			],
			mapOfEdges: [
				[],
				["0"],
				["1"],
				["2"],
				["3"],
				["4"],
				["5"],
				["6"],
				["7", "5"],
				["8"],
				["9"],
				["7"],
				["11"],
				["6"],
				["15","4"],
				["6"]
			]
		})
	}

	componentDidMount(){
		this.fitStageIntoParentContainer();
		window.addEventListener("resize", this.fitStageIntoParentContainer.bind(this));
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.fitStageIntoParentContainer.bind(this));
	}

	fitStageIntoParentContainer() {
		let parent = document.getElementById("leftPanelContainer");
		let padding = 50;

		let height = parent.clientHeight - padding;
		let width = parent.clientWidth - padding;


		setTimeout(function() { this.setState({skyHeight: height, skyWidth: width}); }.bind(this), 500);
	}

	getSkyBox(){
		return(
			<Sky className='skyBox' stageHeight={this.state.skyHeight}
				 stageWidth={this.state.skyWidth}
				 locationOfStars={this.state.locationOfStars}
				 mapOfEdges={this.state.mapOfEdges}
				 />
		)
	}

	render() {
		return (
			<div className="app">
				<div className="appContainer">
					<div className="radioContainer">
						<div className="topContainer">
							<div id="leftPanelContainer" className="leftPanelContainer">
								<div id="skyContainer">
									{this.state.skyHeight ? this.getSkyBox() : ""}
								</div>
							</div>
							<div className="rightPanelContainer">
								<div className="buttonContainer">
									<button onClick={this.clickedHercules}>Hercules</button>
									<button onClick={this.clickedGemini}>Gemini</button>
									<button onClick={this.clickedClear}>Clear</button>
								</div>

							</div>
						</div>
						<div className="footer">
							<div className="titlebox">
								<div className="title">
									<h1>Constellation Maker 3005</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
