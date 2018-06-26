import React from 'react';
import {Layer, Line, Stage, Star, Image} from 'react-konva';


class Sky extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locationOfStars: this.props.locationOfStars ? this.props.locationOfStars : [],
			firstEdge: undefined,
			mapOfEdges: this.props.mapOfEdges ? this.props.mapOfEdges : [],
			originalX: undefined,
			originalY: undefined,
			fillPatternImage: null,
			stageHeight: this.props.stageHeight,
			stageWidth: this.props.stageWidth,
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			stageHeight: nextProps.stageHeight,
			stageWidth: nextProps.stageWidth,
			scale: nextProps.scale,
			locationOfStars: nextProps.locationOfStars,
			mapOfEdges: nextProps.mapOfEdges
		})
	}

	componentWillMount(){
		const image = new window.Image();
		image.onload = () => {
			this.setState({
				fillPatternImage: image,
			});
		};
		image.height = this.state.height;
		image.width = this.state.width;
		image.src = 'https://i.imgur.com/ewWyxVH.png';
	}


	componentDidMount() {
		this.update();
	}

	clickLine = (e) => {
		this.update(e);

	};

	drawEdges() {
		if (!this.state.mapOfEdges) {
			return;
		}
		if(!this.state.locationOfStars){
			return;
		}

		let linesToRender = [];
		let map = this.state.mapOfEdges;
		let locations = this.state.locationOfStars;

		let firstPoints = Object.keys(map);
		for (let i = 0; i < map.length; i++) {
			let firstPoint = firstPoints[i];
			if (locations[firstPoint]) {
				for (let j = 0; j < map[firstPoint].length; j++) {
					let secondPoint = map[firstPoint][j];
					linesToRender.push(<Line index={j.toString()}
											 stroke='#CACF85'
											 onClick={(event) => this.clickLine(event)}
											 strokeWidth={5}
											 firstStar={firstPoint}
											 secondStar={secondPoint}
											 points={[locations[firstPoint].mouseX, locations[firstPoint].mouseY,
											 locations[secondPoint].mouseX, locations[secondPoint].mouseY]}/>)
				}
			}
		}
		return linesToRender;
	}

	getOriginalCoordinates(event) {
		this.setState({
				originalX: event.evt.offsetX,
				originalY: event.evt.offsetY
			}
		)
	}

	update = (event) => {
		const layer = this.refs.edgesLayer;
		if (!event) {
			return;
		}

		if (event.target.attrs.className === "sky") {
			this.setState({
				locationOfStars: [...this.state.locationOfStars, {
					mouseX: event.evt.offsetX,
					mouseY: event.evt.offsetY
				}],
			});
		}

		if (event.target.className === "Line") {
			console.log(event.target.id, "event.target.id onClickedLine");
			console.log(this.state.mapOfEdges, "map of edges");
			layer.draw();
			return;
		}

		if (event.target.className === "Star") {
			this.handleClickStar(event);
		}

		// let starID = event.target.attrs.id;
		// let fixedStarCoords = this.state.locationOfStars[starID];
		// let currentMouseX = event.evt.clientX;
		// let currentMouseY = event.evt.clientY;
		// let newXPoint = fixedStarCoords.mouseX + currentMouseX - this.state.originalX;
		// let newYPoint = fixedStarCoords.mouseY + currentMouseY - this.state.originalY;
		// let map = this.state.mapOfEdges;
		// let starLines = layer.children;
		//
		// if (starLines.length > 0) {
		//     for (let i = 0; i < starLines.length; i++) {
		//         let edge = starLines[i];
		//         if (map[starID]) {
		//             for (let j = 0; j < map[starID].length; j++) {
		//                 let movingStarCoords = this.state.locationOfStars[map[starID][j]];
		//                 if (edge.attrs.firstStar === starID) {
		//                     starLines[j].attrs.points = [newXPoint, newYPoint, movingStarCoords.mouseX, movingStarCoords.mouseY];
		//                     layer.add(starLines[j]);
		//                 } else if (edge.attrs.secondStar === starID) {
		//                     starLines[j].attrs.points = [movingStarCoords.mouseX, movingStarCoords.mouseY, newXPoint, newYPoint];
		//                     layer.add(starLines[j]);
		//                 }
		//             }
		//         }
		//
		//     }
		// }
		// layer.draw();
	};

	handleClickStar(event) {
		if (event.type === "dragmove") {
			this.setStarLocationsToMousePosition(event);
		} else {
			if (!!this.state.firstEdge) {
				let vertex1 = this.state.firstEdge;
				let vertex2 = event.target.attrs.id;
				let mapOfEdges = this.state.mapOfEdges;

				mapOfEdges[vertex1] ? mapOfEdges[vertex1].push(vertex2) : mapOfEdges[vertex1] = [vertex2];

				this.setState({
					firstEdge: undefined,
					mapOfEdges: mapOfEdges
				})
			} else {
				let id = event.target.attrs.id;
				this.setState({
					firstEdge: id,
				});
			}
		}
	}

	setStarLocationsToMousePosition(event) {
		let locationOfStars = this.state.locationOfStars;
		locationOfStars[event.target.attrs.id] = {mouseX: event.evt.offsetX, mouseY: event.evt.offsetY};
		this.setState({
			locationOfStars: locationOfStars,
			firstEdge: undefined,
		});
	}

	drawStars() {
		let starLocations = this.state.locationOfStars;
		if (!starLocations) {
			return;
		}
		let stars = [];
		for (let i = 0; i < starLocations.length; i++) {
			stars.push(<Star
				className="star"
				onMouseEnter={() => {
					document.body.style.cursor = "pointer";
				}}
				onMouseLeave={() => {
					document.body.style.cursor = "default";
				}}
				id={i.toString()}
				x={starLocations[i].mouseX}
				y={starLocations[i].mouseY}
				numPoints={6}
				innerRadius={6}
				outerRadius={10}
				onDragstart={(event) => this.getOriginalCoordinates(event)}
				onDragMove={(event) => this.update(event)}
				fill="#1D4BB7"
				stroke='white'
				draggable={true}
				onClick={(event) => this.update(event)}
			/>);
		}
		return stars;
	}

	render() {
		return (
			<div>
				<Stage id="skyStage" height={this.state.stageHeight} width={this.state.stageWidth} x={this.state.scale} y={this.state.scale} style={{
					margin: '0 auto',
					borderRadius: '30px', width: '85%', overflow: 'hidden'}} >
					<Layer>
						<Image className="sky" width={this.state.stageWidth} height={this.state.stageHeight} x={this.state.scale} y={this.state.scale}
							  fillPatternImage={this.state.fillPatternImage}
							  onClick={(event) => this.update(event)}/>
					</Layer>
					<Layer ref={"edgesLayer"}>
						{this.drawEdges()}
					</Layer>
					<Layer>
						{this.drawStars()}
					</Layer>
				</Stage>
			</div>
		)
	}
}

export default Sky;