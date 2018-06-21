import React from 'react';
import {Layer, Line, Rect, Stage, Star, Text, Label, Tag} from 'react-konva';


class Sky extends React.Component {
    constructor(props){
        super(props);
        const image = new window.Image();
        image.onload = () => {
            const dim = this.getViewPortDimension();
            this.setState({
                fillPatternImage: image,
                viewportWidth: dim.w,
                viewportHeight: dim.h,
            });
        };
        image.src = 'https://i.imgur.com/ewWyxVH.png';
        this.state = {
            locationOfStars: this.props.locationOfStars,
            firstEdge: undefined,
            mapOfEdges: this.props.mapOfEdges,
            originalX: undefined,
            originalY: undefined,
            fillPatternImage: null,
            viewportWidth: 400,
            viewportHeight: 400,
        };

        window.onresize = (event) => {
            const dim = this.getViewPortDimension();

            this.setState({
                viewportWidth: dim.w,
                viewportHeight: dim.h,
            });
        };
    }

    getViewPortDimension() {
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return {w, h};
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            locationOfStars: nextProps.locationOfStars,
            mapOfEdges: nextProps.mapOfEdges
        })
    }


    componentDidMount(){
        this.update();
    }

    clickLine = (e) => {
        this.update(e);

    };

    drawEdges(){
        if(!this.state.mapOfEdges){
            return;
        }

        let linesToRender = [];
        let map = this.state.mapOfEdges;
        let locations = this.state.locationOfStars;

        let firstPoints = Object.keys(map);
        for(let i = 0; i < map.length; i++){
            let firstPoint = firstPoints[i];
            if(map[firstPoint]) {
                for (let j = 0; j < map[firstPoint].length; j++) {
                    let secondPoint = map[firstPoint][j];
                    linesToRender.push(<Line index={j.toString()}
                                             stroke='#CACF85'
                                             onClick = {(event) => this.clickLine(event)}
                                             strokeWidth={5}
                                             firstStar= {firstPoint}
                                             secondStar ={secondPoint}
                                             points={[locations[firstPoint].mouseX, locations[firstPoint].mouseY,
                                             locations[secondPoint].mouseX, locations[secondPoint].mouseY]}/>)

                }
            }
        }
        return linesToRender;
    }

    getOriginalCoordinates(event) {
        this.setState({
                originalX: event.evt.clientX,
                originalY: event.evt.clientY
            }
        )
    }

    update = (event) => {
        const layer = this.refs.edgesLayer;
        if (!event) {
            return;
        }

        if(event.target.attrs.className ==="sky"){
            this.setState({
                locationOfStars: [...this.state.locationOfStars, {mouseX: event.evt.clientX, mouseY: event.evt.clientY}],
            });
        }

        if(event.target.className === "Line"){
            console.log(event.target.id, "event.target.id onClickedLine");
            console.log(this.state.mapOfEdges, "map of edges")
            layer.draw();
            return;
        }

        if(event.target.className === "Star"){
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
    }

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
                console.log("set first edge")
                let id = event.target.attrs.id;
                this.setState({
                    firstEdge: id,
                });
            }
        }
    }

    setStarLocationsToMousePosition(event) {
        let locationOfStars = this.state.locationOfStars;
        locationOfStars[event.target.attrs.id] = {mouseX: event.evt.clientX, mouseY: event.evt.clientY};
        this.setState({
            locationOfStars: locationOfStars,
            firstEdge: undefined,
        });
    }

    drawStars(){
        let starLocations = this.state.locationOfStars;
        if (starLocations.length === 0) {
            return;
        }
        let stars =[];
        let starColor = '#C1666B';
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
                onDragstart = { (event) => this.getOriginalCoordinates(event) }
                onDragMove = { (event) => this.update(event)}
                fill={starColor}
                stroke='white'
                draggable={true}
                onClick = { (event) => this.update(event)}
            />);
        }
        return stars;
    }

    getView(){
        let skyHeight = 677;
        let skyWidth = 800;
        let viewHeight = this.state.viewportHeight;
        let viewWidth = this.state.viewportWidth;
        console.log("MAP", this.state.mapOfEdges);
        console.log("Stars", this.state.locationOfStars);
        if(viewHeight <= skyHeight || viewWidth <= skyWidth){
            return(
                <Stage width={viewWidth} height={viewHeight}>
                    <Layer>
                        <Rect x={0} y={0} width={viewWidth} height={viewHeight} className="sky"
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
            )
        } else {
            let widthPadding = viewWidth < 900 ? 20 : 100;
            let heightPadding = viewHeight < 750 ? 20 : 70;
            let skyX = (viewWidth - skyWidth)/2;

            return (
                <Stage width={viewWidth} height={viewHeight}>
                    <Layer>
                        <Rect x={0} y={0} width={viewWidth} height={viewHeight} fill="#0E103D" />
                    </Layer>
                    <Layer>
                        <Text ref={"text"} className="title" x={viewWidth/2 - 400}  y={0} fontSize={70}  fontFamily="Monofett" fill="#A9A9A9" text="Constellation Maker" />
                        <Rect x={skyX} y={viewHeight - heightPadding - skyHeight} width={800} height={677} className="sky" fillPatternRepeat="no-repeat" fillPatternImage={this.state.fillPatternImage}
                              onClick={(event) => this.update(event)}/>
                    </Layer>
                    <Layer ref={"edgesLayer"}>
                        {this.drawEdges()}
                    </Layer>
                    <Layer>
                        {this.drawStars()}
                    </Layer>
                </Stage>
            )
        }
    }
    

render()
{
    return (
        <div>
            {this.getView()}
        </div>
    )
}
}

export default Sky;