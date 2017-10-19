var React = require('react');
var ReactDOM = require('react-dom');

var _ = require('underscore');
var React = require('react');

const Stars = (props) => {
  
  let stars = [];
  for (let i=0; i<props.numberOfStars; i++) {
  	stars.push(<i key={i} className="fa fa-star"></i>)
  }
	return (
  	<div className="col-5">
  	  {stars}
  	</div>
  );
}

const Button = (props) => {
	let button;
  
  switch(props.correct) {
  	case true:
    	button = 
    		<button className="btn btn-success" onClick={props.acceptAnswer}>
      		<i className="fa fa-check"></i>
      	</button>;
    	break;
    case false:
    	button = 
    		<button className="btn btn-danger" onClick={props.clearAnswer}>
      		<i className="fa fa-times"></i>
      	</button>;
    	break;
    default:
    	button = 
    		<button className="btn"
        				onClick={props.checkAnswer}
        				disabled={props.selectedNumbers.length === 0}>
      		=
      	</button>;
    	break;
  }
  
	return (
  	<div className="col-2 text-center">
  	  {button}
      <br/><br/>
      <button className="btn btn-warning btn-sm" onClick={props.redraw} disabled={props.redraws<1}>
      	<i className="fa fa-refresh"></i> {props.redraws}
      </button>
  	</div>
  );
}

const Answer = (props) => {
	return (
  	<div className="col-5">
  	  {props.selectedNumbers.map((number, i) =>
      	<span key={i} onClick={() => props.removeNumber(number)}>
        	{number}
        </span>
      )}
  	</div>
  );
}

const Numbers = (props) => {
  
  const numberClassName = (number) => {
  	if(props.selectedNumbers.indexOf(number) >=0) {
    	return 'selected';
    }
    if(props.usedNumbers.indexOf(number) >=0) {
    	return 'used';
    }
    
  }
  
	return (
  	<div className="card text-center">
  	  <div>
  	    {Numbers.list.map((number, i) => 
          	<span key={i} className={numberClassName(number)}
            			onClick={() => props.selectNumber(number)}>
            	{number}
            </span>
      	)}
  	  </div>
  	</div>
  );
}

const DoneFrame = (props) => {
	if(props.doneStatus[0].win) return(
  	<div className="card card-success">
      <div className="card-block">
        <div className="card-heading">
        	<h2 className="card-title">{props.doneStatus[0].title}</h2>
        </div>
        <div className="card-text">{props.doneStatus[0].description}</div>
        <div className="card-footer text-center">
          <button className="btn btn-secondary"
                  onClick={props.resetGame}>
            Play Again
          </button>
        </div>
      </div>
  	</div>
  );
  else return (
    <div className="card card-danger">
      <div className="card-block">
        <div className="card-heading">
        	<h2 className="card-title">{props.doneStatus[0].title}</h2>
        </div>
        <div className="card-text">{props.doneStatus[0].description}</div>
        <div className="card-footer text-center">
          <button className="btn btn-secondary"
                  onClick={props.resetGame}>
            Play Again
          </button>
        </div>
      </div>
  	</div>
  );
}

Numbers.list = _.range(1,10);

class Game extends React.Component {

	static randomNumber = () => 1 + Math.floor(Math.random()*9);
  
  static initialState = () => ({
  	selectedNumbers: [],
    usedNumbers: [],
    numberOfStars: Game.randomNumber(),
    correct: null,
    redraws: 5,
    doneStatus: []
  });
  
  state = Game.initialState();
  
  redraw = () => {
  	if(this.state.redraws===0){ return; }
    this.setState(prevState => ({
      redraws: prevState.redraws - 1,
      numberOfStars: Game.randomNumber()
    }), this.updateGameStatus);
  }
  
  selectNumber = (clickedNumber) => {
  	if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0 ||
    		this.state.usedNumbers.indexOf(clickedNumber) >= 0) 
        { return; }
    this.setState(prevState => ({
      correct: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };
  
  removeNumber = (clickedNumber) => {
    this.setState(prevState => ({
    	correct: null,
      selectedNumbers: prevState.selectedNumbers
          .filter(number => number !== clickedNumber)
      }));
    };
  
  checkAnswer = () => {
  	this.setState(prevState => ({
    	correct: prevState.numberOfStars ===
      	prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };
  
  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      correct: null,
      numberOfStars: 1 + Math.floor(Math.random()*9)
    }), this.updateGameStatus);
  };
  
  clearAnswer = () => {
  	this.setState({
      selectedNumbers: [],
      correct: null
    });
  };
  
  resetGame = () => {
  	this.setState(Game.initialState);
  };
  
  possibleSolutions = ({numberOfStars, usedNumbers}) => {
  
  	const possibleNumbers = _.range(10, 1).filter(number =>
    	usedNumbers.indexOf(number) === -1
    );
    
    for(let number of possibleNumbers){
    	if(number === numberOfStars) {
      	return true;
      }
      if(number > numberOfStars/2){
      	if(possibleNumbers.indexOf(numberOfStars-number) !== -1) {
        	return true;
        }
      } else break;
    }
    return false;
  };
  
  updateGameStatus = () => {
  	this.setState(prevState => {
    	if (prevState.usedNumbers.length === 9) {
      	return { doneStatus: [{
        						win: true,
        						title: "You Win!", 
                    description: "You've successfully used all of the numbers!"}]
        };
      } if (prevState.redraws < 1 && !this.possibleSolutions(prevState)) {
      	return { doneStatus: [{
        						win: false,
        						title: "Game Over!",
        						description: "You've run out of tries."}]};
      }
    });
  };

	render () {
  	
    const { selectedNumbers,
    				numberOfStars,
            correct,
            usedNumbers,
            redraws,
            doneStatus } = this.state;
    
  	return (
    	<div className="container">
      	<div className="row">
        	<div className="col-12">
          	<h3>Play Nine</h3>
          	<hr />
          </div>
        </div>
        <div className="row">
          <Stars numberOfStars={numberOfStars} />
        	<Button selectedNumbers={selectedNumbers}
      						checkAnswer={this.checkAnswer}
                  correct={correct}
                  acceptAnswer={this.acceptAnswer}
                  clearAnswer={this.clearAnswer}
                  redraw={this.redraw}
                  redraws={redraws}/>
        	<Answer selectedNumbers={selectedNumbers}
          				removeNumber={this.removeNumber}/>
        </div>
        <div className="row">
        	<div className="col-12">
          	<br />
            {doneStatus.length > 0 ? 
            	<DoneFrame doneStatus={doneStatus}
              						resetGame={this.resetGame}/> :
              <Numbers 	selectedNumbers={selectedNumbers}
            					selectNumber={this.selectNumber}
                      usedNumbers={usedNumbers}/>
            } 
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {

	render () {
  	return (
    	<div>
      	<Game />
    	</div>
    );
  };
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
);
